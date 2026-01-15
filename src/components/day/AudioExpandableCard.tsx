import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Volume2, Play, Pause, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AudioExpandableCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  icon?: React.ReactNode;
  iconBgClass?: string;
  text: string;
  audioUrl?: string;
}

export const AudioExpandableCard = ({
  title,
  subtitle,
  emoji,
  icon,
  iconBgClass,
  text,
  audioUrl,
}: AudioExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackOptions = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime || 0);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [audioUrl, isSeeking]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (!audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card overflow-hidden">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      {/* Header with audio controls */}
      <div className="p-4 sm:p-6">
        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBgClass)}>
              {emoji ? <span className="text-xl">{emoji}</span> : icon}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          {/* Audio player */}
          <div className="flex items-center gap-2">
            {audioUrl ? (
              <>
                <Button onClick={handlePlayPause} className="btn-fire h-10 px-4">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Ouvir
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-10 px-3">
                      <Gauge className="h-4 w-4" />
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[7rem]">
                    <DropdownMenuRadioGroup
                      value={String(playbackRate)}
                      onValueChange={(value) => setPlaybackRate(Number(value))}
                    >
                      {playbackOptions.map((rate) => (
                        <DropdownMenuRadioItem key={rate} value={String(rate)}>
                          {rate}x
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Áudio em breve</span>
              </div>
            )}

            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
              aria-label={isExpanded ? 'Recolher texto' : 'Expandir texto'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Linha 1: Ícone + Título */}
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 shrink-0 rounded-xl flex items-center justify-center', iconBgClass)}>
              {emoji ? <span className="text-lg">{emoji}</span> : icon}
            </div>
            <h2 className="font-semibold text-base leading-tight">{title}</h2>
          </div>

          {/* Linha 2: Subtítulo */}
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-snug">{subtitle}</p>
          )}

          {/* Linha 3: Botões */}
          <div className="flex items-center gap-2">
            {audioUrl ? (
              <>
                <Button onClick={handlePlayPause} className="btn-fire h-10 flex-1">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Ouvir
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-10 px-3">
                      <Gauge className="h-4 w-4" />
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[7rem]">
                    <DropdownMenuRadioGroup
                      value={String(playbackRate)}
                      onValueChange={(value) => setPlaybackRate(Number(value))}
                    >
                      {playbackOptions.map((rate) => (
                        <DropdownMenuRadioItem key={rate} value={String(rate)}>
                          {rate}x
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors shrink-0"
                  aria-label={isExpanded ? 'Recolher texto' : 'Expandir texto'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-surface text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Áudio em breve</span>
              </div>
            )}
          </div>
        </div>

        {audioUrl && (
          <div className="mt-4 space-y-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 0}
              step={1}
              onValueChange={(value) => handleSeek(value[0])}
              onPointerDown={() => setIsSeeking(true)}
              onPointerUp={() => setIsSeeking(false)}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Playing indicator */}
        {isPlaying && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Reproduzindo áudio...</span>
          </div>
        )}
      </div>

      {/* Expandable text content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6 pt-2 border-t border-border/50">
          <p className="text-muted-foreground leading-relaxed">{text}</p>
        </div>
      </div>

      {/* Collapsed hint */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          className="px-6 pb-4 cursor-pointer group"
        >
          <p className="text-sm text-muted-foreground/60 group-hover:text-muted-foreground transition-colors flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            Clique para ver o texto
          </p>
        </div>
      )}
    </div>
  );
};
