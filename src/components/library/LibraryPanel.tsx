import { useEffect, useMemo, useState } from 'react';
import { Copy, FileText, FolderOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ToolsList } from '@/components/day/ToolsList';
import { toast } from '@/hooks/use-toast';
import { useLibraryItems } from '@/hooks/useLibrary';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useDays } from '@/hooks/useDays';

export type LibraryTab = 'scripts' | 'anti' | 'cuts' | 'extras';

interface LibraryPanelProps {
  defaultTab?: LibraryTab;
}

export const LibraryPanel = ({ defaultTab = 'scripts' }: LibraryPanelProps) => {
  const [tab, setTab] = useState<LibraryTab>(defaultTab);
  const { items, loading, error } = useLibraryItems();
  const { progress } = useUserProgress();
  const { days } = useDays();

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const scriptsByChannel = useMemo(() => {
    return items
      .filter((item) => item.category === 'scripts')
      .reduce<Record<string, typeof items>>((acc, item) => {
        const group = item.group_label || 'Geral';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {});
  }, [items]);

  const antiItems = useMemo(
    () => items.filter((item) => item.category === 'anti'),
    [items]
  );

  const cutsByCategory = useMemo(() => {
    return items
      .filter((item) => item.category === 'cuts')
      .reduce<Record<string, typeof items>>((acc, item) => {
        const group = item.group_label || 'Outros';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {});
  }, [items]);

  const currentDay = useMemo(
    () => days.find((day) => day.id === progress.currentDay),
    [days, progress.currentDay]
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copiado para a area de transferencia' });
    } catch (copyError) {
      toast({ title: 'Nao foi possivel copiar', variant: 'destructive' });
    }
  };

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as LibraryTab)}>
      <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <TabsTrigger value="scripts">Scripts</TabsTrigger>
        <TabsTrigger value="anti">Anti-golpe</TabsTrigger>
        <TabsTrigger value="cuts">Cortes</TabsTrigger>
        <TabsTrigger value="extras">Recursos extras</TabsTrigger>
      </TabsList>

      <TabsContent value="scripts" className="space-y-4">
        {loading ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">Carregando biblioteca...</div>
        ) : error ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">{error}</div>
        ) : Object.keys(scriptsByChannel).length === 0 ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhum script cadastrado ainda.
          </div>
        ) : (
          Object.entries(scriptsByChannel).map(([channel, scripts]) => (
            <div key={channel} className="space-y-3">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">
                {channel}
              </h4>
              <div className="grid gap-3">
                {scripts.map((script) => (
                  <div key={script.id} className="glass-card p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium">{script.label}</div>
                      {script.description && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(script.description || '')}
                        >
                          <Copy className="w-4 h-4" />
                          Copiar
                        </Button>
                      )}
                    </div>
                    {script.description && (
                      <p className="text-sm text-muted-foreground">{script.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="anti" className="space-y-3">
        {loading ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">Carregando biblioteca...</div>
        ) : error ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">{error}</div>
        ) : antiItems.length === 0 ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhum item de anti-golpe cadastrado.
          </div>
        ) : (
          <div className="glass-card p-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              {antiItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </TabsContent>

      <TabsContent value="cuts" className="space-y-4">
        {loading ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">Carregando biblioteca...</div>
        ) : error ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">{error}</div>
        ) : Object.keys(cutsByCategory).length === 0 ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhuma lista de cortes cadastrada.
          </div>
        ) : (
          Object.entries(cutsByCategory).map(([category, cutItems]) => (
            <div key={category} className="glass-card p-4">
              <h4 className="font-semibold capitalize">{category}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {cutItems.map((item) => (
                  <li key={item.id}>- {item.label}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="extras" className="space-y-4">
        {!currentDay ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhum dia encontrado para mostrar recursos extras.
          </div>
        ) : currentDay.tools.length === 0 ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhum recurso extra cadastrado para o dia atual.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderOpen className="h-4 w-4 text-primary" />
              Recursos extras do Dia {currentDay.id}
            </div>
            <ToolsList tools={currentDay.tools} />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
