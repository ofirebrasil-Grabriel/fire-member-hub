import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Sparkles, Download, Share2, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useAchievements } from '@/hooks/useAchievements';
import { toast } from '@/hooks/use-toast';

interface DayCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue?: () => void;
    dayId: number;
    dayTitle: string;
    motivationPhrase: string;
    rewardLabel: string;
    rewardIcon?: string;
    xpReward?: number;
}

const DayCelebrationModal: React.FC<DayCelebrationModalProps> = ({
    isOpen,
    onClose,
    onContinue,
    dayId,
    dayTitle,
    motivationPhrase,
    rewardLabel,
    rewardIcon = 'award',
    xpReward = 100,
}) => {
    const { claimReward, isRewardClaimed, progress } = useUserProgress();
    const { claimAchievement } = useAchievements();
    const [claimed, setClaimed] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    useEffect(() => {
        if (isOpen && !isRewardClaimed(dayId)) {
            // Dispara confete
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    particleCount,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                        x: randomInRange(0.1, 0.9),
                        y: Math.random() - 0.2,
                    },
                    colors: ['#FF6B35', '#FFB800', '#FF4444', '#FFA500'],
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen, dayId, isRewardClaimed]);

    const handleClaimReward = async () => {
        // Save to day_progress
        await claimReward(dayId);

        // Save to achievements table with XP
        const success = await claimAchievement(
            dayId,
            dayTitle,
            motivationPhrase,
            rewardLabel,
            xpReward
        );

        if (success) {
            setXpEarned(xpReward);
            toast({ title: `+${xpReward} XP ganho!`, description: 'Conquista salva!' });
        }

        setClaimed(true);
    };

    const getIconComponent = () => {
        // Retorna ícone baseado no rewardIcon string
        return <Award className="h-16 w-16 text-yellow-400" />;
    };

    const handleDownloadPDF = async () => {
        try {
            const { generateDayReport } = await import('@/lib/printReport');
            const { generateDayAnalysis } = await import('@/lib/dayAnalysis');

            const formData = progress.daysProgress[dayId]?.form_data as Record<string, unknown> || {};
            const completedAt = progress.daysProgress[dayId]?.completedAt || new Date().toISOString();
            const analysis = generateDayAnalysis(dayId, formData);

            await generateDayReport({
                dayId,
                dayTitle,
                completedAt,
                metrics: [],
                formData,
                analysis,
                userName: progress.userName,
                motivationPhrase,
                xpEarned: xpReward,
            });

            toast({ title: 'PDF gerado com sucesso!' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast({ title: 'Erro ao gerar PDF', variant: 'destructive' });
        }
    };

    const handleShare = async () => {
        const shareText = `🔥 Completei o Dia ${dayId} do Desafio FIRE 15D! ${dayTitle}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Desafio FIRE 15D',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled or error
                if ((error as Error).name !== 'AbortError') {
                    await copyToClipboard(shareText);
                }
            }
        } else {
            await copyToClipboard(shareText);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: 'Copiado para a área de transferência!' });
        } catch {
            toast({ title: 'Não foi possível copiar', variant: 'destructive' });
        }
    };

    const handleContinue = () => {
        onClose();
        onContinue?.();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-yellow-500/10 pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="h-5 w-5 text-white/70" />
                        </button>

                        {/* Content */}
                        <div className="relative p-8 text-center">
                            {/* Badge animation */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                                className="relative mx-auto mb-6 w-32 h-32 flex items-center justify-center"
                            >
                                {/* Glow ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-30 blur-xl animate-pulse" />

                                {/* Badge container */}
                                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-1 shadow-lg shadow-orange-500/50">
                                    <div className="w-full h-full rounded-full bg-gray-900/90 flex items-center justify-center">
                                        {getIconComponent()}
                                    </div>
                                </div>

                                {/* Sparkles */}
                                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
                                <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 text-orange-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                            </motion.div>

                            {/* Title */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-1">
                                    Dia {dayId} Concluído!
                                </p>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Parabéns! 🎉
                                </h2>
                                <p className="text-white/60 text-sm mb-4">
                                    {dayTitle}
                                </p>
                            </motion.div>

                            {/* Reward label */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 mb-6"
                            >
                                <Award className="h-4 w-4 text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{rewardLabel}</span>
                            </motion.div>

                            {/* Motivation phrase */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <p className="text-lg text-white/90 italic leading-relaxed">
                                    "{motivationPhrase}"
                                </p>
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col gap-3"
                            >
                                {!claimed && !isRewardClaimed(dayId) ? (
                                    <Button
                                        onClick={handleClaimReward}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30"
                                    >
                                        <Award className="mr-2 h-5 w-5" />
                                        Resgatar Conquista
                                    </Button>
                                ) : (
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                                            onClick={handleDownloadPDF}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Baixar PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Compartilhar
                                        </Button>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    className="text-white/60 hover:text-white hover:bg-white/10"
                                    onClick={handleContinue}
                                >
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    {dayId < 15 ? 'Continuar para a próxima tarefa' : 'Finalizar desafio'}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DayCelebrationModal;
