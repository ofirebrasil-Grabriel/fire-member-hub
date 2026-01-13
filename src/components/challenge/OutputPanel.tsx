import { OutputMetricValue } from '@/services/dayEngine';
import { cn } from '@/lib/utils';

interface OutputPanelProps {
  metrics: OutputMetricValue[];
  nextDay?: number | null;
}

const formatValue = (metric: OutputMetricValue) => {
  if (metric.format === 'currency') {
    const value = typeof metric.value === 'number' ? metric.value : Number(metric.value);
    if (Number.isFinite(value)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
      }).format(value);
    }
  }

  if (metric.format === 'percent') {
    const value = typeof metric.value === 'number' ? metric.value : Number(metric.value);
    if (Number.isFinite(value)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        maximumFractionDigits: 0,
      }).format(value / 100);
    }
  }

  return metric.value;
};

export const OutputPanel = ({ metrics, nextDay }: OutputPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-semibold">Dia Concluido!</h3>
        <p className="text-sm text-muted-foreground">Voce finalizou as etapas deste dia.</p>
      </div>

      {metrics.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.key} className="glass-card p-4">
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className={cn('text-xl font-semibold', metric.format === 'currency' && 'text-fire')}>
                {formatValue(metric)}
              </div>
            </div>
          ))}
        </div>
      )}

      {nextDay && (
        <div className="glass-card p-5 text-center">
          <p className="text-sm text-muted-foreground">Dia {nextDay} desbloqueado!</p>
        </div>
      )}
    </div>
  );
};
