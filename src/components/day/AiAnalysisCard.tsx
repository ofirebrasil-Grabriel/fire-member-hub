import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiDayReportPayload, extractAiSections } from '@/lib/aiDayReport';

interface AiAnalysisCardProps {
  report: AiDayReportPayload;
  title?: string;
}

export default function AiAnalysisCard({ report, title = 'Analise do Dia' }: AiAnalysisCardProps) {
  const sections = extractAiSections(report);
  const highlights = Array.isArray(sections.highlights) ? sections.highlights : [];
  const extras = Array.isArray(sections.extras) ? sections.extras : [];
  const hasContent =
    sections.toneMessage ||
    sections.summary ||
    highlights.length > 0 ||
    extras.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <Card className="glass-card border-primary/15">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-lg flex items-center gap-2">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Leitura personalizada para o seu momento.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {sections.toneMessage && (
          <p className="text-sm font-medium text-amber-100 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            {sections.toneMessage}
          </p>
        )}
        {sections.summary && (
          <div>
            <p className="font-semibold">Resumo do dia</p>
            <p className="text-muted-foreground">{sections.summary}</p>
          </div>
        )}
        {highlights.length > 0 && (
          <div>
            <p className="font-semibold">Pontos principais</p>
            <ul className="list-disc pl-5 text-muted-foreground">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {extras.map((extra) => (
          <div key={extra.title}>
            <p className="font-semibold">{extra.title}</p>
            {Array.isArray(extra.value) ? (
              <ul className="list-disc pl-5 text-muted-foreground">
                {extra.value.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{extra.value}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
