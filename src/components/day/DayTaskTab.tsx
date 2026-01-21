import { useEffect, useState } from 'react';
import { DayConfig } from '@/config/dayEngine';
import Day1Onboarding from '@/components/day/Day1Onboarding';
import Day2FinancialMapper from '@/components/day/Day2FinancialMapper';
import Day3TriggerAnalysis from '@/components/day/Day3TriggerAnalysis';
import Day4SpendingRules from '@/components/day/Day4SpendingRules';
import Day5CardPolicy from '@/components/day/Day5CardPolicy';
import Day6QuickCuts from '@/components/day/Day6QuickCuts';
import Day7Calendar from '@/components/day/Day7Calendar';
import Day8PaymentQueue from '@/components/day/Day8PaymentQueue';
import Day9MinimumBudget from '@/components/day/Day9MinimumBudget';
import Day10NegotiationMap from '@/components/day/Day10NegotiationMap';
import Day11NegotiationQuiz from '@/components/day/Day11NegotiationQuiz';
import Day12AgreementForm from '@/components/day/Day12AgreementForm';
import Day13LifeRules from '@/components/day/Day13LifeRules';
import Day14Plan3090 from '@/components/day/Day14Plan3090';
import Day15Graduation from '@/components/day/Day15Graduation';
import DayTaskIntro from '@/components/day/DayTaskIntro';
import { DayInputForm } from '@/components/challenge/DayInputForm';
import { CrudSection, CrudType } from '@/components/challenge/CrudSection';
import { Loader2 } from 'lucide-react';

interface DayTaskTabProps {
    dayId: number;
    config: DayConfig;
    defaultValues?: Record<string, unknown>;
    onComplete: (values: Record<string, unknown>) => void;
    onInputSubmit?: (values: Record<string, unknown>) => void;
    onCrudComplete?: () => void;
    phase: 'input' | 'crud' | 'output';
    payload: Record<string, unknown>;
    isLoading: boolean;
    isCompleted: boolean;
}

