import { useEffect, useState, useCallback } from 'react';
import { Webhook, RefreshCw, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Json } from '@/integrations/supabase/types';

interface WebhookLog {
  id: string;
  source: string;
  event: string;
  payload: Json;
  response: Json | null;
  status_code: number | null;
  received_at: string;
}

export const AdminWebhooks = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    
    let query = supabase
      .from('webhook_logs')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(100);

    if (sourceFilter && sourceFilter !== 'all') {
      query = query.eq('source', sourceFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching webhook logs:', error);
      toast({ title: 'Erro ao carregar logs', variant: 'destructive' });
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }, [sourceFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.event?.toLowerCase().includes(searchLower) ||
      log.source?.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.payload)?.toLowerCase().includes(searchLower)
    );
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Copiado!' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (statusCode: number | null) => {
    if (!statusCode) return <Clock size={16} className="text-muted-foreground" />;
    if (statusCode >= 200 && statusCode < 300) return <CheckCircle size={16} className="text-success" />;
    if (statusCode >= 400) return <XCircle size={16} className="text-destructive" />;
    return <AlertTriangle size={16} className="text-warning" />;
  };

  const getEventBadge = (event: string, payload: Json) => {
    const eventLower = event?.toLowerCase() || '';
    const payloadRecord = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : {};
    const payloadEventValue = payloadRecord.event;
    const payloadEvent = typeof payloadEventValue === 'string' ? payloadEventValue.toLowerCase() : '';
    
    if (eventLower.includes('approved') || eventLower.includes('complete') || payloadEvent.includes('approved')) {
      return 'bg-success/20 text-success border-success/30';
    }
    if (eventLower.includes('cancel') || eventLower.includes('refund') || payloadEvent.includes('cancel') || payloadEvent.includes('refund')) {
      return 'bg-destructive/20 text-destructive border-destructive/30';
    }
    if (eventLower.includes('overdue') || payloadEvent.includes('overdue')) {
      return 'bg-warning/20 text-warning border-warning/30';
    }
    return 'bg-primary/20 text-primary border-primary/30';
  };

  const extractInfo = (payload: Json) => {
    const payloadRecord = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : {};
    const data = typeof payloadRecord.data === 'object' && payloadRecord.data !== null
      ? (payloadRecord.data as Record<string, unknown>)
      : payloadRecord;
    const buyer = typeof data.buyer === 'object' && data.buyer !== null
      ? (data.buyer as Record<string, unknown>)
      : {};
    const product = typeof data.product === 'object' && data.product !== null
      ? (data.product as Record<string, unknown>)
      : {};
    return {
      email: (buyer.email as string) || (data.email as string) || (data.user_email as string) || 'N/A',
      product: (product.name as string) || (data.product_name as string) || 'N/A',
      event: (payloadRecord.event as string) || (payloadRecord.hottok as string) || 'Evento',
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Webhook className="text-primary" />
            Logs de Webhooks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitore integrações Hotmart e n8n em tempo real.
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" className="gap-2" disabled={loading}>
          <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por evento, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filtrar por fonte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fontes</SelectItem>
            <SelectItem value="hotmart">Hotmart</SelectItem>
            <SelectItem value="n8n">n8n</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: logs.length, color: 'text-primary' },
          { label: 'Hotmart', value: logs.filter(l => l.source === 'hotmart').length, color: 'text-fire' },
          { label: 'n8n', value: logs.filter(l => l.source === 'n8n').length, color: 'text-success' },
          { label: 'Erros', value: logs.filter(l => l.status_code && l.status_code >= 400).length, color: 'text-destructive' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Logs List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="animate-spin inline-block mr-2" />
            Carregando logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Webhook className="mx-auto mb-4 opacity-50" size={48} />
            <p>Nenhum log encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const info = extractInfo(log.payload);
              const isExpanded = expandedLog === log.id;
              
              return (
                <div key={log.id} className="hover:bg-surface/50 transition-colors">
                  <div 
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {getStatusIcon(log.status_code)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-bold border',
                            getEventBadge(log.event, log.payload)
                          )}>
                            {info.event}
                          </span>
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            log.source === 'hotmart' ? 'bg-fire/20 text-fire' : 'bg-success/20 text-success'
                          )}>
                            {log.source}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {info.email}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(log.received_at).toLocaleString('pt-BR')}
                        </p>
                        {log.status_code && (
                          <span className={cn(
                            'text-xs font-mono',
                            log.status_code >= 200 && log.status_code < 300 ? 'text-success' : 'text-destructive'
                          )}>
                            HTTP {log.status_code}
                          </span>
                        )}
                      </div>
                    </div>

                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted-foreground">Payload</label>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(JSON.stringify(log.payload, null, 2), `payload-${log.id}`);
                              }}
                              className="p-1 rounded hover:bg-muted"
                            >
                              {copiedId === `payload-${log.id}` ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <pre className="bg-surface p-3 rounded-lg text-xs overflow-x-auto max-h-64">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted-foreground">Response</label>
                            {log.response && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(JSON.stringify(log.response, null, 2), `response-${log.id}`);
                                }}
                                className="p-1 rounded hover:bg-muted"
                              >
                                {copiedId === `response-${log.id}` ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                              </button>
                            )}
                          </div>
                          <pre className="bg-surface p-3 rounded-lg text-xs overflow-x-auto max-h-64">
                            {log.response ? JSON.stringify(log.response, null, 2) : 'N/A'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
