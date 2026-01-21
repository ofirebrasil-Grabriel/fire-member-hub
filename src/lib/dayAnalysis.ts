/**
 * Gera análise textual baseada nos dados do dia
 */

// Helper function to remove all emojis from text for PDF compatibility
function removeEmojis(text: string): string {
    return text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/[\u{231A}-\u{231B}]/gu, '')
        .replace(/[\u{23E9}-\u{23F3}]/gu, '')
        .replace(/[\u{23F8}-\u{23FA}]/gu, '')
        .replace(/[\u{25AA}-\u{25AB}]/gu, '')
        .replace(/[\u{25B6}]/gu, '')
        .replace(/[\u{25C0}]/gu, '')
        .replace(/[\u{25FB}-\u{25FE}]/gu, '')
        .replace(/[\u{2614}-\u{2615}]/gu, '')
        .replace(/[\u{2648}-\u{2653}]/gu, '')
        .replace(/[\u{267F}]/gu, '')
        .replace(/[\u{2693}]/gu, '')
        .replace(/[\u{26A1}]/gu, '')
        .replace(/[\u{26AA}-\u{26AB}]/gu, '')
        .replace(/[\u{26BD}-\u{26BE}]/gu, '')
        .replace(/[\u{26C4}-\u{26C5}]/gu, '')
        .replace(/[\u{26CE}]/gu, '')
        .replace(/[\u{26D4}]/gu, '')
        .replace(/[\u{26EA}]/gu, '')
        .replace(/[\u{26F2}-\u{26F3}]/gu, '')
        .replace(/[\u{26F5}]/gu, '')
        .replace(/[\u{26FA}]/gu, '')
        .replace(/[\u{26FD}]/gu, '')
        .replace(/[\u{2934}-\u{2935}]/gu, '')
        .replace(/[\u{2B05}-\u{2B07}]/gu, '')
        .replace(/[\u{2B1B}-\u{2B1C}]/gu, '')
        .replace(/[\u{2B50}]/gu, '')
        .replace(/[\u{2B55}]/gu, '')
        .replace(/[\u{3030}]/gu, '')
        .replace(/[\u{303D}]/gu, '')
        .replace(/[\u{3297}]/gu, '')
        .replace(/[\u{3299}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function generateDayAnalysis(dayId: number, formData: Record<string, unknown>): string {
    switch (dayId) {
        case 1:
            return generateDay1Analysis(formData);
        case 2:
            return generateDay2Analysis(formData);
        case 3:
            return generateDay3Analysis(formData);
        case 4:
            return generateDay4Analysis(formData);
        case 5:
            return generateDay5Analysis(formData);
        case 6:
            return generateDay6Analysis(formData);
        case 7:
            return generateDay7Analysis(formData);
        case 8:
            return generateDay8Analysis(formData);
        case 9:
            return generateDay9Analysis(formData);
        case 10:
            return generateDay10Analysis(formData);
        case 11:
            return generateDay11Analysis(formData);
        case 12:
            return generateDay12Analysis(formData);
        case 13:
            return generateDay13Analysis(formData);
        case 14:
            return generateDay14Analysis(formData);
        case 15:
            return generateDay15Analysis(formData);
        default:
            return generateGenericAnalysis(dayId, formData);
    }
}

function generateDay1Analysis(formData: Record<string, unknown>): string {
    // Mappings for labels
    const feelingLabels: Record<string, string> = {
        anxious: 'Ansioso(a)',
        calm: 'Tranquilo(a)',
        confused: 'Confuso(a)',
        scared: 'Com medo',
        indifferent: 'Indiferente',
    };

    const blockerLabels: Record<string, string> = {
        low_income: 'Ganho pouco',
        overspending: 'Gasto demais',
        debts: 'Dividas',
        no_control: 'Falta de controle',
        dont_know: 'Nao sei por onde comecar',
    };

    const periodLabels: Record<string, string> = {
        morning: 'Manha',
        afternoon: 'Tarde',
        night: 'Noite',
    };

    // Extract data
    const feeling = formData.money_feeling as string;
    const hasOverdueBills = formData.has_overdue_bills as string;
    const monthlyIncome = Number(formData.monthly_income) || 0;
    const topExpenses = (formData.top_expenses as string[]) || [];
    const sharesFinances = formData.shares_finances as boolean;
    const sharesWith = formData.shares_with as string;
    const biggestBlocker = formData.biggest_blocker as string;
    const mainGoal = formData.main_goal as string;
    const triedBefore = formData.tried_before as boolean;
    const whatBlocked = formData.what_blocked as string;
    const breatheScore = Number(formData.breathe_score) || 5;
    const breatheReason = formData.breathe_reason as string;
    const dailyPeriod = formData.daily_time_period as string;
    const dailyTime = formData.daily_time_exact as string;
    const minimumStep = formData.minimum_step as string;

    let analysis = '';

    // Resumo do questionario
    analysis += 'RESUMO DO SEU PONTO DE PARTIDA\n\n';

    analysis += `Sentimento com dinheiro: ${feelingLabels[feeling] || feeling}\n`;
    analysis += `Boletos atrasados: ${hasOverdueBills === 'yes' ? 'Sim' : hasOverdueBills === 'no' ? 'Nao' : 'Incerto'}\n`;
    analysis += `Renda mensal: R$ ${monthlyIncome.toLocaleString('pt-BR')}\n`;

    if (topExpenses.length > 0) {
        analysis += `Maiores despesas: ${topExpenses.filter(e => e).join(', ')}\n`;
    }

    if (sharesFinances && sharesWith) {
        analysis += `Divide financas com: ${sharesWith}\n`;
    }

    analysis += `Maior bloqueio: ${blockerLabels[biggestBlocker] || biggestBlocker}\n`;

    // Termometro
    analysis += '\nTERMOMETRO RESPIRAR\n\n';
    analysis += `Nota inicial: ${breatheScore}/10\n`;

    if (breatheScore <= 3) {
        analysis += 'Voce esta no vermelho. Essa sensacao de sufocamento e temporaria. ';
        analysis += 'Os proximos dias vao te ajudar a criar um plano de acao concreto.\n';
    } else if (breatheScore <= 6) {
        analysis += 'Voce esta sobrevivendo, mas sem folga. ';
        analysis += 'Vamos trabalhar para transformar essa sobrevivencia em tranquilidade.\n';
    } else if (breatheScore <= 8) {
        analysis += 'Voce esta respirando! Essa e uma boa base para construir. ';
        analysis += 'Vamos aproveitar esse momento para criar habitos solidos.\n';
    } else {
        analysis += 'Otimo! Voce esta tranquilo. ';
        analysis += 'Vamos usar essa clareza para otimizar ainda mais sua vida financeira.\n';
    }

    if (breatheReason) {
        analysis += `Motivo: "${breatheReason}"\n`;
    }

    // Compromisso
    analysis += '\nSEU COMPROMISSO DIARIO\n\n';
    analysis += `Horario: ${periodLabels[dailyPeriod] || dailyPeriod} as ${dailyTime}\n`;
    if (minimumStep) {
        analysis += `Passo minimo: ${minimumStep}\n`;
    }

    // Objetivo
    if (mainGoal) {
        analysis += '\nSEU OBJETIVO PRINCIPAL\n\n';
        analysis += `"${mainGoal}"\n`;
    }

    // Historico
    if (triedBefore && whatBlocked) {
        analysis += '\nO QUE TRAVOU NO PASSADO\n\n';
        analysis += `${whatBlocked}\n`;
        analysis += 'Vamos trabalhar para que isso nao se repita.\n';
    }

    // Proximos passos
    analysis += '\nPROXIMO PASSO\n\n';
    analysis += 'Amanha voce vai fazer o Raio-X do Caos e mapear toda sua situacao financeira. ';
    analysis += 'Lembre-se de entrar no app no horario que voce definiu!';

    return analysis;
}

function generateDay2Analysis(formData: Record<string, unknown>): string {
    const totalIncome = Number(formData.totalIncome) || 0;
    const totalExpenses = Number(formData.totalExpenses) || 0;
    const totalDebtsMin = Number(formData.totalDebtsMin) || 0;
    const balance = Number(formData.balance) || 0;
    const incomeCount = Number(formData.incomeCount) || 0;
    const expenseCount = Number(formData.expenseCount) || 0;
    const debtCount = Number(formData.debtCount) || 0;
    const emotionalNote = String(formData.emotionalNote || '');

    let analysis = '📊 RESUMO FINANCEIRO:\n\n';
    analysis += `Você mapeou ${incomeCount} fontes de renda, ${expenseCount} despesas fixas e ${debtCount} dívidas. `;

    if (balance > 0) {
        const percentage = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0;
        analysis += `\n\n✅ SALDO POSITIVO: Sobram R$ ${balance.toFixed(2)}/mês (${percentage}% da renda). `;
        analysis += 'Esse valor pode ser direcionado para quitar dívidas ou criar sua reserva. ';
    } else if (balance < 0) {
        analysis += `\n\n⚠️ SALDO NEGATIVO: Faltam R$ ${Math.abs(balance).toFixed(2)}/mês. `;
        analysis += 'É urgente revisar despesas ou buscar renda extra. Vamos trabalhar isso nos próximos dias. ';
    } else {
        analysis += '\n\n⚖️ SALDO ZERO: Suas contas fecham no limite, sem margem para imprevistos. ';
    }

    if (totalDebtsMin > 0) {
        const debtPercentage = totalIncome > 0 ? ((totalDebtsMin / totalIncome) * 100).toFixed(0) : 0;
        analysis += `\n\n💳 COMPROMETIMENTO COM DÍVIDAS: R$ ${totalDebtsMin.toFixed(2)}/mês (${debtPercentage}% da renda). `;
        if (Number(debtPercentage) > 30) {
            analysis += 'Este percentual está alto. Priorize quitar as dívidas com maiores juros primeiro.';
        }
    }

    if (emotionalNote) {
        analysis += `\n\n💭 REFLEXÃO EMOCIONAL: "${emotionalNote}"`;
    }

    analysis += '\n\n🚀 PRÓXIMO PASSO: Com esse mapa financeiro, você terá clareza para tomar decisões nos próximos dias do desafio.';

    return analysis;
}

function generateDay3Analysis(formData: Record<string, unknown>): string {
    const triggersAnalyzed = Number(formData.triggersAnalyzed) || 0;
    const avoidableCount = Number(formData.avoidableCount) || 0;
    const largePurchasesCount = Number(formData.largePurchasesCount) || 0;
    const mainTrigger = String(formData.mainTrigger || '');
    const mainInfluence = String(formData.mainInfluence || '');
    const analyses = (formData.analyses as Array<{ emotionTrigger: string; couldAvoid: boolean; avoidanceStrategy?: string }>) || [];

    // Mapping for labels
    const triggerLabels: Record<string, string> = {
        stress: 'estresse',
        anxiety: 'ansiedade',
        boredom: 'tédio',
        sadness: 'tristeza',
        happiness: 'felicidade',
        reward: 'sensação de merecimento',
        fomo: 'medo de perder',
        comfort: 'busca de conforto',
        neutral: 'racionalidade',
    };

    const influenceLabels: Record<string, string> = {
        friends: 'amigos',
        family: 'família',
        coworkers: 'colegas de trabalho',
        social_media: 'redes sociais',
        marketing: 'marketing/publicidade',
        influencers: 'influenciadores',
        shopping_mall: 'ambientes de shopping',
        sales: 'promoções',
    };

    let analysis = ' ANÁLISE DE GATILHOS DE COMPRA\n\n';
    analysis += `Você analisou ${triggersAnalyzed} gastos e identificou ${avoidableCount} que poderiam ter sido evitados. `;

    if (mainTrigger) {
        const triggerLabel = triggerLabels[mainTrigger] || mainTrigger;
        analysis += `\n\n PRINCIPAL GATILHO: ${triggerLabel.toUpperCase()}\n`;
        analysis += `A maioria das suas compras impulsivas acontece quando você está sentindo ${triggerLabel}. `;
        analysis += 'Reconhecer esse padrão é o primeiro passo para quebrá-lo.';
    }

    if (mainInfluence) {
        const influenceLabel = influenceLabels[mainInfluence] || mainInfluence;
        analysis += `\n\n PRINCIPAL INFLUÊNCIA: ${influenceLabel}\n`;
        analysis += `${influenceLabel.charAt(0).toUpperCase() + influenceLabel.slice(1)} exercem uma influência significativa nas suas decisões de compra. `;
    }

    if (largePurchasesCount > 0) {
        analysis += `\n\n COMPRAS GRANDES: Você refletiu sobre ${largePurchasesCount} compras acima de R$1000. `;
        analysis += 'Esse tipo de reflexão ajuda a criar consciência sobre decisões financeiras importantes.';
    }

    // Control plan
    analysis += '\n\n PLANO DE CONTROLE:\n';

    if (mainTrigger === 'stress' || mainTrigger === 'anxiety') {
        analysis += '• Antes de comprar sob estresse, faça 3 respirações profundas\n';
        analysis += '• Espere 24h antes de qualquer compra não essencial\n';
        analysis += '• Tenha uma lista de atividades gratuitas para aliviar tensão\n';
    } else if (mainTrigger === 'boredom') {
        analysis += '• Mantenha uma lista de hobbies gratuitos para momentos de tédio\n';
        analysis += '• Desinstale apps de compras do celular\n';
        analysis += '• Crie barreiras entre você e a compra (ex: não salvar cartão)\n';
    } else if (mainTrigger === 'reward' || mainTrigger === 'happiness') {
        analysis += '• Crie recompensas não-financeiras para celebrar conquistas\n';
        analysis += '• Defina um "fundo de recompensa" com limite mensal\n';
        analysis += '• Espere 48h antes de compras de celebração\n';
    } else {
        analysis += '• Implemente a regra das 24h para compras não essenciais\n';
        analysis += '• Mantenha uma lista de desejos e espere 30 dias\n';
        analysis += '• Questione: "Eu PRECISO ou eu QUERO?"\n';
    }

    // Add user strategies
    const strategies = analyses
        .filter(a => a.couldAvoid && a.avoidanceStrategy)
        .map(a => a.avoidanceStrategy)
        .slice(0, 3);

    if (strategies.length > 0) {
        analysis += '\n SUAS ESTRATÉGIAS:\n';
        strategies.forEach(s => {
            analysis += `• ${s}\n`;
        });
    }

    analysis += '\n💡 LEMBRE-SE: Cada compra evitada é dinheiro que pode ser usado para seus objetivos reais.';

    return analysis;
}

function generateDay4Analysis(formData: Record<string, unknown>): string {
    const bannedCount = Number(formData.bannedCount) || 0;
    const exceptionsCount = Number(formData.exceptionsCount) || 0;
    const totalLimit = Number(formData.totalExceptionsLimit) || 0;
    const bannedList = (formData.bannedList as Array<{ name: string; reason: string; substitute: string }>) || [];
    const exceptions = (formData.exceptions as Array<{ name: string; limit: number; observation: string }>) || [];

    let analysis = 'MURAL DE GASTOS - PROXIMOS 30 DIAS\n\n';

    // Banned section
    analysis += '[X] NAO GASTO MAIS:\n';
    if (bannedList.length > 0) {
        bannedList.forEach(item => {
            const cleanName = removeEmojis(item.name);
            analysis += `  - ${cleanName}`;
            if (item.substitute) {
                analysis += ` > Substituir por: ${removeEmojis(item.substitute)}`;
            }
            analysis += '\n';
        });
    } else {
        analysis += '  - (nenhum item definido)\n';
    }

    analysis += '\n';

    // Allowed section
    analysis += '[OK] POSSO GASTAR (com limite):\n';
    if (exceptions.length > 0) {
        exceptions.forEach(item => {
            const cleanName = removeEmojis(item.name);
            analysis += `  - ${cleanName}: ate R$ ${item.limit.toFixed(2)}`;
            if (item.observation) {
                analysis += ` (${removeEmojis(item.observation)})`;
            }
            analysis += '\n';
        });
    } else {
        analysis += '  - (nenhuma excecao definida)\n';
    }

    analysis += `\nTOTAL LIMITE ESSENCIAL: R$ ${totalLimit.toFixed(2)}/mes\n`;

    // Tips
    analysis += '\nREGRAS DE OURO:\n';
    analysis += '1. Se nao esta na lista de excecoes, NAO compre\n';
    analysis += '2. Antes de qualquer compra, consulte este mural\n';
    analysis += '3. Use os substitutos sempre que sentir vontade\n';
    analysis += '4. Marque cada dia de sucesso no calendario\n';

    analysis += `\nCOMPROMISSO: ${bannedCount} gastos banidos por 30 dias, ${exceptionsCount} excecoes controladas.`;

    return analysis;
}

function generateDay5Analysis(formData: Record<string, unknown>): string {
    const mainCardName = removeEmojis(String(formData.mainCardName || ''));
    const blockedCount = Number(formData.blockedCount) || 0;
    const blockedCards = (formData.blockedCards as string[]) || [];
    const weeklyLimit = Number(formData.weeklyLimit) || 0;
    const exceptions = (formData.exceptions as Array<{ name: string; weeklyLimit: number }>) || [];
    const totalExceptionsLimit = Number(formData.totalExceptionsLimit) || 0;

    let analysis = 'POLITICA DO CARTAO - PROXIMOS 30 DIAS\n\n';

    // Main card
    analysis += '[LIBERADO] CARTAO PRINCIPAL:\n';
    analysis += `  - ${mainCardName}\n`;
    analysis += `  - Limite semanal: R$ ${weeklyLimit.toFixed(2)}\n\n`;

    // Blocked cards
    if (blockedCount > 0) {
        analysis += `[BLOQUEADO] CARTOES EM PAUSA (${blockedCount}):\n`;
        blockedCards.forEach(card => {
            analysis += `  - ${removeEmojis(card)}\n`;
        });
        analysis += '\nCOMO MANTER BLOQUEADO:\n';
        analysis += '  - Guarde em lugar de dificil acesso (gaveta trancada, cofre)\n';
        analysis += '  - Delete os apps dos bancos bloqueados do celular\n';
        analysis += '  - Nao salve os dados no navegador\n';
        analysis += '  - Avise a familia para nao pedir emprestado\n\n';
    }

    // What NOT to buy
    analysis += 'O QUE NAO PASSAR NO CARTAO:\n';
    analysis += '  - Qualquer coisa fora da lista de excecoes\n';
    analysis += '  - Compras por impulso\n';
    analysis += '  - Parcelamentos novos\n';
    analysis += '  - Gastos que podem esperar\n\n';

    // Exceptions with limits
    if (exceptions.length > 0) {
        analysis += 'EXCECOES PERMITIDAS (com limite semanal):\n';
        exceptions.forEach(exc => {
            analysis += `  - ${removeEmojis(exc.name)}: ate R$ ${exc.weeklyLimit.toFixed(2)}/semana\n`;
        });
        analysis += `\nTOTAL EXCECOES: R$ ${totalExceptionsLimit.toFixed(2)}/semana\n\n`;
    }

    // Tips
    analysis += 'DICAS PARA CUMPRIR:\n';
    analysis += '1. Anote cada gasto no cartao imediatamente\n';
    analysis += '2. Cheque o app do banco todo dia\n';
    analysis += '3. Se passar do limite semanal, PARE ate a outra semana\n';
    analysis += '4. Celebre cada semana dentro do limite\n';

    return analysis;
}

function generateDay6Analysis(formData: Record<string, unknown>): string {
    const cutsCount = Number(formData.cutsCount) || 0;
    const cuts = (formData.cuts as Array<{
        category: string;
        actionType: string;
        specificCut: string;
        clearLimit: string;
        limitValue: number;
    }>) || [];
    const totalLimit = Number(formData.totalLimit) || 0;
    const emotionalRewards = (formData.emotionalRewards as string[]) || [];
    const bigGoal = removeEmojis(String(formData.bigGoal || ''));

    let analysis = `PLANO DE CORTES - PROXIMOS 7 DIAS (${cutsCount} vazamentos)\n\n`;

    // List all cuts
    analysis += 'O QUE CORTAR:\n';
    cuts.forEach((cut, i) => {
        analysis += `\n${i + 1}. ${removeEmojis(cut.category)}\n`;
        analysis += `   Acao: ${removeEmojis(cut.actionType)}\n`;
        analysis += `   Corte: ${removeEmojis(cut.specificCut)}\n`;
        analysis += `   Regra: ${removeEmojis(cut.clearLimit)}\n`;
        if (cut.limitValue > 0) {
            analysis += `   Limite: R$ ${cut.limitValue.toFixed(2)}\n`;
        }
    });

    if (totalLimit > 0) {
        analysis += `\nLIMITE TOTAL SEMANAL: R$ ${totalLimit.toFixed(2)}\n`;
    }

    analysis += '\nCOMO EXECUTAR:\n';
    analysis += '  1. Lembre da regra ANTES de gastar\n';
    analysis += '  2. Se bater vontade, espere 24h\n';
    analysis += '  3. Anote cada vez que resistir\n';
    analysis += '  4. Se escorregar, nao desista - volte no dia seguinte\n';

    // Rewards
    if (emotionalRewards.length > 0 || bigGoal) {
        analysis += '\nRECOMPENSAS SE CUMPRIR:\n';
        if (emotionalRewards.length > 0) {
            analysis += '  Ganhos imediatos:\n';
            emotionalRewards.forEach(r => {
                analysis += `    - ${removeEmojis(r)}\n`;
            });
        }
        if (bigGoal) {
            analysis += `  Objetivo grande: ${bigGoal}\n`;
        }
    }

    analysis += '\nLEMBRETE: Doi pouco, libera rapido. Cortes bem feitos valem mais que muitos abandonados.';

    return analysis;
}

function generateDay7Analysis(formData: Record<string, unknown>): string {
    const totalObligations = Number(formData.totalObligations ?? formData.total_obligations) || 0;
    const criticalCount = Number(formData.criticalCount ?? formData.critical_count) || 0;
    const nextDueDate = String(formData.nextDueDate ?? formData.next_due_date ?? '').trim();

    let analysis = 'CALENDARIO FINANCEIRO ORGANIZADO\n\n';
    analysis += `Obrigacoes registradas: ${totalObligations}\n`;
    analysis += `Criticas: ${criticalCount}\n`;
    if (nextDueDate) {
        analysis += `Proximo vencimento: ${nextDueDate}\n`;
    }

    analysis += '\nAgora voce tem previsibilidade. Evitar atrasos e juros ja reduz ansiedade.\n';
    analysis += 'Use lembretes e revise o calendario toda semana.';

    return analysis;
}

function generateDay8Analysis(formData: Record<string, unknown>): string {
    const nextPayDate = String(formData.nextPayDate || '');
    const availableMoney = Number(formData.availableMoney) || 0;
    const totalBills = Number(formData.totalBills) || 0;
    const gap = Number(formData.gap) || 0;
    const selectedPlan = String(formData.selectedPlan || '');
    const payNowTotal = Number(formData.payNowTotal) || 0;
    const negotiateTotal = Number(formData.negotiateTotal) || 0;
    const pauseTotal = Number(formData.pauseTotal) || 0;
    const bills = (formData.bills as Array<{
        name: string;
        amount: number;
        priority: number;
        status: string;
    }>) || [];
    const actions = (formData.actions as Array<{ type: string; description: string }>) || [];

    let analysis = 'FILA DE PAGAMENTO - ATE O PROXIMO RECEBIMENTO\n\n';

    analysis += `Janela: ate ${nextPayDate}\n`;
    analysis += `Disponivel: R$ ${availableMoney.toFixed(2)}\n`;
    analysis += `Total contas: R$ ${totalBills.toFixed(2)}\n`;
    if (gap > 0) {
        analysis += `Gap: R$ ${gap.toFixed(2)} (faltando)\n`;
        analysis += `Plano escolhido: ${selectedPlan}\n`;
    }
    analysis += '\n';

    // Bills by status
    const payNow = bills.filter(b => b.status === 'pay_now');
    const negotiate = bills.filter(b => b.status === 'negotiate');
    const pause = bills.filter(b => b.status === 'pause');

    if (payNow.length > 0) {
        analysis += `PAGAR AGORA (R$ ${payNowTotal.toFixed(2)}):\n`;
        payNow.forEach(b => {
            analysis += `  - ${removeEmojis(b.name)}: R$ ${b.amount.toFixed(2)}\n`;
        });
        analysis += '\n';
    }

    if (negotiate.length > 0) {
        analysis += `NEGOCIAR (R$ ${negotiateTotal.toFixed(2)}):\n`;
        negotiate.forEach(b => {
            analysis += `  - ${removeEmojis(b.name)}: R$ ${b.amount.toFixed(2)}\n`;
        });
        analysis += '\n';
    }

    if (pause.length > 0) {
        analysis += `PAUSAR (R$ ${pauseTotal.toFixed(2)}):\n`;
        pause.forEach(b => {
            analysis += `  - ${removeEmojis(b.name)}: R$ ${b.amount.toFixed(2)}\n`;
        });
        analysis += '\n';
    }

    // Actions
    if (actions.length > 0) {
        analysis += '3 ACOES PARA HOJE:\n';
        actions.forEach((a, i) => {
            analysis += `  ${i + 1}. [${removeEmojis(a.type)}] ${removeEmojis(a.description)}\n`;
        });
    }

    return analysis;
}

function generateDay9Analysis(formData: Record<string, unknown>): string {
    const income = Number(formData.income) || 0;
    const essentialsTotal = Number(formData.essentials_total) || 0;
    const criticalBills = Number(formData.critical_bills) || 0;
    const minimumDebts = Number(formData.minimum_debts) || 0;
    const leisureMinimum = Number(formData.leisure_minimum) || 0;
    const totalBudget = essentialsTotal + minimumDebts + leisureMinimum;
    const gap = income - totalBudget;

    let analysis = 'ORCAMENTO MINIMO - 30 DIAS\n\n';
    analysis += `Renda mensal: R$ ${income.toFixed(2)}\n`;
    if (essentialsTotal > 0) {
        analysis += `Essenciais: R$ ${essentialsTotal.toFixed(2)}\n`;
    }
    if (criticalBills > 0) {
        analysis += `Contas criticas: R$ ${criticalBills.toFixed(2)}\n`;
    }
    if (minimumDebts > 0) {
        analysis += `Dividas minimas: R$ ${minimumDebts.toFixed(2)}\n`;
    }
    if (leisureMinimum > 0) {
        analysis += `Lazer minimo: R$ ${leisureMinimum.toFixed(2)}\n`;
    }
    analysis += `Orcamento total: R$ ${totalBudget.toFixed(2)}\n\n`;

    if (gap >= 0) {
        analysis += `Cabe no orcamento. Sobra estimada: R$ ${gap.toFixed(2)}.\n`;
        analysis += 'Use essa folga para acelerar dividas ou criar reserva.\n';
    } else {
        analysis += `Nao cabe no orcamento. Falta: R$ ${Math.abs(gap).toFixed(2)}.\n`;
        analysis += 'Reveja cortes do Dia 6 e reduza despesas variaveis.\n';
    }

    return analysis;
}

function generateDay10Analysis(formData: Record<string, unknown>): string {
    const maxEntry = Number(formData.max_entry) || 0;
    const maxInstallment = Number(formData.max_installment) || 0;
    const checks = Array.isArray(formData.anti_fraud_check) ? formData.anti_fraud_check.length : 0;

    let analysis = 'MAPA DE NEGOCIACAO - LIMITES DEFINIDOS\n\n';
    if (maxEntry > 0) {
        analysis += `Entrada maxima: R$ ${maxEntry.toFixed(2)}\n`;
    }
    if (maxInstallment > 0) {
        analysis += `Parcela maxima: R$ ${maxInstallment.toFixed(2)}\n`;
    }
    analysis += `Checklist de seguranca: ${checks}/4\n\n`;
    analysis += 'Voce esta preparado para negociar com clareza e sem cair em golpes.';
    return analysis;
}

function generateDay11Analysis(formData: Record<string, unknown>): string {
    const quizScore = Number(formData.quiz_score) || 0;
    const confidence = Number(formData.confidence_level) || 0;
    const learnings = String(formData.key_learnings || '').trim();

    let analysis = 'TREINO DE NEGOCIACAO\n\n';
    analysis += `Pontuacao no quiz: ${quizScore}/10\n`;
    analysis += `Confianca para negociar: ${confidence}/10\n`;
    if (learnings) {
        analysis += `Aprendizados: "${removeEmojis(learnings)}"\n`;
    }
    analysis += '\nConhecimento reduz ansiedade. Voce esta mais preparado para o contato real.';
    return analysis;
}

function generateDay12Analysis(formData: Record<string, unknown>): string {
    const creditor = String(formData.creditor_name || '').trim();
    const totalAmount = Number(formData.total_amount) || 0;
    const monthlyPayment = Number(formData.monthly_payment) || 0;
    const installments = Number(formData.installments) || 0;
    const savings = Number(formData.savings) || 0;

    let analysis = 'ACORDO REGISTRADO\n\n';
    if (creditor) {
        analysis += `Credor: ${removeEmojis(creditor)}\n`;
    }
    if (totalAmount > 0) {
        analysis += `Valor total: R$ ${totalAmount.toFixed(2)}\n`;
    }
    if (monthlyPayment > 0) {
        analysis += `Parcela mensal: R$ ${monthlyPayment.toFixed(2)}\n`;
    }
    if (installments > 0) {
        analysis += `Parcelas: ${installments}\n`;
    }
    if (savings > 0) {
        analysis += `Economia gerada: R$ ${savings.toFixed(2)}\n`;
    }
    analysis += '\nRegistrar o acordo protege voce. Guarde comprovantes e protocolos.';
    return analysis;
}

function generateDay13Analysis(formData: Record<string, unknown>): string {
    const rules = [formData.rule_1, formData.rule_2, formData.rule_3]
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0);

    let analysis = 'NOVAS REGRAS DE VIDA\n\n';
    rules.forEach((rule, index) => {
        analysis += `${index + 1}. ${removeEmojis(rule)}\n`;
    });
    if (rules.length === 0) {
        analysis += 'Nenhuma regra registrada.\n';
    }
    analysis += '\nRegras claras evitam impulsos. Revisite este contrato sempre que precisar.';
    return analysis;
}

function generateDay14Analysis(formData: Record<string, unknown>): string {
    const goals30 = Array.isArray(formData.goals_30)
        ? formData.goals_30.map((value) => String(value).trim()).filter((value) => value.length > 0)
        : [formData.goal_30_1, formData.goal_30_2, formData.goal_30_3]
            .map((value) => (typeof value === 'string' ? value.trim() : ''))
            .filter((value) => value.length > 0);
    const goals60 = Array.isArray(formData.goals_60)
        ? formData.goals_60.map((value) => String(value).trim()).filter((value) => value.length > 0)
        : [formData.goal_60_1, formData.goal_60_2]
            .map((value) => (typeof value === 'string' ? value.trim() : ''))
            .filter((value) => value.length > 0);
    const goals90 = Array.isArray(formData.goals_90)
        ? formData.goals_90.map((value) => String(value).trim()).filter((value) => value.length > 0)
        : [formData.goal_90_1, formData.goal_90_2]
            .map((value) => (typeof value === 'string' ? value.trim() : ''))
            .filter((value) => value.length > 0);

    let analysis = 'PLANO 30/90 DIAS\n\n';
    if (goals30.length > 0) {
        analysis += 'Metas 30 dias:\n';
        goals30.forEach((goal) => {
            analysis += `  - ${removeEmojis(goal)}\n`;
        });
    }
    if (goals60.length > 0) {
        analysis += 'Metas 60 dias:\n';
        goals60.forEach((goal) => {
            analysis += `  - ${removeEmojis(goal)}\n`;
        });
    }
    if (goals90.length > 0) {
        analysis += 'Metas 90 dias:\n';
        goals90.forEach((goal) => {
            analysis += `  - ${removeEmojis(goal)}\n`;
        });
    }
    if (goals30.length + goals60.length + goals90.length === 0) {
        analysis += 'Nenhuma meta registrada.\n';
    }
    analysis += '\nMetas claras criam direcao e ajudam a manter o foco.';
    return analysis;
}

function generateDay15Analysis(formData: Record<string, unknown>): string {
    const dayOfWeek = Number(formData.day_of_week);
    const checklist = Array.isArray(formData.checklist) ? formData.checklist : [];
    const nextCommitment = String(formData.next_commitment || '').trim();

    const weekdayLabels = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const dayLabel = Number.isFinite(dayOfWeek) ? (weekdayLabels[dayOfWeek] || '-') : '-';

    let analysis = 'FORMATURA FIRE\n\n';
    analysis += `Dia do ritual semanal: ${dayLabel}\n`;
    analysis += `Itens do checklist: ${checklist.length}\n`;
    if (nextCommitment) {
        analysis += `Proximo compromisso: ${removeEmojis(nextCommitment)}\n`;
    }
    analysis += '\nParabens! Voce concluiu o desafio e tem um ritual para manter a consistencia.';
    return analysis;
}

function generateGenericAnalysis(dayId: number, formData: Record<string, unknown>): string {
    const fieldCount = Object.keys(formData).length;

    return `Dia ${dayId} concluído com sucesso! ${fieldCount} campos registrados. Continue mantendo o foco e a disciplina.`;
}
