'use client'

import { Sidebar } from "@/admin/Sidebar";
import { useJobStore } from "@/admin/store/useJobStore";
import { useState } from "react";

export default function AdminPage() {
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const { job, setJob, reorderSections, moveSection } = useJobStore();
    return (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Sidebar isVisible={viewMode === 'edit'} />

            <div className={viewMode === 'edit' ? 'lg:col-span-8' : 'lg:col-span-12'}>
                {viewMode === 'edit' ? (
                    <div className="space-y-6">
                        {job.sections.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ready to build? Start by adding a section from the sidebar.</p>
                            </div>
                        )}
                        {/* {job.sections.map((section, index) => (
                            <DynamicEditor
                                key={section.id}
                                section={section}
                                onMoveUp={() => moveSection(index, 'up')}
                                onMoveDown={() => moveSection(index, 'down')}
                                onDragStart={() => setDraggedSectionIndex(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                    if (draggedSectionIndex !== null) reorderSections(draggedSectionIndex, index);
                                    setDraggedSectionIndex(null);
                                }}
                            />
                        ))} */}
                    </div>
                ) : (
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 max-w-4xl mx-auto text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
                        <div className="bg-slate-900 p-16 text-center text-white dark:bg-black">
                            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter">{job.title}</h1>
                            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">{job.shortDescription}</p>
                        </div>
                        <div className="p-8 lg:p-12 space-y-8 bg-slate-50/30 dark:bg-slate-900/50">
                            {/* {job.sections.map(s => <PreviewSection key={s.id} section={s} />)} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}