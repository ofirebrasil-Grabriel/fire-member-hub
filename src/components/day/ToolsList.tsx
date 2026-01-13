import { Download, FileSpreadsheet, FileText, Video, Music, File, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResourceFile } from '@/hooks/useDays';

interface ToolsListProps {
  tools: ResourceFile[];
}

/**
 * Tenta extrair um objeto válido de uma string que pode estar em formato JSON
 * mas com vários problemas de encoding/escaping
 */
const extractObjectFromString = (input: unknown): Record<string, unknown> | null => {
  if (!input) return null;

  // Se já é um objeto, retorna ele
  if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }

  if (typeof input !== 'string') return null;

  const str = String(input).trim();
  if (!str) return null;

  // Tenta várias abordagens de parsing
  const attempts = [
    // 1. Tentar parse direto
    () => JSON.parse(str),
    // 2. Remover escapes duplos
    () => JSON.parse(str.replace(/\\\\/g, '\\')),
    // 3. Substituir aspas simples por duplas
    () => JSON.parse(str.replace(/'/g, '"')),
    // 4. Remover escapes de aspas
    () => JSON.parse(str.replace(/\\"/g, '"')),
    // 5. Parse do resultado (caso seja string encapsulada)
    () => {
      const strToParse = typeof str === 'string' ? str : JSON.stringify(str);
      const first = JSON.parse(strToParse);
      if (typeof first === 'string' && (first.startsWith('{') || first.startsWith('['))) {
        return JSON.parse(first);
      }
      return first;
    },
    // 6. Extrair via regex como fallback
    () => {
      const nameMatch = str.match(/["']?name["']?\s*[:=]\s*["']([^"']+)["']/i);
      const urlMatch = str.match(/["']?url["']?\s*[:=]\s*["']([^"']+)["']/i);
      const typeMatch = str.match(/["']?type["']?\s*[:=]\s*["']([^"']+)["']/i);
      if (nameMatch || urlMatch) {
        return {
          name: nameMatch?.[1] || undefined,
          url: urlMatch?.[1] || undefined,
          type: typeMatch?.[1] || undefined,
        };
      }
      return null;
    },
  ];

  for (const attempt of attempts) {
    try {
      const result = attempt();
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return result as Record<string, unknown>;
      }
    } catch {
      // Ignora e tenta próxima abordagem
    }
  }

  return null;
};

/**
 * Normaliza um tool para garantir que name, url e type estão corretos
 */
const normalizeTool = (tool: ResourceFile): ResourceFile => {
  if (!tool) return { name: 'Recurso', url: '', type: 'text' };

  // Se name já parece ser um nome normal (não JSON), retorna como está
  const nameStr = String(tool.name || '').trim();
  if (nameStr && !nameStr.startsWith('{') && !nameStr.startsWith('[') && !nameStr.includes('"name"')) {
    return {
      name: nameStr || 'Recurso',
      url: tool.url || '',
      type: tool.type || 'text',
    };
  }

  // Tenta extrair objeto do campo name
  const parsed = extractObjectFromString(tool.name);

  if (parsed) {
    return {
      name: String(parsed.name || parsed.title || 'Recurso').trim(),
      url: String(parsed.url || parsed.link || tool.url || '').trim(),
      type: String(parsed.type || tool.type || 'text').trim(),
    };
  }

  // Fallback: usa o que vier, mas limpa o name se for JSON inválido
  let finalName = nameStr;
  if (finalName.startsWith('{') || finalName.startsWith('[')) {
    finalName = 'Recurso';
  }

  return {
    name: finalName || 'Recurso',
    url: tool.url || '',
    type: tool.type || 'text',
  };
};

const getToolIcon = (tool: ResourceFile) => {
  const type = (tool.type || '').toLowerCase();
  const name = (tool.name || '').toLowerCase();

  if (type === 'pdf' || name.includes('.pdf')) return FileText;
  if (type === 'spreadsheet' || name.includes('planilha') || name.includes('excel') || name.includes('.xlsx')) return FileSpreadsheet;
  if (type === 'document' || name.includes('.doc')) return FileText;
  if (type === 'video' || name.includes('vídeo') || name.includes('video')) return Video;
  if (type === 'audio' || name.includes('áudio') || name.includes('audio')) return Music;

  return File;
};

const handleDownload = (tool: ResourceFile) => {
  if (tool.url) {
    window.open(tool.url, '_blank');
  }
};

export const ToolsList = ({ tools }: ToolsListProps) => {
  const normalizedTools = tools.map(normalizeTool);
  const hasDownloadableFiles = normalizedTools.some(t => t.url);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
        <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
        Recursos extras
      </h3>

      <div className="space-y-3">
        {normalizedTools.map((tool, index) => {
          const Icon = getToolIcon(tool);
          const hasUrl = Boolean(tool.url);

          return (
            <div
              key={index}
              onClick={() => hasUrl && handleDownload(tool)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/50",
                "transition-all group",
                hasUrl
                  ? "hover:bg-surface hover:border-border cursor-pointer"
                  : "opacity-75"
              )}
            >
              <div className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0",
                hasUrl ? "bg-primary/10" : "bg-muted"
              )}>
                <Icon className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  hasUrl ? "text-primary" : "text-muted-foreground"
                )} />
              </div>

              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-medium text-sm sm:text-base truncate">{tool.name}</p>
                <p className="text-xs text-muted-foreground">
                  {hasUrl ? 'Clique para baixar' : 'Em breve'}
                </p>
              </div>

              <div className="shrink-0">
                {hasUrl ? (
                  <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>
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
