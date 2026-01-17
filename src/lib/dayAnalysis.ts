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
        default:
            return generateGenericAnalysis(dayId, formData);
    }
}

function generateDay1Analysis(formData: Record<string, unknown>): string {
    const feeling = formData.feeling_about_money as string;
    const emotions = (formData.current_emotions as string[]) || [];
    const blocks = (formData.biggest_blocks as string[]) || [];
    const goals = (formData.goals_15_days as string[]) || [];
    const issues = (formData.current_issues as string[]) || [];

    let analysis = '';

    // Análise do sentimento com dinheiro
    if (feeling === 'run') {
        analysis += 'Você demonstra um padrão de evitação em relação ao dinheiro. Isso é comum quando tivemos experiências negativas com finanças. ';
        analysis += 'O primeiro passo é entender que esse medo é uma proteção criada pelo seu cérebro, mas que agora precisa ser reprogramada. ';
    } else if (feeling === 'heavy') {
        analysis += 'O peso que você sente ao pensar em dinheiro indica que suas finanças ocupam um espaço emocional significativo. ';
        analysis += 'Vamos trabalhar para transformar essa carga em leveza através de organização e clareza. ';
    } else if (feeling === 'light') {
        analysis += 'Ótimo! Você já tem uma relação mais leve com o dinheiro. ';
        analysis += 'Isso é uma excelente base para construir hábitos financeiros saudáveis. ';
    }

    // Análise das emoções
    if (emotions.includes('fear') || emotions.includes('anxiety')) {
        analysis += 'A ansiedade e o medo financeiro geralmente vêm de incertezas sobre o futuro. ';
        analysis += 'Nos próximos dias, vamos criar previsibilidade para acalmar esse sistema de alerta interno. ';
    }

    if (emotions.includes('shame') || emotions.includes('guilt')) {
        analysis += 'Vergonha e culpa são emoções que nos paralisam. Lembre-se: sua situação financeira não define quem você é. ';
    }

    // Análise dos bloqueios
    if (blocks.includes('see_numbers')) {
        analysis += 'Evitar ver os números é uma forma de proteção, mas impede o progresso. ';
        analysis += 'Vamos começar devagar, com pequenas olhadas que vão ficando mais confortáveis. ';
    }

    if (blocks.includes('home_conflict')) {
        analysis += 'Conflitos em casa sobre dinheiro são muito comuns. Uma conversa estruturada pode ajudar a alinhar expectativas. ';
    }

    // Situação atual
    if (issues.length > 3) {
        analysis += 'Com múltiplos desafios financeiros simultâneos, é importante priorizar e atacar um de cada vez. ';
    }

    // Objetivos
    if (goals.includes('breathe')) {
        analysis += 'Seu objetivo de "respirar" mostra que você precisa primeiro de alívio emocional antes de pensar em estratégias. Vamos respeitar esse ritmo. ';
    }

    if (goals.includes('plan_30_90')) {
        analysis += 'Ótimo que você quer um plano estruturado! Os próximos 15 dias vão te preparar exatamente para isso. ';
    }

    // Guia de reprogramação
    analysis += '\n\n GUIA DE REPROGRAMAÇÃO: ';
    analysis += 'Suas crenças sobre dinheiro foram formadas na infância, observando adultos ao redor. ';
    analysis += 'Para reprogramá-las, comece observando seus pensamentos automáticos sobre dinheiro sem julgamento. ';
    analysis += 'Depois, questione: "Essa crença é minha ou herdei de alguém?" ';
    analysis += 'Finalmente, escolha uma nova crença que sirva melhor aos seus objetivos atuais.';

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

    let analysis = ' RESUMO FINANCEIRO: ';
    analysis += `Você mapeou ${incomeCount} fontes de renda, ${expenseCount} despesas fixas e ${debtCount} dívidas. `;

    if (balance > 0) {
        const percentage = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0;
        analysis += `\n\n SALDO POSITIVO: Sobram R$ ${balance.toFixed(2)}/mês (${percentage}% da renda). `;
        analysis += 'Esse valor pode ser direcionado para quitar dívidas ou criar sua reserva. ';
    } else if (balance < 0) {
        analysis += `\n\n SALDO NEGATIVO: Faltam R$ ${Math.abs(balance).toFixed(2)}/mês. `;
        analysis += 'É urgente revisar despesas ou buscar renda extra. Vamos trabalhar isso nos próximos dias. ';
    } else {
        analysis += '\n\n SALDO ZERO: Suas contas fecham no limite, sem margem para imprevistos. ';
    }

    if (totalDebtsMin > 0) {
        const debtPercentage = totalIncome > 0 ? ((totalDebtsMin / totalIncome) * 100).toFixed(0) : 0;
        analysis += `\n\n COMPROMETIMENTO COM DÍVIDAS: R$ ${totalDebtsMin.toFixed(2)}/mês (${debtPercentage}% da renda). `;
        if (Number(debtPercentage) > 30) {
            analysis += 'Este percentual está alto. Priorize quitar as dívidas com maiores juros primeiro.';
        }
    }

    analysis += '\n\n PRÓXIMO PASSO: Com esse mapa financeiro, você terá clareza para tomar decisões nos próximos dias do desafio.';

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
    const monthlySavings = Number(formData.monthly_savings) || 0;
    const actionType = formData.action_type as string || '';

    let analysis = 'Conta fixa reduzida com sucesso! ';

    if (monthlySavings > 0) {
        const yearly = monthlySavings * 12;
        analysis += `Economia de R$ ${monthlySavings.toFixed(2)}/mes = R$ ${yearly.toFixed(2)}/ano. `;
    }

    if (actionType === 'cancel') {
        analysis += 'Cancelar foi a melhor escolha - dinheiro que volta para o seu bolso.';
    } else if (actionType === 'negotiate') {
        analysis += 'Negociar e uma habilidade que voce pode usar em varias situacoes.';
    }

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

function generateGenericAnalysis(dayId: number, formData: Record<string, unknown>): string {
    const fieldCount = Object.keys(formData).length;

    return `Dia ${dayId} concluído com sucesso! ${fieldCount} campos registrados. Continue mantendo o foco e a disciplina.`;
}
