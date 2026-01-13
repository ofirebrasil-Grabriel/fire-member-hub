import * as React from 'react';
import { cn } from '@/lib/utils';

type TimelineOrientation = 'horizontal' | 'vertical';
type TimelineColor = 'primary' | 'secondary' | 'muted' | 'success' | 'destructive';

interface TimelineContextValue {
  orientation: TimelineOrientation;
  color: TimelineColor;
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null);

const useTimelineContext = () => {
  const context = React.useContext(TimelineContext);
  if (!context) {
    throw new Error('Timeline components must be used within <Timeline>');
  }
  return context;
};

const colorStyles: Record<TimelineColor, { line: string; icon: string }> = {
  primary: {
    line: 'bg-primary/40',
    icon: 'border-primary/50 bg-primary/10 text-primary',
  },
  secondary: {
    line: 'bg-border/60',
    icon: 'border-border/70 bg-surface/80 text-foreground',
  },
  muted: {
    line: 'bg-muted/70',
    icon: 'border-muted/70 bg-muted/30 text-muted-foreground',
  },
  success: {
    line: 'bg-success/40',
    icon: 'border-success/50 bg-success/10 text-success',
  },
  destructive: {
    line: 'bg-destructive/40',
    icon: 'border-destructive/50 bg-destructive/10 text-destructive',
  },
};

interface TimelineProps {
  orientation?: TimelineOrientation;
  color?: TimelineColor;
  className?: string;
  children: React.ReactNode;
}

const Timeline = ({
  orientation = 'vertical',
  color = 'primary',
  className,
  children,
}: TimelineProps) => {
  return (
    <TimelineContext.Provider value={{ orientation, color }}>
      <div
        className={cn(
          orientation === 'vertical'
            ? 'relative flex w-full flex-col gap-6'
            : 'relative flex w-full items-start gap-6 overflow-x-auto pb-3',
          className
        )}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
};

type TimelineItemProps = React.HTMLAttributes<HTMLDivElement>;

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useTimelineContext();
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'vertical'
            ? 'relative flex items-start gap-4'
            : 'relative flex min-w-[220px] flex-col gap-3',
          className
        )}
        {...props}
      />
    );
  }
);
TimelineItem.displayName = 'TimelineItem';

type TimelineHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useTimelineContext();
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'vertical'
            ? 'relative flex w-10 flex-col items-center self-stretch'
            : 'relative flex items-center',
          className
        )}
        {...props}
      />
    );
  }
);
TimelineHeader.displayName = 'TimelineHeader';

type TimelineSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;

const TimelineSeparator = React.forwardRef<HTMLSpanElement, TimelineSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation, color } = useTimelineContext();
    return (
      <span
        ref={ref}
        className={cn(
          orientation === 'vertical'
            ? 'absolute left-1/2 top-8 h-[calc(100%-2rem)] w-px -translate-x-1/2'
            : 'absolute left-8 right-0 top-1/2 h-px -translate-y-1/2',
          colorStyles[color].line,
          className
        )}
        {...props}
      />
    );
  }
);
TimelineSeparator.displayName = 'TimelineSeparator';

type TimelineIconProps = React.HTMLAttributes<HTMLDivElement>;

const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  ({ className, ...props }, ref) => {
    const { color } = useTimelineContext();
    return (
      <div
        ref={ref}
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-glass',
          colorStyles[color].icon,
          className
        )}
        {...props}
      />
    );
  }
);
TimelineIcon.displayName = 'TimelineIcon';

type TimelineBodyProps = React.HTMLAttributes<HTMLDivElement>;

const TimelineBody = React.forwardRef<HTMLDivElement, TimelineBodyProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useTimelineContext();
    return (
      <div
        ref={ref}
        className={cn(orientation === 'vertical' ? 'flex-1' : '', className)}
        {...props}
      />
    );
  }
);
TimelineBody.displayName = 'TimelineBody';

export {
  Timeline,
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineSeparator,
};
export type { TimelineColor, TimelineOrientation };
