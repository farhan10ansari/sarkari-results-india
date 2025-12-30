import React from 'react';
import { CustomInput } from '@/admin/components/CustomInput';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';
import { useJobStore, ViewMode } from '@/admin/useJobStore';

interface SidebarProps {
  isVisible: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {

  const { job, updateMetadata, addSection, viewMode, setViewMode } = useJobStore();

  if (!isVisible) return null;

  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-xs font-black mb-4 uppercase text-slate-400 tracking-widest">Post Metadata</h2>
        <div className="space-y-4">
          <CustomInput
            label="Title"
            value={job.title}
            onChange={e => updateMetadata({ title: e.target.value })}
          />
          <CustomInput
            label="URL Slug"
            value={job.slug}
            onChange={e => updateMetadata({ slug: e.target.value })}
          />
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tighter dark:text-slate-400">Summary</label>
            <textarea
              className="w-full p-2 border border-slate-300 rounded text-sm min-h-[80px] text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={job.shortDescription}
              onChange={e => updateMetadata({ shortDescription: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-24 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <List size={14} /> Structure
          </h2>
          <Button onClick={addSection} size="sm" variant="outline" className="h-6 px-2 text-[9px] font-bold">
            + NEW SECTION
          </Button>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {job.sections.map((sec, idx) => (
            <div key={sec.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded border border-slate-200 group dark:bg-slate-800/50 dark:border-slate-700">
              <span className="truncate flex-1 font-semibold text-slate-600 italic dark:text-slate-300">
                {sec.title || 'Untitled'}
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-1 rounded ml-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                #{idx + 1}
              </span>
            </div>
          ))}
          {job.sections.length === 0 && (
            <div className="text-center py-6 border border-dashed rounded text-slate-400 text-[10px] font-bold uppercase tracking-widest dark:border-slate-800">
              No Content Sections
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};