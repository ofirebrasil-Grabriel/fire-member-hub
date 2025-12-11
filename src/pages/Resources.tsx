import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  FileSpreadsheet, 
  FileText, 
  Video, 
  Music, 
  Download, 
  Search,
  Filter,
  FolderOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const resourceCategories = [
  { id: 'all', label: 'Todos', icon: FolderOpen },
  { id: 'spreadsheet', label: 'Planilhas', icon: FileSpreadsheet },
  { id: 'document', label: 'Documentos', icon: FileText },
  { id: 'video', label: 'Vídeos', icon: Video },
  { id: 'audio', label: 'Áudios', icon: Music },
];

const resources = [
  { id: 1, title: 'Checklist de Crenças Limitantes', type: 'spreadsheet', day: 1, description: 'Identifique e trabalhe suas crenças sobre dinheiro' },
  { id: 2, title: 'Exercício de Autoconhecimento', type: 'document', day: 1, description: 'Reflita sobre sua relação com o dinheiro' },
  { id: 3, title: 'Diário de Sentimentos', type: 'spreadsheet', day: 1, description: 'Registre suas emoções financeiras diárias' },
  { id: 4, title: 'Raio-X Receitas', type: 'spreadsheet', day: 2, description: 'Mapeie todas as suas fontes de renda' },
  { id: 5, title: 'Raio-X Despesas', type: 'spreadsheet', day: 2, description: 'Categorize todos os seus gastos' },
  { id: 6, title: 'Raio-X Dívidas', type: 'spreadsheet', day: 2, description: 'Liste e priorize suas dívidas' },
  { id: 7, title: 'Guia de Mapeamento Financeiro', type: 'document', day: 2, description: 'Passo a passo para o diagnóstico' },
  { id: 8, title: 'Registro de Hábitos de Consumo', type: 'spreadsheet', day: 3, description: 'Identifique padrões de gastos' },
  { id: 9, title: 'Roteiro de Autoanálise', type: 'document', day: 3, description: 'Descubra seus gatilhos de consumo' },
  { id: 10, title: 'Calculadora de Saldo Real', type: 'spreadsheet', day: 4, description: 'Calcule sua situação financeira atual' },
  { id: 11, title: 'Priorização dos Inimigos', type: 'spreadsheet', day: 4, description: 'Identifique os maiores ralos financeiros' },
  { id: 12, title: 'Lista de Cortes', type: 'spreadsheet', day: 5, description: 'Planeje cortes estratégicos' },
  { id: 13, title: 'Guia de Corte Estratégico', type: 'document', day: 5, description: 'Aprenda a cortar sem sacrifício' },
  { id: 14, title: 'Script de Negociação', type: 'document', day: 6, description: 'Modelos para renegociar dívidas' },
  { id: 15, title: 'Painel de Controle', type: 'spreadsheet', day: 7, description: 'Seu dashboard financeiro completo' },
  { id: 16, title: 'Mapa de Prioridades', type: 'spreadsheet', day: 9, description: 'Alinhe gastos com valores' },
  { id: 17, title: 'Planilha de Orçamento FIRE', type: 'spreadsheet', day: 10, description: 'Planejamento financeiro mensal' },
  { id: 18, title: 'Mapa de Valores', type: 'spreadsheet', day: 12, description: 'Associe gastos aos seus valores' },
  { id: 19, title: 'Calculadora FIRE', type: 'spreadsheet', day: 14, description: 'Calcule seu número FIRE' },
  { id: 20, title: 'Plano de Ação Contínuo', type: 'document', day: 15, description: 'Mantenha o progresso após o desafio' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'spreadsheet': return FileSpreadsheet;
    case 'document': return FileText;
    case 'video': return Video;
    case 'audio': return Music;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'spreadsheet': return 'text-success bg-success/10';
    case 'document': return 'text-primary bg-primary/10';
    case 'video': return 'text-warning bg-warning/10';
    case 'audio': return 'text-fire bg-fire/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const Resources = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
                         resource.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Recursos</h1>
          <p className="text-muted-foreground">
            Acesse todas as planilhas, guias e materiais do desafio
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar recursos..."
              className="pl-10 bg-surface border-border"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {resourceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                  selectedCategory === category.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-surface text-muted-foreground hover:bg-surface-hover"
                )}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource, index) => {
            const Icon = getTypeIcon(resource.type);
            
            return (
              <div
                key={resource.id}
                className="resource-card animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    getTypeColor(resource.type)
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-muted-foreground">
                        Dia {resource.day}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum recurso encontrado</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground">
            💡 Os downloads estarão disponíveis após conectar o backend com Supabase Storage
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
