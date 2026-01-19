import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Heart, Brain, Target } from 'lucide-react';

interface Day1FormProps {
    onComplete: (formData: Record<string, unknown>) => void;
    defaultValues?: Record<string, unknown>;
}

const EMOTIONS = [
    { id: 'anxiety', label: 'Ansiedade' },
    { id: 'fear', label: 'Medo' },
    { id: 'shame', label: 'Vergonha' },
    { id: 'guilt', label: 'Culpa' },
    { id: 'frustration', label: 'Frustração' },
    { id: 'hopelessness', label: 'Desesperança' },
    { id: 'denial', label: 'Negação' },
    { id: 'hope', label: 'Esperança' },
];

const SITUATIONS = [
    { id: 'late_bills', label: 'Boleto atrasado' },
    { id: 'growing_invoice', label: 'Fatura crescendo' },
    { id: 'no_savings', label: 'Sem reserva' },
    { id: 'debt_calls', label: 'Cobrança ligando' },
    { id: 'living_paycheck', label: 'Vivendo de salário em salário' },
    { id: 'partner_conflict', label: 'Conflito com parceiro(a) sobre dinheiro' },
];

const BLOCKS = [
    { id: 'no_knowledge', label: 'Não sei por onde começar' },
    { id: 'fear_numbers', label: 'Medo de ver os números' },
    { id: 'procrastination', label: 'Sempre deixo para depois' },
    { id: 'shame', label: 'Vergonha da situação' },
    { id: 'no_partner_support', label: 'Falta de apoio do parceiro(a)' },
];

const GOALS = [
    { id: 'clarity', label: 'Ter clareza sobre minhas finanças' },
    { id: 'stop_debt', label: 'Parar de fazer dívidas' },
    { id: 'pay_debt', label: 'Pagar dívidas' },
    { id: 'save', label: 'Começar a guardar dinheiro' },
    { id: 'peace', label: 'Ter paz de espírito' },
    { id: 'control', label: 'Sentir que tenho controle' },
];

