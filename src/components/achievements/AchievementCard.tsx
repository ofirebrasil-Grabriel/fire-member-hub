import { motion } from 'framer-motion';
import { Award, Calendar, Sparkles, Zap } from 'lucide-react';
import { Achievement } from '@/hooks/useAchievements';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
    achievement: Achievement;
    index?: number;
}

export default function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
    const formattedDate = new Date(achievement.claimed_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
                "border border-white/10 shadow-xl"
            )}
        >
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-yellow-500/10 pointer-events-none" />

            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Badge */}
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/30">
                                <div className="w-full h-full rounded-full bg-gray-900/90 flex items-center justify-center">
                                    <Award className="h-7 w-7 text-yellow-400" />
                                </div>
                            </div>
                            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
                        </div>

                        <div>
                            <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">
                                Dia {achievement.day_id}
                            </span>
                            <h3 className="text-white font-bold text-lg leading-tight">
                                {achievement.title}
                            </h3>
                        </div>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">
                            +{achievement.xp_earned} XP
                        </span>
                    </div>
                </div>

                {/* Reward Label */}
                {achievement.reward_label && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                        <Award className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-amber-400 text-xs font-medium">
                            {achievement.reward_label}
                        </span>
                    </div>
                )}

                {/* Motivation Phrase */}
                {achievement.motivation_phrase && (
                    <p className="text-white/70 text-sm italic leading-relaxed mb-4">
                        "{achievement.motivation_phrase}"
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Conquistado em {formattedDate}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
