/**
 * Gera análise textual baseada nos dados do dia
 */

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
    analysis += '\n\n📘 GUIA DE REPROGRAMAÇÃO: ';
    analysis += 'Suas crenças sobre dinheiro foram formadas na infância, observando adultos ao redor. ';
    analysis += 'Para reprogramá-las, comece observando seus pensamentos automáticos sobre dinheiro sem julgamento. ';
    analysis += 'Depois, questione: "Essa crença é minha ou herdei de alguém?" ';
    analysis += 'Finalmente, escolha uma nova crença que sirva melhor aos seus objetivos atuais.';

    return analysis;
}

function generateDay2Analysis(formData: Record<string, unknown>): string {
    const totalIncome = Number(formData.total_income) || 0;
    const totalExpenses = Number(formData.total_expenses) || 0;
    const gap = totalIncome - totalExpenses;

    let analysis = 'Suas entradas e despesas fixas foram mapeadas. ';

    if (gap > 0) {
        analysis += `Você tem uma margem positiva de R$ ${gap.toFixed(2)}, o que é excelente para atacar dívidas. `;
    } else if (gap < 0) {
        analysis += `Atenção: suas despesas superam sua renda em R$ ${Math.abs(gap).toFixed(2)}. Precisamos encontrar formas de aumentar renda ou reduzir gastos. `;
    } else {
        analysis += 'Suas contas estão no limite, sem margem para imprevistos. ';
    }

    return analysis;
}

function generateDay3Analysis(formData: Record<string, unknown>): string {
    const shadowCount = Number(formData.shadow_expenses_count) || 0;
    const shadowValue = Number(formData.shadow_expenses_value) || 0;
    const totalValue = Number(formData.total_value) || 0;

    let analysis = 'Sua arqueologia financeira revelou padrões importantes. ';

    if (shadowCount > 0) {
        const percentage = totalValue > 0 ? ((shadowValue / totalValue) * 100).toFixed(1) : 0;
        analysis += `Foram identificados ${shadowCount} gastos sombra totalizando R$ ${shadowValue.toFixed(2)} (${percentage}% do total). `;
        analysis += 'Esses gastos são oportunidades diretas de economia. ';
    } else {
        analysis += 'Nenhum gasto sombra identificado - ou você já é muito consciente, ou precisa revisar com mais atenção. ';
    }

    return analysis;
}

function generateDay4Analysis(formData: Record<string, unknown>): string {
    const weeklyLimit = Number(formData.weekly_limit) || 0;
    const blockedCategories = (formData.blocked_categories as string[]) || [];

    let analysis = 'Suas travas anti-rombo foram configuradas. ';

    if (weeklyLimit > 0) {
        analysis += `Limite semanal de R$ ${weeklyLimit.toFixed(2)} definido. `;
    }

    if (blockedCategories.length > 0) {
        analysis += `${blockedCategories.length} categorias de gastos bloqueadas para os próximos 15 dias. `;
    }

    analysis += 'Mantenha a disciplina - cada dia conta!';

    return analysis;
}

function generateDay5Analysis(formData: Record<string, unknown>): string {
    return 'Sua ordem de ataque foi definida. Foque na primeira dívida da lista antes de partir para as outras. Concentração de esforço = resultados mais rápidos.';
}

function generateDay6Analysis(formData: Record<string, unknown>): string {
    const totalBudget = Number(formData.total_budget) || 0;
    const income = Number(formData.income) || 0;

    let analysis = 'Seu orçamento 30D foi criado. ';

    if (income > 0 && totalBudget > income) {
        analysis += 'Atenção: seu orçamento está acima da renda. Revise os cortes do Dia 6. ';
    } else if (income > 0) {
        const leftover = income - totalBudget;
        analysis += `Você terá R$ ${leftover.toFixed(2)} de sobra para emergências ou pagamento extra de dívidas.`;
    }

    return analysis;
}

function generateDay7Analysis(formData: Record<string, unknown>): string {
    const monthlySavings = Number(formData.monthly_savings) || 0;
    const actionType = formData.action_type as string || '';

    let analysis = 'Conta fixa reduzida com sucesso! ';

    if (monthlySavings > 0) {
        const yearly = monthlySavings * 12;
        analysis += `Economia de R$ ${monthlySavings.toFixed(2)}/mês = R$ ${yearly.toFixed(2)}/ano. `;
    }

    if (actionType === 'cancel') {
        analysis += 'Cancelar foi a melhor escolha - dinheiro que volta para o seu bolso.';
    } else if (actionType === 'negotiate') {
        analysis += 'Negociar é uma habilidade que você pode usar em várias situações.';
    }

    return analysis;
}

function generateGenericAnalysis(dayId: number, formData: Record<string, unknown>): string {
    const fieldCount = Object.keys(formData).length;

    return `Dia ${dayId} concluído com sucesso! ${fieldCount} campos registrados. Continue mantendo o foco e a disciplina.`;
}
