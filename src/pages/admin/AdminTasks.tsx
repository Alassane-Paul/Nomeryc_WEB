import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Calendar, Search, Trash2, Loader2, X } from 'lucide-react';
import { tasksService, Task, TaskStatus, TaskPriority, TaskInput } from '../../services/tasks.service';
import { onSocketEvent, connectSocket } from '../../services/socket.service';

const priorityStyle: Record<TaskPriority, string> = {
  haute: 'text-red-400',
  moyenne: 'text-yellow-400',
  basse: 'text-brand-green',
};

const priorityLabel: Record<TaskPriority, string> = { haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' };

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'À faire', color: 'border-gray-500' },
  { key: 'in_progress', label: 'En cours', color: 'border-brand-purple' },
  { key: 'done', label: 'Terminé', color: 'border-brand-green' },
];

const emptyForm: TaskInput = { title: '', description: '', priority: 'moyenne', status: 'todo' };

export function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setTasks(await tasksService.list());
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    connectSocket();
    const off = onSocketEvent('notification:new', () => load()); // rafraîchit si une tâche nous est assignée
    return off;
  }, [load]);

  const cycleStatus = async (task: Task) => {
    const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    try {
      await tasksService.update(task.id, { status: next });
    } catch {
      load(); // resynchronise en cas d'échec
    }
  };

  const remove = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await tasksService.remove(id);
    } catch {
      load();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const created = await tasksService.create(form);
      setTasks((prev) => [created, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      // le formulaire reste ouvert pour réessayer
    } finally {
      setSaving(false);
    }
  };

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.project?.title || '').toLowerCase().includes(search.toLowerCase())
  );
  const byStatus = (status: TaskStatus) => filtered.filter((t) => t.status === status);
  const done = tasks.filter((t) => t.status === 'done').length;

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white leading-snug">{task.title}</p>
        <button onClick={() => remove(task.id)} className="text-gray-500 hover:text-red-400 shrink-0">
          <Trash2 size={14} />
        </button>
      </div>
      {task.project && <p className="text-xs text-gray-500">{task.project.title}</p>}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${priorityStyle[task.priority]}`}>{priorityLabel[task.priority]}</span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-gray-500">
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
      <button
        onClick={() => cycleStatus(task)}
        className="w-full text-xs py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-brand-purple/40 transition-colors"
      >
        {task.status === 'todo' ? 'Démarrer →' : task.status === 'in_progress' ? 'Marquer terminée →' : 'Rouvrir →'}
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Tâches</h1>
          <p className="text-gray-400 text-sm mt-1">{done}/{tasks.length} tâches complétées</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface rounded-xl p-1 border border-surface-border">
            {(['kanban', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  view === v ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {v === 'list' ? 'Liste' : 'Kanban'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="btn-success btn-sm flex items-center gap-2">
            <Plus size={15} />
            Nouvelle tâche
          </button>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      ) : view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.key}>
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                <h3 className="text-sm font-bold text-white">{col.label}</h3>
                <span className="text-xs text-gray-500">{byStatus(col.key).length}</span>
              </div>
              <div className="space-y-3">
                {byStatus(col.key).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {byStatus(col.key).length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-6">Aucune tâche</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Aucune tâche trouvée</p>
          ) : (
            filtered.map((task) => (
              <div key={task.id} className="card p-4 flex items-center gap-4">
                <button
                  onClick={() => cycleStatus(task)}
                  className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                    task.status === 'done' ? 'bg-brand-green border-brand-green' : 'border-gray-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </p>
                  {task.project && <p className="text-xs text-gray-500">{task.project.title}</p>}
                </div>
                <span className={`text-xs font-semibold ${priorityStyle[task.priority]}`}>{priorityLabel[task.priority]}</span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                )}
                <button onClick={() => remove(task.id)} className="text-gray-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal création */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Nouvelle tâche</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="input-group">
                <label className="input-label">Titre</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Priorité</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                    className="input"
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Échéance</label>
                  <input
                    type="date"
                    value={form.dueDate || ''}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className="input"
                  />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? 'Création...' : 'Créer la tâche'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
