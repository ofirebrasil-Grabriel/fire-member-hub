import { Download, FileSpreadsheet, FileText, Video, Music, File, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResourceFile } from '@/hooks/useDays';

interface ToolsListProps {
  tools: ResourceFile[];
}

const getToolIcon = (tool: ResourceFile) => {
  if (tool.type === 'pdf') return FileText;
  if (tool.type === 'spreadsheet') return FileSpreadsheet;
  if (tool.type === 'document') return FileText;
  if (tool.type === 'video') return Video;
  if (tool.type === 'audio') return Music;
  
  // Fallback based on name
  const nameLower = tool.name.toLowerCase();
  if (nameLower.includes('planilha') || nameLower.includes('calculadora')) return FileSpreadsheet;
  if (nameLower.includes('vídeo') || nameLower.includes('video')) return Video;
  if (nameLower.includes('áudio') || nameLower.includes('audio')) return Music;
  
  return File;
};

const handleDownload = (tool: ResourceFile) => {
  if (tool.url) {
    window.open(tool.url, '_blank');
  }
};

export const ToolsList = ({ tools }: ToolsListProps) => {
  const hasDownloadableFiles = tools.some(t => t.url);
  
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        Ferramentas do Dia
      </h3>
      
      <div className="space-y-3">
        {tools.map((tool, index) => {
          const Icon = getToolIcon(tool);
          const hasUrl = Boolean(tool.url);
          
          return (
            <div
              key={index}
              onClick={() => hasUrl && handleDownload(tool)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl bg-surface/50 border border-border/50",
                "transition-all group",
                hasUrl 
                  ? "hover:bg-surface hover:border-border cursor-pointer" 
                  : "opacity-75"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                hasUrl ? "bg-primary/10" : "bg-muted"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  hasUrl ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{tool.name}</p>
                <p className="text-xs text-muted-foreground">
                  {hasUrl ? 'Clique para baixar' : 'Em breve'}
                </p>
              </div>
              
              {hasUrl ? (
                <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              ) : (
                <ExternalLink className="w-5 h-5 text-muted-foreground/50" />
              )}
            </div>
          );
        })}
      </div>
      
      {!hasDownloadableFiles && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Os materiais serão disponibilizados pelo administrador
        </p>
      )}
    </div>
  );
};
