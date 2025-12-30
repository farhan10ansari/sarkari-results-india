'use client'

import AiDialog from "@/admin/components/AiDialog";
import JsonDialog from "@/admin/components/JsonDialog";
import EditMode from "@/admin/EditMode";
import PreviewMode from "@/admin/PreviewMode";
import { Sidebar } from "@/admin/Sidebar";
import { useJobStore, ViewMode } from "@/admin/useJobStore";
import { Eye, PenLine } from "lucide-react";

export default function AdminPage() {
    const viewMode = useJobStore((state) => state.viewMode);
    const setViewMode = useJobStore((state) => state.setViewMode);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Sidebar isVisible={viewMode === 'edit'} />
                <div className={viewMode === 'edit' ? 'lg:col-span-8' : 'lg:col-span-12'}>
                    <div className="ml-auto mr-auto">
                        <div className="flex justify-between mb-8 max-w-4xl ml-auto mr-auto">
                            <div className="bg-slate-200 p-1 rounded-xl inline-flex dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                                <button
                                    onClick={() => setViewMode(ViewMode.EDIT)}
                                    className={`flex items-center px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === 'edit'
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-blue-400 dark:ring-slate-600'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <PenLine size={16} className="mr-2" />
                                    Editor
                                </button>
                                <button
                                    onClick={() => setViewMode(ViewMode.PREVIEW)}
                                    className={`flex items-center px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === 'preview'
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-blue-400 dark:ring-slate-600'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <Eye size={16} className="mr-2" />
                                    Preview
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <AiDialog />
                                <JsonDialog />
                            </div>
                        </div>
                    </div>
                    {viewMode === 'edit' ? (
                        <EditMode />
                    ) : (
                        <PreviewMode />
                    )}
                </div>
            </div>


        </div>
    );
}
