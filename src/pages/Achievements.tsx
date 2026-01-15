import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, TrendingUp, Trophy, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementCard from '@/components/achievements/AchievementCard';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Achievements = () => {
    const { achievements, stats, loading, fetchAchievements, fetchUserStats } = useAchievements();

    useEffect(() => {
        fetchAchievements();
        fetchUserStats();
    }, [fetchAchievements, fetchUserStats]);

    const totalDays = 15;
    const completedDays = achievements.length;
    const completionPercentage = (completedDays / totalDays) * 100;

    return (
        <Layout>
            <div className="min-h-screen pb-20">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 p-6 mb-8">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-yellow-500/10 pointer-events-none" />

                    <div className="relative">
                        {/* Level Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-1 shadow-lg shadow-orange-500/40">
                                        <div className="w-full h-full rounded-full bg-gray-900/90 flex items-center justify-center">
                                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                                                {stats.level}
                                            </span>
                                        </div>
                                    </div>
                                    <Star className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 fill-yellow-400" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-1">
                                        Nível {stats.level}
                                    </p>
                                    <h1 className="text-2xl font-bold text-white">
                                        {stats.levelTitle}
                                    </h1>
                                </div>
                            </div>

                            {/* XP Counter */}
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                <Zap className="h-6 w-6 text-yellow-400" />
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-wider">XP Total</p>
                                    <p className="text-xl font-bold text-white">{stats.xp_total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress to next level */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-white/60">Progresso para o nível {stats.level + 1}</span>
                                <span className="text-orange-400 font-medium">{Math.round(stats.progress)}%</span>
                            </div>
                            <Progress value={stats.progress} className="h-2 bg-white/10" />
                            <p className="text-xs text-white/40 mt-1">
                                {stats.xp_total} / {stats.nextLevelXp} XP
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                                <Trophy className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{completedDays}</p>
                                <p className="text-xs text-white/50">Conquistas</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                                <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{Math.round(completionPercentage)}%</p>
                                <p className="text-xs text-white/50">Completo</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                                <Award className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{totalDays - completedDays}</p>
                                <p className="text-xs text-white/50">Restantes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Suas Conquistas
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
                            <Award className="h-12 w-12 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white/60 mb-2">
                                Nenhuma conquista ainda
                            </h3>
                            <p className="text-sm text-white/40">
                                Complete os dias do desafio para ganhar conquistas e XP!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map((achievement, index) => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Achievements;
