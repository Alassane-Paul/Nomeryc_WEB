import React, { useEffect, useState, useCallback } from 'react';
import { File, Download, Search, FileText, Image as ImageIcon, Archive, ExternalLink, Loader2 } from 'lucide-react';
import { documentsService, AppDocument, DocumentCategory } from '../../services/documents.service';

function guessIcon(mimeType?: string): { icon: React.ElementType; color: string; bg: string } {
  if (!mimeType) return { icon: File, color: 'text-brand-purple-light', bg: 'bg-brand-purple/10' };
  if (mimeType.startsWith('image/')) return { icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' };
  if (mimeType === 'application/pdf') return { icon: FileText, color: 'text-red-400', bg: 'bg-red-400/10' };
  if (mimeType.includes('zip')) return { icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  return { icon: File, color: 'text-brand-purple-light', bg: 'bg-brand-purple/10' };
}

const categories: { key: DocumentCategory | 'tous'; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'contrat', label: 'Contrat' },
  { key: 'facture', label: 'Facture' },
  { key: 'maquette', label: 'Maquette' },
  { key: 'livrable', label: 'Livrable' },
  { key: 'autre', label: 'Autre' },
];

const categoryBadge: Record<string, string> = {
  contrat: 'badge-purple',
  facture: 'badge-green',
  maquette: 'badge-yellow',
  livrable: 'badge-gray',
  autre: 'badge-gray',
};

export function ClientDocuments() {
  const [docs, setDocs] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategory | 'tous'>('tous');

  const load = useCallback(async () => {
    try {
      setDocs(await documentsService.list());
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) || (d.project?.title || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'tous' || d.category === category;
    return matchSearch && matchCat;
  });

  const projectCount = new Set(docs.map((d) => d.projectId).filter(Boolean)).size;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Documents</h1>
        <p className="text-gray-400 text-sm mt-1">Accédez à tous vos documents partagés par l'équipe Nomeryc</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.key
                  ? 'bg-brand-purple text-white shadow-brand'
                  : 'bg-surface text-gray-400 border border-surface-border hover:text-white hover:border-brand-purple/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total documents', value: docs.length },
          { label: 'Projets concernés', value: projectCount },
          { label: 'Résultats filtrés', value: filtered.length },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Projet</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Taille</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">Aucun document trouvé</td>
                </tr>
              ) : (
                filtered.map((doc) => {
                  const { icon: Icon, color, bg } = guessIcon(doc.mimeType);
                  return (
                    <tr key={doc.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={16} className={color} />
                          </div>
                          <span className="font-medium text-white text-sm truncate max-w-[200px]">{doc.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-400 text-sm">{doc.project?.title || '—'}</td>
                      <td><span className={`badge ${categoryBadge[doc.category]}`}>{doc.category}</span></td>
                      <td className="text-gray-400 text-sm">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="text-gray-400 text-sm">{doc.size || '—'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <a href={doc.url} download={doc.name} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/10 transition-all" title="Télécharger">
                            <Download size={15} />
                          </a>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-brand-purple-light hover:bg-brand-purple/10 transition-all" title="Ouvrir">
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
