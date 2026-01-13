import { useState } from "react";
import { DynamicEditor } from "./DynamicEditor";
import { usePageStore } from "./usePageStore";

export default function EditMode() {
    const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
    const moveSection = usePageStore((state) => state.moveSection);
    const reorderSections = usePageStore((state) => state.reorderSections);
    const page = usePageStore((state) => state.page);

    return (
        <div className="space-y-6">
            {page.sections.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ready to build? Start by adding a section from the sidebar.</p>
                </div>
            )}
            {page.sections.map((section, index) => (
                <DynamicEditor
                    key={section._id}
                    section={section}
                    onMoveUp={() => moveSection(index, 'up')}
                    onMoveDown={() => moveSection(index, 'down')}
                    onDragStart={() => setDraggedSectionIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                        if (draggedSectionIndex !== null) reorderSections(draggedSectionIndex, index);
                        setDraggedSectionIndex(null);
                    }}
                    isFirst={index === 0}
                    isLast={index === page.sections.length - 1}
                />
            ))}
        </div>
    );
}