import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayConfig, InputField } from '@/config/dayEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DayInputFormProps {
  inputs: DayConfig['inputs'];
  defaultValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const buildSchemaForInput = (input: InputField) => {
  const isRequired = Boolean(input.required);

  switch (input.type) {
    case 'checkbox': {
      if (isRequired) {
        return z.boolean().refine((value) => value === true, {
          message: 'Campo obrigatorio',
        });
      }
      return z.boolean().optional();
    }
    case 'checkboxGroup': {
      const schema = z.array(z.string());
      return isRequired ? schema.min(1, { message: 'Selecione pelo menos um item' }) : schema.optional();
    }
    case 'slider': {
      const schema = z.number();
      return isRequired ? schema : schema.optional();
    }
    default: {
      const schema = z.string();
      return isRequired ? schema.min(1, { message: 'Campo obrigatorio' }) : schema.optional();
    }
  }
};

const generateSchema = (inputs: InputField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  inputs.forEach((input) => {
    shape[input.name] = buildSchemaForInput(input);
  });
  return z.object(shape);
};

const buildDefaultValues = (inputs: InputField[], defaults?: Record<string, unknown>) => {
  return inputs.reduce<Record<string, unknown>>((acc, input) => {
    if (defaults && Object.prototype.hasOwnProperty.call(defaults, input.name)) {
      acc[input.name] = defaults[input.name];
      return acc;
    }

    switch (input.type) {
      case 'checkbox':
        acc[input.name] = false;
        break;
      case 'checkboxGroup':
        acc[input.name] = [];
        break;
      case 'slider':
        acc[input.name] = 0;
        break;
      default:
        acc[input.name] = '';
        break;
    }

    return acc;
  }, {});
};

export const DayInputForm = ({
  inputs,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Concluir',
}: DayInputFormProps) => {
  const schema = useMemo(() => generateSchema(inputs), [inputs]);
  const initialValues = useMemo(
    () => buildDefaultValues(inputs, defaultValues),
    [inputs, defaultValues]
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const fieldClassName =
    'h-11 rounded-xl border-border/60 bg-surface/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0';
  const textAreaClassName =
    'min-h-[120px] rounded-xl border-border/60 bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0';

  const renderLabel = (input: InputField) => (
    <span className="flex items-center gap-1">
      {input.label}
      {input.required && <span className="text-primary">*</span>}
    </span>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {inputs.map((input) => (
          <FormField
            key={input.name}
            control={form.control}
            name={input.name}
            render={({ field }) => {
              if (input.type === 'checkbox') {
                return (
                  <FormItem className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={Boolean(field.value)}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-foreground">
                        {renderLabel(input)}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }

              return (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-foreground">
                    {renderLabel(input)}
                  </FormLabel>
                  <FormControl>
                    {(() => {
                      switch (input.type) {
                        case 'textarea':
                          return (
                            <Textarea
                              {...field}
                              value={String(field.value ?? '')}
                              rows={4}
                              placeholder={input.placeholder}
                              className={textAreaClassName}
                            />
                          );
                        case 'select':
                          return (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                            >
                              <SelectTrigger className={fieldClassName}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {(input.options || []).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        case 'checkboxGroup':
                          return (
                            <div className="grid gap-3 rounded-xl border border-border/50 bg-surface/40 p-3 md:grid-cols-2">
                              {(input.options || []).map((option) => {
                                const currentValue = Array.isArray(field.value) ? field.value : [];
                                const checked = currentValue.includes(option.value);
                                return (
                                  <label key={option.value} className="flex items-center gap-2 text-sm text-foreground">
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(value) => {
                                        if (value === true) {
                                          field.onChange([...currentValue, option.value]);
                                          return;
                                        }
                                        field.onChange(currentValue.filter((item: string) => item !== option.value));
                                      }}
                                      className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                    />
                                    {option.label}
                                  </label>
                                );
                              })}
                            </div>
                          );
                        case 'slider': {
                          const sliderValue = Number(field.value) || 0;
                          return (
                            <div className="space-y-3">
                              <Slider
                                value={[sliderValue]}
                                min={0}
                                max={10}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="py-1"
                              />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>0</span>
                                <span className="text-sm font-semibold text-primary">{sliderValue}</span>
                                <span>10</span>
                              </div>
                            </div>
                          );
                        }
                        case 'time':
                        case 'number':
                          return (
                            <Input
                              {...field}
                              value={String(field.value ?? '')}
                              type={input.type}
                              placeholder={input.placeholder || (input.type === 'time' ? '--:--' : undefined)}
                              className={fieldClassName}
                            />
                          );
                        case 'currency':
                          return (
                            <Input
                              {...field}
                              value={String(field.value ?? '')}
                              inputMode="decimal"
                              placeholder={input.placeholder || 'R$ 0,00'}
                              className={fieldClassName}
                            />
                          );
                        default:
                          return (
                            <Input
                              {...field}
                              value={String(field.value ?? '')}
                              placeholder={input.placeholder}
                              className={fieldClassName}
                            />
                          );
                      }
                    })()}
                  </FormControl>
                  {input.helperText && (
                    <FormDescription className="text-xs text-muted-foreground">
                      {input.helperText}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}

        <div className="pt-2">
          <Button type="submit" className="btn-fire w-full" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
