'use client'

import React, { useEffect, Suspense } from 'react';
import EditMode from "@/admin/EditMode";
import PreviewMode from "@/admin/PreviewMode";
import { Sidebar } from "@/admin/Sidebar";
import { usePageStore, ViewMode } from "@/admin/usePageStore";
import { useSearchParams } from 'next/navigation';
import { GetPageById } from '@/service/ApiService';
import { toast } from 'sonner';
import { EditorActionBar } from '@/admin/components/EditorActionBar';

function AdminPageContent() {
    const viewMode = usePageStore((state) => state.viewMode);
    const page = usePageStore((state) => state.page);
    const setPage = usePageStore((state) => state.setPage);
    const resetPage = usePageStore((state) => state.resetPage);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            const fetchPage = async () => {
                try {
                    const res = await GetPageById(id);
                    if (res.data.success && res.data.data) {
                        setPage(res.data.data);
                    } else {
                        toast.error("Failed to fetch page");
                    }
                } catch (e) {
                    console.error(e);
                    toast.error("Error loading page");
                }
            };
            fetchPage();
        } else {
            resetPage();
        }
    }, [id, setPage, resetPage]);

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Sidebar isVisible={viewMode === ViewMode.EDIT} />
                <div className={viewMode === ViewMode.EDIT ? 'lg:col-span-8' : 'lg:col-span-12'}>
                    <div className="w-full">
                        {
                            viewMode === ViewMode.EDIT ? (
                                <EditorActionBar className='hidden lg:flex' />
                            ) : (
                                <EditorActionBar />
                            )
                        }
                    </div>
                    {viewMode === ViewMode.EDIT ? (
                        <EditMode />
                    ) : (
                        <PreviewMode page={page} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <AdminPageContent />
        </Suspense>
    );
}