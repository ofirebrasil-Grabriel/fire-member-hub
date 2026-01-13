import { useMemo, useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { useDebts, type Debt } from '@/hooks/useDebts';
import { useCalendarItems, type CalendarItem } from '@/hooks/useCalendarItems';
import { useNegotiations, type Negotiation } from '@/hooks/useNegotiations';
import { useCuts, type Cut } from '@/hooks/useCuts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export type CrudType = 'debts' | 'calendar' | 'negotiations' | 'cuts';

interface CrudSectionProps {
  type: CrudType;
}

type CrudItem = Debt | CalendarItem | Negotiation | Cut;

type CrudOperations = {
  items: CrudItem[];
  isLoading: boolean;
  addItem: (payload: unknown) => Promise<unknown>;
  updateItem: (args: { id: string; payload: unknown }) => Promise<unknown>;
  deleteItem: (id: string) => Promise<unknown>;
};

const typeLabels: Record<CrudType, string> = {
  debts: 'Divida',
  calendar: 'Item do calendario',
  negotiations: 'Negociacao',
  cuts: 'Corte',
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  const numeric = value.replace(/[^\d,.-]/g, '');
  if (!numeric) return null;

  const normalized = numeric.includes(',')
    ? numeric.replace(/\./g, '').replace(',', '.')
    : numeric;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="text-sm text-muted-foreground">{label}</div>
    {children}
  </div>
);

const buildDraftForType = (type: CrudType) => {
  switch (type) {
    case 'debts':
      return {
        creditor: '',
        type: '',
        installment_value: '',
        total_balance: '',
        due_day: '',
        status: 'pending',
        is_critical: false,
      };
    case 'calendar':
      return {
        title: '',
        value: '',
        due_date: '',
        is_fixed: false,
        is_critical: false,
        source_debt_id: '',
      };
    case 'negotiations':
      return {
        creditor: '',
        debt_id: '',
        channel: 'whatsapp',
        status: 'pending',
        script_used: false,
        max_entry: '',
        max_installment: '',
        notes: '',
        response: '',
      };
    case 'cuts':
    default:
      return {
        item: '',
        estimated_value: '',
        category: '',
        status: 'proposed',
      };
  }
};

export const CrudSection = ({ type }: CrudSectionProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>(buildDraftForType(type));
  const [saving, setSaving] = useState(false);

  const debtsHook = useDebts();
  const calendarHook = useCalendarItems();
  const negotiationsHook = useNegotiations();
  const cutsHook = useCuts();

  const debtOptions = useMemo(
    () => debtsHook.debts.map((debt) => ({ value: debt.id, label: debt.creditor })),
    [debtsHook.debts]
  );

  const { items, isLoading, addItem, updateItem, deleteItem } = useMemo((): CrudOperations => {
    switch (type) {
      case 'debts':
        return {
          items: debtsHook.debts,
          isLoading: debtsHook.isLoading,
          addItem: debtsHook.addDebt.mutateAsync,
          updateItem: debtsHook.updateDebt.mutateAsync,
          deleteItem: debtsHook.deleteDebt.mutateAsync,
        };
      case 'calendar':
        return {
          items: calendarHook.items,
          isLoading: calendarHook.isLoading,
          addItem: calendarHook.addItem.mutateAsync,
          updateItem: calendarHook.updateItem.mutateAsync,
          deleteItem: calendarHook.deleteItem.mutateAsync,
        };
      case 'negotiations':
        return {
          items: negotiationsHook.negotiations,
          isLoading: negotiationsHook.isLoading,
          addItem: negotiationsHook.addNegotiation.mutateAsync,
          updateItem: negotiationsHook.updateNegotiation.mutateAsync,
          deleteItem: negotiationsHook.deleteNegotiation.mutateAsync,
        };
      case 'cuts':
      default:
        return {
          items: cutsHook.cuts,
          isLoading: cutsHook.isLoading,
          addItem: cutsHook.addCut.mutateAsync,
          updateItem: cutsHook.updateCut.mutateAsync,
          deleteItem: cutsHook.deleteCut.mutateAsync,
        };
    }
  }, [
    type,
    debtsHook,
    calendarHook,
    negotiationsHook,
    cutsHook,
  ]);

  const handleDraftChange = (key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const startAdd = () => {
    setEditingId(null);
    setDraft(buildDraftForType(type));
  };

  const startEdit = (item: CrudItem) => {
    setEditingId(item.id);
    if (type === 'debts') {
      const debt = item as Debt;
      setDraft({
        creditor: debt.creditor || '',
        type: debt.type || '',
        installment_value: debt.installment_value ?? '',
        total_balance: debt.total_balance ?? '',
        due_day: debt.due_day ?? '',
        status: debt.status || 'pending',
        is_critical: Boolean(debt.is_critical),
      });
      return;
    }

    if (type === 'calendar') {
      const calendarItem = item as CalendarItem;
      setDraft({
        title: calendarItem.title || '',
        value: calendarItem.value ?? '',
        due_date: calendarItem.due_date || '',
        is_fixed: Boolean(calendarItem.is_fixed),
        is_critical: Boolean(calendarItem.is_critical),
        source_debt_id: calendarItem.source_debt_id || '',
      });
      return;
    }

    if (type === 'negotiations') {
      const negotiation = item as Negotiation;
      setDraft({
        creditor: negotiation.creditor || '',
        debt_id: negotiation.debt_id || '',
        channel: negotiation.channel || 'whatsapp',
        status: negotiation.status || 'pending',
        script_used: Boolean(negotiation.script_used),
        max_entry: negotiation.max_entry ?? '',
        max_installment: negotiation.max_installment ?? '',
        notes: negotiation.notes || '',
        response: negotiation.response || '',
      });
      return;
    }

    const cut = item as Cut;
    setDraft({
      item: cut.item || '',
      estimated_value: cut.estimated_value ?? '',
      category: cut.category || '',
      status: cut.status || 'proposed',
    });
  };

  const normalizeDraft = () => {
    if (type === 'debts') {
      return {
        creditor: String(draft.creditor || ''),
        type: draft.type ? String(draft.type) : null,
        installment_value: toNumber(draft.installment_value),
        total_balance: toNumber(draft.total_balance),
        due_day: draft.due_day === '' ? null : Number(draft.due_day),
        status: String(draft.status || 'pending'),
        is_critical: Boolean(draft.is_critical),
      };
    }

    if (type === 'calendar') {
      return {
        title: String(draft.title || ''),
        value: toNumber(draft.value),
        due_date: draft.due_date ? String(draft.due_date) : null,
        is_fixed: Boolean(draft.is_fixed),
        is_critical: Boolean(draft.is_critical),
        source_debt_id: draft.source_debt_id ? String(draft.source_debt_id) : null,
      };
    }

    if (type === 'negotiations') {
      return {
        creditor: String(draft.creditor || ''),
        debt_id: draft.debt_id ? String(draft.debt_id) : null,
        channel: draft.channel ? String(draft.channel) : null,
        status: String(draft.status || 'pending'),
        script_used: Boolean(draft.script_used),
        max_entry: toNumber(draft.max_entry),
        max_installment: toNumber(draft.max_installment),
        notes: draft.notes ? String(draft.notes) : null,
        response: draft.response ? String(draft.response) : null,
      };
    }

    return {
      item: String(draft.item || ''),
      estimated_value: toNumber(draft.estimated_value),
      category: draft.category ? String(draft.category) : null,
      status: String(draft.status || 'proposed'),
    };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const normalized = normalizeDraft();

      if (editingId) {
        await updateItem({ id: editingId, payload: normalized });
        toast({ title: `${typeLabels[type]} atualizado` });
      } else {
        await addItem(normalized);
        toast({ title: `${typeLabels[type]} adicionado` });
      }

      setEditingId(null);
      setDraft(buildDraftForType(type));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      toast({ title: 'Erro ao salvar', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({ title: `${typeLabels[type]} removido` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      toast({ title: 'Erro ao remover', description: message, variant: 'destructive' });
    }
  };

  const renderFormFields = () => {
    if (type === 'debts') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Credor">
            <Input
              value={draft.creditor as string}
              onChange={(event) => handleDraftChange('creditor', event.target.value)}
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Tipo">
            <Input
              value={draft.type as string}
              onChange={(event) => handleDraftChange('type', event.target.value)}
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Parcela">
            <Input
              value={draft.installment_value as string}
              onChange={(event) => handleDraftChange('installment_value', event.target.value)}
              inputMode="decimal"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Saldo total">
            <Input
              value={draft.total_balance as string}
              onChange={(event) => handleDraftChange('total_balance', event.target.value)}
              inputMode="decimal"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Dia de vencimento">
            <Input
              value={draft.due_day as string}
              onChange={(event) => handleDraftChange('due_day', event.target.value)}
              type="number"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Status">
            <Select
              value={String(draft.status || 'pending')}
              onValueChange={(value) => handleDraftChange('status', value)}
            >
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="negotiating">Negociando</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Critica">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(draft.is_critical)}
                onCheckedChange={(value) => handleDraftChange('is_critical', value === true)}
              />
              Marcar como critica
            </label>
          </Field>
        </div>
      );
    }

    if (type === 'calendar') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Titulo">
            <Input
              value={draft.title as string}
              onChange={(event) => handleDraftChange('title', event.target.value)}
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Valor">
            <Input
              value={draft.value as string}
              onChange={(event) => handleDraftChange('value', event.target.value)}
              inputMode="decimal"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Data">
            <Input
              value={draft.due_date as string}
              onChange={(event) => handleDraftChange('due_date', event.target.value)}
              type="date"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Origem (divida)">
            <Select
              value={draft.source_debt_id ? String(draft.source_debt_id) : 'none'}
              onValueChange={(value) =>
                handleDraftChange('source_debt_id', value === 'none' ? '' : value)
              }
            >
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {debtOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Fixado">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(draft.is_fixed)}
                onCheckedChange={(value) => handleDraftChange('is_fixed', value === true)}
              />
              Item fixo
            </label>
          </Field>
          <Field label="Critico">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(draft.is_critical)}
                onCheckedChange={(value) => handleDraftChange('is_critical', value === true)}
              />
              Item critico
            </label>
          </Field>
        </div>
      );
    }

    if (type === 'negotiations') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Credor">
            <Input
              value={draft.creditor as string}
              onChange={(event) => handleDraftChange('creditor', event.target.value)}
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Divida vinculada">
            <Select
              value={draft.debt_id ? String(draft.debt_id) : 'none'}
              onValueChange={(value) => handleDraftChange('debt_id', value === 'none' ? '' : value)}
            >
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {debtOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Canal">
            <Select
              value={String(draft.channel || 'whatsapp')}
              onValueChange={(value) => handleDraftChange('channel', value)}
            >
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={String(draft.status || 'pending')}
              onValueChange={(value) => handleDraftChange('status', value)}
            >
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="accepted">Aceita</SelectItem>
                <SelectItem value="rejected">Recusada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Entrada maxima">
            <Input
              value={draft.max_entry as string}
              onChange={(event) => handleDraftChange('max_entry', event.target.value)}
              inputMode="decimal"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Parcela maxima">
            <Input
              value={draft.max_installment as string}
              onChange={(event) => handleDraftChange('max_installment', event.target.value)}
              inputMode="decimal"
              className="bg-surface border-border"
            />
          </Field>
          <Field label="Script usado">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={Boolean(draft.script_used)}
                onCheckedChange={(value) => handleDraftChange('script_used', value === true)}
              />
              Usou o script
            </label>
          </Field>
          <Field label="Notas">
            <Textarea
              value={draft.notes as string}
              onChange={(event) => handleDraftChange('notes', event.target.value)}
              className="bg-surface border-border"
              rows={3}
            />
          </Field>
          <Field label="Resposta">
            <Textarea
              value={draft.response as string}
              onChange={(event) => handleDraftChange('response', event.target.value)}
              className="bg-surface border-border"
              rows={3}
            />
          </Field>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Item">
          <Input
            value={draft.item as string}
            onChange={(event) => handleDraftChange('item', event.target.value)}
            className="bg-surface border-border"
          />
        </Field>
        <Field label="Categoria">
          <Input
            value={draft.category as string}
            onChange={(event) => handleDraftChange('category', event.target.value)}
            className="bg-surface border-border"
          />
        </Field>
        <Field label="Economia estimada">
          <Input
            value={draft.estimated_value as string}
            onChange={(event) => handleDraftChange('estimated_value', event.target.value)}
            inputMode="decimal"
            className="bg-surface border-border"
          />
        </Field>
        <Field label="Status">
          <Select
            value={String(draft.status || 'proposed')}
            onValueChange={(value) => handleDraftChange('status', value)}
          >
            <SelectTrigger className="bg-surface border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proposed">Proposto</SelectItem>
              <SelectItem value="executed">Executado</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">{typeLabels[type]}</h4>
          <p className="text-sm text-muted-foreground">Gerencie os dados desta etapa.</p>
        </div>
        <Button variant="outline" size="sm" onClick={startAdd}>
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="glass-card p-4 text-sm text-muted-foreground">
            Nenhum item cadastrado ainda.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-start justify-between gap-4">
              <div className="space-y-1">
                {type === 'debts' && (
                  <>
                    <div className="font-semibold">{(item as Debt).creditor}</div>
                    <div className="text-xs text-muted-foreground">
                      Parcela {formatCurrency((item as Debt).installment_value)} · Saldo {formatCurrency((item as Debt).total_balance)}
                    </div>
                  </>
                )}
                {type === 'calendar' && (
                  <>
                    <div className="font-semibold">{(item as CalendarItem).title}</div>
                    <div className="text-xs text-muted-foreground">
                      {(item as CalendarItem).due_date || 'Sem data'} · {formatCurrency((item as CalendarItem).value)}
                    </div>
                  </>
                )}
                {type === 'negotiations' && (
                  <>
                    <div className="font-semibold">{(item as Negotiation).creditor}</div>
                    <div className="text-xs text-muted-foreground">
                      {(item as Negotiation).status} · {(item as Negotiation).channel || 'Canal nao definido'}
                    </div>
                  </>
                )}
                {type === 'cuts' && (
                  <>
                    <div className="font-semibold">{(item as Cut).item}</div>
                    <div className="text-xs text-muted-foreground">
                      {(item as Cut).status} · {formatCurrency((item as Cut).estimated_value)}
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={cn('glass-card p-5 space-y-4', (editingId || draft) && 'animate-fade-up')}>
        <h5 className="font-semibold">
          {editingId ? `Editar ${typeLabels[type]}` : `Adicionar ${typeLabels[type]}`}
        </h5>
        {renderFormFields()}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={startAdd}>
            Limpar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="btn-fire">
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
