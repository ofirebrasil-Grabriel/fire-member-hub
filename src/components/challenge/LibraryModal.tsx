import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  NEGOTIATION_SCRIPTS,
  ANTI_FRAUD_CHECKLIST,
  CUT_CATEGORIES,
} from '@/data/library';
import { toast } from '@/hooks/use-toast';

interface LibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LibraryModal = ({ open, onOpenChange }: LibraryModalProps) => {
  const [tab, setTab] = useState('scripts');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copiado para a area de transferencia' });
    } catch (error) {
      toast({ title: 'Nao foi possivel copiar', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Biblioteca de Recursos</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="anti">Anti-golpe</TabsTrigger>
            <TabsTrigger value="cuts">Cortes</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="space-y-4">
            {Object.entries(NEGOTIATION_SCRIPTS).map(([channel, scripts]) => (
              <div key={channel} className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">
                  {channel}
                </h4>
                <div className="grid gap-3">
                  {scripts.map((script) => (
                    <div key={script.title} className="glass-card p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="font-medium">{script.title}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(script.text)}
                        >
                          <Copy className="w-4 h-4" />
                          Copiar
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{script.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="anti" className="space-y-3">
            <div className="glass-card p-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {ANTI_FRAUD_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-primary mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="cuts" className="space-y-4">
            {Object.entries(CUT_CATEGORIES).map(([category, items]) => (
              <div key={category} className="glass-card p-4">
                <h4 className="font-semibold capitalize">{category}</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
