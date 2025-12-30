import { useState } from "react";
import { DynamicEditor } from "./DynamicEditor";
import { useJobStore } from "./useJobStore";

export default function EditMode() {
    const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
    const moveSection = useJobStore((state) => state.moveSection);
    const reorderSections = useJobStore((state) => state.reorderSections);
    const job = useJobStore((state) => state.job);

    return (
        <div className="space-y-6">
            {job.sections.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ready to build? Start by adding a section from the sidebar.</p>
                </div>
            )}
            {job.sections.map((section, index) => (
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
            ))}
        </div>
    );
}