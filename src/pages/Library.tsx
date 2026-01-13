import { Layout } from '@/components/layout/Layout';
import { LibraryPanel } from '@/components/library/LibraryPanel';

const Library = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Biblioteca</h1>
          <p className="text-muted-foreground">
            Scripts, checklist anti-golpe, cortes e recursos extras do dia.
          </p>
        </div>
        <div className="glass-card p-6">
          <LibraryPanel />
        </div>
      </div>
    </Layout>
  );
};

export default Library;
