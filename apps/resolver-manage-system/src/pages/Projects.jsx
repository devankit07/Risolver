import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Calendar, Clock, MoreVertical, LayoutGrid, List as ListIcon } from 'lucide-react';
import api from '../services/api.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[#64748b]">Home &rsaquo; Projects</p>
          <h1 className="mt-1 text-[28px] font-medium text-[#1e293b]">Projects</h1>
          <p className="mt-1 text-[14px] text-[#64748b]">Manage and track your organization's projects.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-[8px] bg-[#4f46e5] px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-[10px] border border-[#e2e8f0] bg-white p-3 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[8px] border border-[#e2e8f0] py-2 pl-10 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[6px] ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-[#64748b]'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-[6px] ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-[#64748b]'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Project Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 animate-pulse rounded-[12px] bg-slate-100" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e2e8f0] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <LayoutGrid size={32} />
          </div>
          <h3 className="mt-4 text-[16px] font-semibold text-[#1e293b]">No projects found</h3>
          <p className="mt-1 text-[14px] text-[#64748b]">Get started by creating your first project.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-6 flex items-center gap-2 rounded-[8px] border border-[#e2e8f0] bg-white px-4 py-2 text-[13px] font-medium text-[#1e293b] hover:bg-slate-50"
          >
            <Plus size={16} />
            Create Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              <tr>
                <th className="px-6 py-3">Project Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredProjects.map(project => (
                <ProjectRow key={project._id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onSuccess={fetchProjects} />}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="group relative rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-indigo-50 text-indigo-600">
          <LayoutGrid size={20} />
        </div>
        <button className="text-[#94a3b8] hover:text-[#64748b]">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-[16px] font-semibold text-[#1e293b]">{project.name}</h3>
        <p className="mt-1 text-[13px] text-[#64748b] line-clamp-2 min-h-[40px]">
          {project.description || 'No description provided.'}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
        <div className="flex items-center gap-4 text-[12px] text-[#64748b]">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}</span>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
          project.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
        }`}>
          {project.status}
        </span>
      </div>
    </div>
  );
}

function ProjectRow({ project }) {
  return (
    <tr className="hover:bg-[#f8fafc]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-indigo-50 text-indigo-600">
            <LayoutGrid size={16} />
          </div>
          <span className="text-[14px] font-medium text-[#1e293b]">{project.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
          project.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
        }`}>
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col text-[12px] text-[#64748b]">
          <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}</span>
          <span>End: {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[#94a3b8] hover:text-[#64748b]">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  );
}

function CreateProjectModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/projects', form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-[12px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1e293b]">New Project</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b]">
            <Plus size={18} className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Project Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Resolver System"
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Project goals and scope..."
              rows={3}
              className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({...form, deadline: e.target.value})}
                className="w-full rounded-[8px] border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          {error && <p className="text-[12px] text-red-600">{error}</p>}
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[#e2e8f0] px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[8px] bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
