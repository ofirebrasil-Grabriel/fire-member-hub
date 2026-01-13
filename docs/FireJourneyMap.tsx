import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Eye, Scan, Search, Calculator, Scissors, Phone, Shield,
    Brain, ShoppingBag, PieChart, Tags, Compass, Repeat,
    Flame, Trophy
} from "lucide-react";

const roadmapData = [
    { day: 1, title: "O Despertar", desc: "Encara a realidade sem culpa e inicia o diário financeiro emocional.", icon: Eye },
    { day: 2, title: "Raio-X Completo", desc: "Mapeia entradas, bicos, dívidas, cartão e boletos com a planilha pronta.", icon: Scan },
    { day: 3, title: "Arqueologia Financeira", desc: "Entende os gatilhos e momentos em que desperdiça dinheiro.", icon: Search },
    { day: 4, title: "Calculando a Realidade", desc: "Descobre se está no positivo ou vermelho e lista inimigos financeiros.", icon: Calculator },
    { day: 5, title: "O Cirurgião", desc: "Aplica a planilha de cortes inteligentes e protege o que te faz bem.", icon: Scissors },
    { day: 6, title: "Arte da Renegociação", desc: "Usa scripts prontos para reduzir boletos sem vergonha.", icon: Phone },
    { day: 7, title: "Sistema Anti-Desperdício", desc: "Monta um sistema simples e hábitos semanais para não voltar ao caos.", icon: Shield },
    { day: 8, title: "Mentalidade Foge de Dinheiro", desc: "Aprende a negociar tudo e nunca aceitar o primeiro preço.", icon: Brain },
    { day: 9, title: "Austeridade Inteligente", desc: "Diferencia necessidade de desejo sem se sentir pobre.", icon: ShoppingBag },
    { day: 10, title: "Orçamento Realista", desc: "Cria orçamento em essencial, lazer e reserva adaptado ao Brasil.", icon: PieChart },
    { day: 11, title: "Categorização Consciente", desc: "Organiza gastos por categoria sem complicação.", icon: Tags },
    { day: 12, title: "Priorização por Valores", desc: "Realoca o dinheiro conforme a Roda dos Valores.", icon: Compass },
    { day: 13, title: "Sistema Sustentável", desc: "Une tudo em planilha mestra e indicadores simples.", icon: Repeat },
    { day: 14, title: "Visão FIRE", desc: "Olha além do fim do mês e compara aposentadoria tradicional x FIRE.", icon: Flame },
    { day: 15, title: "O Novo Você", desc: "Registra conquistas e plano de continuidade para não voltar ao aperto.", icon: Trophy },
];

