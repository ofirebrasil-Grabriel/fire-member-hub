import { Download, FileSpreadsheet, FileText, Video, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolsListProps {
  tools: string[];
}

const getToolIcon = (tool: string) => {
  const toolLower = tool.toLowerCase();
  if (toolLower.includes('planilha') || toolLower.includes('calculadora')) return FileSpreadsheet;
  if (toolLower.includes('vídeo')) return Video;
  if (toolLower.includes('áudio')) return Music;
  return FileText;
};

export const ToolsList = ({ tools }: ToolsListProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        Ferramentas do Dia
      </h3>
      
      <div className="space-y-3">
        {tools.map((tool, index) => {
          const Icon = getToolIcon(tool);
          
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl bg-surface/50 border border-border/50",
                "hover:bg-surface hover:border-border transition-all cursor-pointer group"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{tool}</p>
                <p className="text-xs text-muted-foreground">Clique para baixar</p>
              </div>
              
              <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Os materiais estarão disponíveis após conectar o backend
      </p>
    </div>
  );
};