const Day1Form: React.FC<Day1FormProps> = ({ onComplete, defaultValues = {} }) => {
    const [formData, setFormData] = useState<Record<string, unknown>>({
        feeling_about_money: defaultValues.feeling_about_money || '',
        first_money_memories: defaultValues.first_money_memories || '',
        rich_people_traits: defaultValues.rich_people_traits || '',
        poor_people_traits: defaultValues.poor_people_traits || '',
        current_emotions: defaultValues.current_emotions || [],
        ideal_life: defaultValues.ideal_life || '',
        current_issues: defaultValues.current_issues || [],
        monthly_income: defaultValues.monthly_income || '',
        biggest_expense: defaultValues.biggest_expense || '',
        has_partner: defaultValues.has_partner || '',
        biggest_blocks: defaultValues.biggest_blocks || [],
        goals_15_days: defaultValues.goals_15_days || [],
        schedule_time: defaultValues.schedule_time || '09:00',
        breath_score: defaultValues.breath_score || 5,
        breath_note: defaultValues.breath_note || '',
    });
    const [saving, setSaving] = useState(false);

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: string, item: string) => {
        const current = (formData[field] as string[]) || [];
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        updateField(field, updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            onComplete(formData);
        } finally {
            setSaving(false);
        }
    };

    const isValid = () => {
        return (
            formData.feeling_about_money &&
            formData.schedule_time &&
            (formData.current_emotions as string[])?.length > 0
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção 1: Como você se sente */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Sua relação com dinheiro</h3>
                </div>

                <div className="space-y-2">
                    <Label>Como você se sente quando pensa em dinheiro? *</Label>
                    <Select
                        value={formData.feeling_about_money as string}
                        onValueChange={(value) => updateField('feeling_about_money', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Leve, tranquilo</SelectItem>
                            <SelectItem value="heavy">Pesado, preocupado</SelectItem>
                            <SelectItem value="run">Dá vontade de fugir</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Quais emoções surgem ao pensar nas suas finanças? *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EMOTIONS.map((emotion) => (
                            <div
                                key={emotion.id}
                                onClick={() => toggleArrayItem('current_emotions', emotion.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(formData.current_emotions as string[])?.includes(emotion.id)
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-sm font-medium">{emotion.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção 2: Crenças sobre dinheiro */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Crenças sobre dinheiro</h3>
                </div>

                <div className="space-y-2">
                    <Label>Quais são suas primeiras lembranças envolvendo dinheiro?</Label>
                    <Textarea
                        placeholder="Descreva memórias da infância relacionadas a dinheiro..."
                        value={formData.first_money_memories as string}
                        onChange={(e) => updateField('first_money_memories', e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Quando pensa em pessoas ricas, o que vem à mente?</Label>
                        <Textarea
                            placeholder="Características, sentimentos, julgamentos..."
                            value={formData.rich_people_traits as string}
                            onChange={(e) => updateField('rich_people_traits', e.target.value)}
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Quando pensa em pessoas pobres, o que vem à mente?</Label>
                        <Textarea
                            placeholder="Características, sentimentos, julgamentos..."
                            value={formData.poor_people_traits as string}
                            onChange={(e) => updateField('poor_people_traits', e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Se dinheiro não fosse problema, como gostaria de viver?</Label>
                    <Textarea
                        placeholder="Descreva sua vida ideal..."
                        value={formData.ideal_life as string}
                        onChange={(e) => updateField('ideal_life', e.target.value)}
                        rows={3}
                    />
                </div>
            </div>

            {/* Seção 3: Situação atual */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Situação atual</h3>
                </div>

                <div className="space-y-2">
                    <Label>O que está acontecendo agora?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SITUATIONS.map((situation) => (
                            <div
                                key={situation.id}
                                onClick={() => toggleArrayItem('current_issues', situation.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(formData.current_issues as string[])?.includes(situation.id)
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-sm">{situation.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Quanto você ganha por mês (aproximadamente)?</Label>
                        <Input
                            type="number"
                            placeholder="R$ 0,00"
                            value={formData.monthly_income as string}
                            onChange={(e) => updateField('monthly_income', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>O que mais pesa no seu mês?</Label>
                        <Input
                            placeholder="Ex: Aluguel, cartão de crédito..."
                            value={formData.biggest_expense as string}
                            onChange={(e) => updateField('biggest_expense', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Tem alguém para dividir a vida financeira?</Label>
                    <Select
                        value={formData.has_partner as string}
                        onValueChange={(value) => updateField('has_partner', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Sim</SelectItem>
                            <SelectItem value="no">Não</SelectItem>
                            <SelectItem value="sometimes">Às vezes dividimos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>O que mais te trava ao lidar com dinheiro?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {BLOCKS.map((block) => (
                            <div
                                key={block.id}
                                onClick={() => toggleArrayItem('biggest_blocks', block.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(formData.biggest_blocks as string[])?.includes(block.id)
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-sm">{block.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>O que você mais quer nesses 15 dias?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {GOALS.map((goal) => (
                            <div
                                key={goal.id}
                                onClick={() => toggleArrayItem('goals_15_days', goal.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(formData.goals_15_days as string[])?.includes(goal.id)
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="text-sm">{goal.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção 4: Termômetro Emocional */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Termômetro Emocional</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label>De 0 a 10, quanto você consegue "respirar" financeiramente hoje?</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            0 = Sufocado, sem saída | 10 = Tranquilo, tudo sob controle
                        </p>
                    </div>
                    <div className="pt-2">
                        <Slider
                            value={[formData.breath_score as number]}
                            onValueChange={(value) => updateField('breath_score', value[0])}
                            min={0}
                            max={10}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>0 - Sufocado</span>
                            <span className="text-2xl font-bold text-primary">{String(formData.breath_score)}</span>
                            <span>10 - Tranquilo</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Por que você escolheu esse número?</Label>
                        <Textarea
                            placeholder="Explique sua nota..."
                            value={formData.breath_note as string}
                            onChange={(e) => updateField('breath_note', e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                    <Label>Qual horário você vai dedicar ao desafio? *</Label>
                    <Input
                        type="time"
                        value={formData.schedule_time as string}
                        onChange={(e) => updateField('schedule_time', e.target.value)}
                        className="w-40"
                    />
                    <p className="text-xs text-muted-foreground">
                        Vamos enviar lembretes nesse horário.
                    </p>
                </div>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={!isValid() || saving}
                className="w-full btn-fire py-6 text-lg"
            >
                {saving ? 'Salvando...' : 'Concluir Dia 1 e Começar a Jornada'}
            </Button>
        </form>
    );
};

export default Day1Form;