export default function DayTaskTab({
    dayId,
    config,
    defaultValues,
    onComplete,
    onInputSubmit,
    onCrudComplete,
    phase,
    payload,
    isLoading,
    isCompleted,
}: DayTaskTabProps) {
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        if (!isCompleted) {
            setShowIntro(true);
            return;
        }
        setShowIntro(false);
    }, [dayId, isCompleted]);

    const introContent: Record<number, { title: string; motivation: string; description: string; benefit: string }> = {
        1: {
            title: 'Dia 1: Despertar Financeiro',
            motivation: 'Voce nao esta sozinho. Hoje e o primeiro passo para clareza e autonomia.',
            description: 'Voce vai reconhecer suas emocoes com o dinheiro, identificar crenças que te travam, medir seu termometro e assumir um compromisso diario simples.',
            benefit: 'Ao final de hoje, voce sai com clareza emocional, um termometro inicial e um compromisso diario que guia os proximos 14 dias.',
        },
        2: {
            title: 'Dia 2: Raio-X do Caos',
            motivation: 'Clareza reduz medo. Hoje voce coloca os numeros na mesa.',
            description: 'Voce vai mapear entradas, despesas fixas, variaveis e dividas para enxergar seu fluxo real.',
            benefit: 'Ao final de hoje, voce tera um retrato financeiro completo e sabera o que sobra ou falta no mes.',
        },
        3: {
            title: 'Dia 3: Arqueologia Financeira',
            motivation: 'Padroes ocultos viram escolhas conscientes.',
            description: 'Voce vai analisar gastos, classificar transacoes e identificar gatilhos emocionais.',
            benefit: 'Ao final de hoje, voce reconhece vazamentos e entende o que dispara seus gastos.',
        },
        4: {
            title: 'Dia 4: Regra da Pausa',
            motivation: 'Regras simples protegem seu futuro.',
            description: 'Voce vai criar limites claros, excecoes realistas e um contrato pessoal.',
            benefit: 'Ao final de hoje, voce tera regras praticas para evitar impulsos e manter controle.',
        },
        5: {
            title: 'Dia 5: Politica do Cartao',
            motivation: 'Menos cartao aberto, mais tranquilidade.',
            description: 'Voce escolhe um cartao principal, define limites e bloqueia o resto.',
            benefit: 'Ao final de hoje, voce sabe exatamente como usar o cartao sem sair do plano.',
        },
        6: {
            title: 'Dia 6: Cortes Rapidos',
            motivation: 'Pequenos cortes liberam grande folego.',
            description: 'Voce vai escolher gastos para pausar, reduzir ou trocar por opcoes mais leves.',
            benefit: 'Ao final de hoje, voce tem uma lista objetiva de cortes e economia estimada.',
        },
        7: {
            title: 'Dia 7: Calendario de Vencimentos',
            motivation: 'Ordem evita juros e ansiedade.',
            description: 'Voce organiza contas por data, prioridade e forma de pagamento.',
            benefit: 'Ao final de hoje, voce tem um calendario claro de vencimentos para evitar atrasos.',
        },
        8: {
            title: 'Dia 8: Fila de Pagamento',
            motivation: 'Decisao rapida em crise evita prejuizo.',
            description: 'Voce vai priorizar contas, definir plano A/B/C e escolher 3 acoes para hoje.',
            benefit: 'Ao final de hoje, voce sabe exatamente o que pagar, negociar e adiar sem culpa.',
        },
        9: {
            title: 'Dia 9: Orcamento Minimo',
            motivation: 'O minimo necessario traz seguranca.',
            description: 'Voce consolida essenciais, limites e calcula seu custo basico de 30 dias.',
            benefit: 'Ao final de hoje, voce tem um teto claro para negociar e se reorganizar.',
        },
        10: {
            title: 'Dia 10: Mapa de Negociacao',
            motivation: 'Negociar com preparo muda o jogo.',
            description: 'Voce define limites, objetivos e roteiros para falar com credores.',
            benefit: 'Ao final de hoje, voce entra nas negociacoes com proposta segura e clara.',
        },
        11: {
            title: 'Dia 11: Treino de Negociacao',
            motivation: 'Treino gera confianca.',
            description: 'Voce pratica cenarios e recebe feedback para negociar melhor.',
            benefit: 'Ao final de hoje, voce se sente mais seguro para fechar acordos.',
        },
        12: {
            title: 'Dia 12: Fechar Acordo',
            motivation: 'Contrato claro evita surpresa.',
            description: 'Voce registra valores, parcelas e confirma se o acordo cabe no seu orcamento.',
            benefit: 'Ao final de hoje, seu acordo fica documentado e pronto para acompanhar.',
        },
        13: {
            title: 'Dia 13: Novas Regras de Vida',
            motivation: 'Regras simples sustentam a mudanca.',
            description: 'Voce cria 3 regras pessoais e transforma em mantra.',
            benefit: 'Ao final de hoje, voce tem um codigo pessoal para evitar recaidas.',
        },
        14: {
            title: 'Dia 14: Plano 30/90',
            motivation: 'Sem plano, tudo vira improviso.',
            description: 'Voce define metas de 30 e 90 dias e escolhe o modo certo para sua fase.',
            benefit: 'Ao final de hoje, voce tem um mapa claro do proximo ciclo.',
        },
        15: {
            title: 'Dia 15: Formatura',
            motivation: 'Fechar ciclo reforca a nova identidade.',
            description: 'Voce faz uma retrospectiva, define ritual semanal e registra seu compromisso final.',
            benefit: 'Ao final de hoje, voce sai com um protocolo para manter a disciplina.',
        },
    };

    if (showIntro) {
        const content = introContent[dayId];
        if (content) {
            return (
                <DayTaskIntro
                    title={content.title}
                    motivation={content.motivation}
                    description={content.description}
                    benefit={content.benefit}
                    onStart={() => setShowIntro(false)}
                    ctaLabel="Iniciar tarefa do dia"
                />
            );
        }
    }

    // Se tem customComponent, renderiza o componente específico
    if (config.customComponent) {
        return (
            <div className="animate-in fade-in duration-300">
                {dayId === 1 && (
                    <Day1Onboarding
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 2 && (
                    <Day2FinancialMapper
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 3 && (
                    <Day3TriggerAnalysis
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 4 && (
                    <Day4SpendingRules
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 5 && (
                    <Day5CardPolicy
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 6 && (
                    <Day6QuickCuts
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 7 && (
                    <Day7Calendar
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 8 && (
                    <Day8PaymentQueue
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 9 && (
                    <Day9MinimumBudget
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 10 && (
                    <Day10NegotiationMap
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 11 && (
                    <Day11NegotiationQuiz
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 12 && (
                    <Day12AgreementForm
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 13 && (
                    <Day13LifeRules
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 14 && (
                    <Day14Plan3090
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {dayId === 15 && (
                    <Day15Graduation
                        onComplete={onComplete}
                        defaultValues={defaultValues}
                    />
                )}

                {/* Adicione mais dias customizados aqui conforme necessário */}
                {![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(dayId) && (
                    <div className="text-center py-8 text-muted-foreground">
                        Componente customizado para o Dia {dayId} ainda não implementado.
                    </div>
                )}
            </div>
        );
    }

    // Se não tem customComponent, usa o fluxo genérico
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && phase === 'input' && config.inputs.length > 0 && onInputSubmit && (
                <DayInputForm
                    inputs={config.inputs}
                    onSubmit={onInputSubmit}
                    defaultValues={defaultValues}
                />
            )}

            {!isLoading && phase === 'crud' && config.crudType && (
                <CrudSection
                    type={config.crudType as CrudType}
                />
            )}
        </div>
    );
}
