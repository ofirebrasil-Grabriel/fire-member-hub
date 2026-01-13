import * as React from 'react';
import { cn } from '@/lib/utils';

type TimelineOrientation = 'horizontal' | 'vertical';
type TimelineVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success';

interface TimelineProps {
  orientation?: TimelineOrientation;
  className?: string;
  children: React.ReactNode;
}

interface TimelineItemProps {
  variant?: TimelineVariant;
  className?: string;
  children: React.ReactNode;
  orientation?: TimelineOrientation;
  isLast?: boolean;
}

const TimelineItemContext = React.createContext<{ variant: TimelineVariant } | null>(null);

const useTimelineVariant = () => {
  const context = React.useContext(TimelineItemContext);
  return context?.variant ?? 'default';
};

const variantStyles: Record<
  TimelineVariant,
  { dot: string; line: string; date: string; title: string; description: string }
> = {
  default: {
    dot: 'bg-primary shadow-fire',
    line: 'bg-primary/40',
    date: 'text-primary',
    title: 'text-foreground',
    description: 'text-muted-foreground',
  },
  secondary: {
    dot: 'bg-muted-foreground/40',
    line: 'bg-border/60',
    date: 'text-muted-foreground',
    title: 'text-muted-foreground',
    description: 'text-muted-foreground/80',
  },
  outline: {
    dot: 'bg-background border-2 border-primary shadow-fire',
    line: 'bg-primary/40',
    date: 'text-primary',
    title: 'text-foreground',
    description: 'text-muted-foreground',
  },
  destructive: {
    dot: 'bg-destructive',
    line: 'bg-destructive/60',
    date: 'text-destructive',
    title: 'text-destructive',
    description: 'text-muted-foreground',
  },
  success: {
    dot: 'bg-success',
    line: 'bg-success/50',
    date: 'text-success',
    title: 'text-foreground',
    description: 'text-muted-foreground',
  },
};

const Timeline = ({ orientation = 'horizontal', className, children }: TimelineProps) => {
  const nodes = React.Children.toArray(children);
  const timelineItems = nodes.filter(
    (child) => React.isValidElement(child) && child.type === TimelineItem
  );
  let itemIndex = 0;

  return (
    <div
      className={cn(
        orientation === 'horizontal'
          ? 'flex items-start gap-6 overflow-x-auto pb-3'
          : 'flex flex-col gap-6',
        className
      )}
    >
      {nodes.map((child) => {
        if (React.isValidElement(child) && child.type === TimelineItem) {
          const isLast = itemIndex === timelineItems.length - 1;
          itemIndex += 1;
          return React.cloneElement(child, { orientation, isLast });
        }
        return child;
      })}
    </div>
  );
};

const TimelineItem = ({
  variant = 'default',
  className,
  children,
  orientation = 'horizontal',
  isLast = false,
}: TimelineItemProps) => {
  const styles = variantStyles[variant];

  return (
    <TimelineItemContext.Provider value={{ variant }}>
      {orientation === 'horizontal' ? (
        <div className={cn('relative flex min-w-[220px] flex-col gap-3', className)}>
          <div className="relative flex items-center">
            <span className={cn('relative z-10 h-3 w-3 rounded-full', styles.dot)} />
            {!isLast && (
              <span className={cn('absolute left-1.5 right-0 top-1.5 h-px', styles.line)} />
            )}
          </div>
          <div className="space-y-1">{children}</div>
        </div>
      ) : (
        <div className={cn('relative flex gap-4', className)}>
          <span className={cn('mt-1 h-3 w-3 rounded-full', styles.dot)} />
          {!isLast && (
            <span className={cn('absolute left-1.5 top-5 h-[calc(100%-1.25rem)] w-px', styles.line)} />
          )}
          <div className="space-y-1 pb-4">{children}</div>
        </div>
      )}
    </TimelineItemContext.Provider>
  );
};

const TimelineItemDate = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const variant = useTimelineVariant();
  return (
    <div
      className={cn(
        'text-xs font-semibold uppercase tracking-widest',
        variantStyles[variant].date,
        className
      )}
      {...props}
    />
  );
};

const TimelineItemTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  const variant = useTimelineVariant();
  return (
    <p className={cn('text-sm font-semibold', variantStyles[variant].title, className)} {...props} />
  );
};

const TimelineItemDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  const variant = useTimelineVariant();
  return (
    <p className={cn('text-xs', variantStyles[variant].description, className)} {...props} />
  );
};

export {
  Timeline,
  TimelineItem,
  TimelineItemDate,
  TimelineItemTitle,
  TimelineItemDescription,
};
export type { TimelineOrientation, TimelineVariant };
export default Timeline;
