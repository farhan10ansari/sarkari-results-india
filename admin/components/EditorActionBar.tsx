import { Eye, PenLine } from "lucide-react";
import { usePageStore, ViewMode } from "@/admin/usePageStore";
import AiDialog from "@/admin/components/AiDialog";
import JsonDialog from "@/admin/components/JsonDialog";
import SubmitDialog from "@/admin/components/SubmitDialog";
import { cn } from "@/lib/utils";

/**
 * EditorActionBar - Action buttons for the page editor
 * 
 * Contains:
 * - Edit/Preview mode switcher
 * - AI Fill button
 * - JSON editor button
 * - Submit/Update button
 */
export function EditorActionBar({ className }: { className?: string }) {
    const viewMode = usePageStore((state) => state.viewMode);
    const setViewMode = usePageStore((state) => state.setViewMode);

    return (
        <div className={cn("flex justify-between items-center gap-4 mb-6", className)}>
            <div className="bg-slate-200 p-1 rounded-xl inline-flex dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                <button
                    onClick={() => setViewMode(ViewMode.EDIT)}
                    className={`flex items-center px-3 sm:px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === 'edit'
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-blue-400 dark:ring-slate-600'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    <PenLine size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Editor</span>
                </button>
                <button
                    onClick={() => setViewMode(ViewMode.PREVIEW)}
                    className={`flex items-center px-3 sm:px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-blue-400 dark:ring-slate-600'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    <Eye size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Preview</span>
                </button>
            </div>
            <div className="flex items-center gap-2">
                <AiDialog />
                <JsonDialog />
                <SubmitDialog />
            </div>
        </div>
    );
}
