import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Plus, Search, Trash2, Edit2, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { blogService, BlogPost, BlogPostStatus } from '../../services/blog.service';

const emptyForm = { title: '', category: 'Ingénierie Web', excerpt: '', content: '', coverImage: '' };

const statusMap: Record<BlogPostStatus, { label: string; className: string }> = {
  publie: { label: 'Publié', className: 'bg-brand-green/10 text-brand-green border-brand-green/20' },
  brouillon: { label: 'Brouillon', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  planifie: { label: 'Planifié', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllAdmin();
      setPosts(data || []);
    } catch {
      // Liste vide affichée ; l'admin peut réessayer.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({ title: post.title, category: post.category, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage || '' });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const status: BlogPostStatus = publish ? 'publie' : 'brouillon';
      if (editingId) {
        const updated = await blogService.update(editingId, { ...form, status });
        setPosts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await blogService.create({ ...form, status });
        setPosts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError("L'enregistrement a échoué. Vérifiez votre connexion et réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const nextStatus: BlogPostStatus = post.status === 'publie' ? 'brouillon' : 'publie';
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p)));
    try {
      await blogService.update(post.id, { status: nextStatus });
    } catch {
      load(); // resynchronise en cas d'échec
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    const previous = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await blogService.delete(id);
    } catch {
      setPosts(previous); // échec réel : on restaure la liste
    }
  };

  const filtered = posts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Articles de Blog</h1>
          <p className="text-gray-400 text-sm mt-1">Rédigez, publiez et modifiez les contenus éditoriaux de Nomeryc.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel Article
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      <div className="card-glass border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-brand-card/80 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Titre de l'article</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">Aucun article pour l'instant.</td></tr>
              ) : (
                filtered.map((post) => {
                  const st = statusMap[post.status] || statusMap.brouillon;
                  return (
                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{post.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">{post.category}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${st.className}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStatus(post)}
                            className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                            title={post.status === 'publie' ? 'Dépublier' : 'Publier'}
                          >
                            {post.status === 'publie' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-purple-light" />
                {editingId ? "Modifier l'article" : 'Rédiger un nouvel article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{error}</div>}

            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Titre de l'article</label>
                <input
                  type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Les tendances UI/UX incontournables en 2026"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Catégorie</label>
                  <select
                    value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Ingénierie Web" className="bg-brand-card">Ingénierie Web</option>
                    <option value="Design & UI/UX" className="bg-brand-card">Design & UI/UX</option>
                    <option value="SEO & Performance" className="bg-brand-card">SEO & Performance</option>
                    <option value="Stratégie" className="bg-brand-card">Stratégie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Image de couverture</label>
                  <input
                    type="url" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Extrait d'accroche (Excerpt)</label>
                <input
                  type="text" required value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Résumé percutant de l'article en 1 ou 2 phrases..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Corps de l'article (Markdown / Texte)</label>
                <textarea
                  required rows={6} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Rédigez le contenu complet de l'article ici..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white">
                  Annuler
                </button>
                <button
                  type="button" disabled={saving}
                  onClick={(e) => handleSubmit(e, false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:text-white"
                >
                  Enregistrer en brouillon
                </button>
                <button type="submit" disabled={saving} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