export const FireJourneyMap = ({ darkMode = false }: { darkMode?: boolean }) => {
    const stepHeight = 120; // Reduced height for tighter spacing
    const totalHeight = stepHeight * roadmapData.length;
    const width = 100; // Percentage based
    const center = 50; // Center at 50%

    // Curved path generator
    const generateSnakePath = () => {
        let path = `M ${center} 0`;
        const amplitude = 3; // Reduced amplitude for subtle wave

        roadmapData.forEach((_, index) => {
            const y = index * stepHeight + stepHeight / 2;
            const isRight = index % 2 === 0;
            const x = isRight ? center + amplitude : center - amplitude;

            // Previous point (start or previous step)
            const prevY = index === 0 ? 0 : (index - 1) * stepHeight + stepHeight / 2;
            const prevX = index === 0 ? center : (index % 2 !== 0 ? center + amplitude : center - amplitude);

            // Control points for smooth curve
            const cp1x = prevX;
            const cp1y = (prevY + y) / 2;
            const cp2x = x;
            const cp2y = (prevY + y) / 2;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        });

        // Continue to bottom
        path += ` L ${center} ${totalHeight}`;
        return path;
    };

    const snakePath = generateSnakePath();

    return (
        <div className="relative w-full max-w-4xl mx-auto py-4 md:py-8">

            {/* Background Gradient Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-30 pointer-events-none">
                <div className="absolute top-20 left-0 w-64 h-64 bg-fireOrange/20 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-0 w-80 h-80 bg-fireNavy/10 rounded-full blur-3xl" />
            </div>

            {/* The Road (SVG) - Visible on Desktop */}
            <div className="absolute top-0 left-0 w-full hidden md:block" style={{ height: totalHeight + 100 }}>
                <svg className="w-full h-full" viewBox={`0 0 ${width} ${totalHeight + 100}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="road-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#EA580C" stopOpacity="0" />
                            <stop offset="10%" stopColor="#EA580C" stopOpacity="0.6" />
                            <stop offset="90%" stopColor="#EA580C" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Main Road Path */}
                    <motion.path
                        d={snakePath}
                        fill="none"
                        stroke="url(#road-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]"
                    />
                </svg>
            </div>

            {/* Mobile Vertical Line - Perfectly Aligned */}
            <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-fireOrange/0 via-fireOrange to-fireOrange/0 md:hidden shadow-[0_0_10px_rgba(234,88,12,0.3)]" />

            {/* Steps */}
            <div className="relative z-10">
                {roadmapData.map((step, index) => {
                    const isRight = index % 2 === 0;
                    const amplitude = 3; // Match the path amplitude

                    const getCardStyle = (day: number) => {
                        if (day === 15) return "bg-[#011627]/80";
                        if (day === 14) return "bg-[#011627]/70";
                        if (day === 13) return "bg-[#011627]/70";
                        if (day === 12) return "bg-[#011627]/60";
                        if (day === 11) return "bg-[#011627]/50";
                        if (day === 10) return "bg-[#203342]/40";
                        return "bg-[#203342]/30"; // Days 1-9
                    };

                    return (
                        <motion.div
                            key={step.day}
                            className={cn(
                                "relative flex items-center md:mb-0",
                                isRight ? "md:flex-row" : "md:flex-row-reverse",
                                // Mobile Stacking Effect
                                "md:static sticky",
                                // Mobile: Negative margin to bring cards closer in flow, creating a "deck" feel before stacking
                                "mb-[-20px] md:mb-0",
                                // Enforce min-height
                                "min-h-[160px] md:min-h-[120px] h-auto md:h-[120px]"
                            )}
                            style={{
                                // Custom stacking logic:
                                // Day 1 (index 0): Starts high at 60px
                                // Day 2 (index 1): 60px + 90px gap = 150px (Clear separation)
                                // Others: +30px per card (Extreme overlap)
                                top: `${60 + (index > 0 ? 90 : 0) + (index > 1 ? (index - 1) * 30 : 0)}px`,
                                zIndex: index + 1
                            }}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* Desktop Spacer */}
                            <div className="hidden md:block md:w-1/2" />

                            {/* Marker on the Road - Follows Curve */}
                            <div
                                className="absolute hidden md:flex items-center justify-center z-20"
                                style={{
                                    left: `${isRight ? 50 + amplitude : 50 - amplitude}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className={cn(
                                    "relative group/marker flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-[0_0_20px_rgba(234,88,12,0.2)] z-10 transition-transform duration-300 group-hover/marker:scale-110",
                                    darkMode ? `${step.day >= 11 ? "bg-[#011627]/80" : "bg-[#203342]/80"} border-white/10` : "bg-white border-fireOrange"
                                )}>
                                    <step.icon className={cn("w-6 h-6", darkMode ? "text-[#ff6600]" : "text-[#ff6600]")} />
                                </div>
                            </div>

                            {/* Mobile Marker */}
                            <div className={cn(
                                "absolute left-0 md:hidden flex items-center justify-center z-20",
                            )}>
                                <div className={cn(
                                    "relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 shadow-md z-10",
                                    darkMode ? (step.day >= 11 ? "bg-[#011627]/80" : "bg-[#203342]/80") : "bg-white"
                                )}>
                                    <step.icon className="w-5 h-5 text-[#ff6600]" />
                                </div>
                            </div>

                            {/* Connector Line - Adjusted for curve */}
                            <div className={cn(
                                "absolute top-1/2 h-0.5 bg-[#ff6600] w-8 hidden md:block",
                                isRight ? "left-1/2 ml-8" : "right-1/2 mr-8"
                            )} />

                            {/* Content - Floating Text */}
                            <div className={cn(
                                "flex-1 pl-10 md:pl-0 w-full", // Reduced padding to pl-10 and added w-full
                                isRight ? "md:pl-24 md:text-left" : "md:pr-24 md:text-right"
                            )}>
                                <div className={cn(
                                    "group cursor-default relative p-5 md:p-6 rounded-2xl shadow-xl transition-all duration-300",
                                    darkMode
                                        ? `${getCardStyle(step.day)} border border-white/10 backdrop-blur-md hover:bg-[#203342]/80 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1`
                                        : "bg-white/5 backdrop-blur-sm border border-black/10 hover:shadow-lg hover:-translate-y-1",
                                    // Push content away from the center line
                                    isRight ? "md:mr-auto" : "md:ml-auto",
                                    // Mobile specific card styling for stacking
                                    "md:transform-none shadow-[0_-5px_20px_rgba(0,0,0,0.2)]"
                                )}>
                                    <div className={cn(
                                        "flex items-center gap-3 mb-2",
                                        isRight ? "md:justify-start" : "md:justify-end"
                                    )}>
                                        <span className="text-fireOrange font-bold text-xs uppercase tracking-wide">
                                            Dia {step.day}
                                        </span>

                                    </div>

                                    <h3 className={cn(
                                        "text-xl font-bold mb-2 group-hover:text-fireOrange transition-colors duration-300",
                                        darkMode ? "text-white" : "text-fireNavy"
                                    )}>
                                        {step.title}
                                    </h3>

                                    <p className={cn(
                                        "text-sm leading-relaxed", // Removed max-w-xs to allow full width
                                        darkMode ? "text-white/70" : "text-firePetrol/80"
                                    )}>
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Final Destination */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 mt-6 flex flex-col items-center text-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-fireOrange blur-2xl opacity-20 rounded-full" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-fireOrange to-red-600 flex items-center justify-center shadow-2xl shadow-fireOrange/40 mb-6">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-fireNavy">Liberdade Conquistada</h3>
                <p className="mt-2 text-lg text-firePetrol/70">Você completou o ciclo e iniciou sua nova vida.</p>
            </motion.div>
        </div >
    );
};
