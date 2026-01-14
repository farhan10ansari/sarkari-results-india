"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    Trash,
    Pencil,
    FileText,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { GetAllPages, UpdatePage, DeletePage, PermanentDeletePage } from '@/service/ApiService';
import { IPage, PageStatus } from '@/lib/page.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function AllPages() {
    const [pages, setPages] = useState<IPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 15;

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPages = async () => {
        // If we have no pages, this is likely the first load, so show full loader
        if (pages.length === 0) {
            setLoading(true);
        } else {
            // Otherwise, we are refreshing data, show refresh indicator
            setIsRefreshing(true);
        }

        try {
            const res = await GetAllPages(page, LIMIT);
            if (res.data.success && res.data.data) {
                setPages(res.data.data.pages);
                setTotalPages(res.data.data.pagination.totalPages);
            }
        } catch (e) {
            console.error("Failed to fetch pages", e);
            toast.error("Failed to load pages");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [page]);

    const handlePrevious = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const handleStatusChange = async (id: string, newStatus: PageStatus) => {
        try {
            const res = await UpdatePage(id, { status: newStatus });
            if (res.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchPages();
            } else {
                toast.error(res.data.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred while updating status");
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await DeletePage(deleteId);
            if (res.data.success) {
                toast.success("Page moved to trash");
                fetchPages();
            } else {
                toast.error(res.data.message || "Failed to delete page");
            }
        } catch (error) {
            toast.error("An error occurred while deleting page");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const exportPageAsJson = (page: IPage) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(page, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${page.slug || 'page'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    const handlePermanentDelete = async () => {
        if (!deleteId) return;
        const pageToDelete = pages.find(p => p._id === deleteId);
        if (pageToDelete) {
            exportPageAsJson(pageToDelete);
        }

        setIsDeleting(true);
        try {
            const res = await PermanentDeletePage(deleteId);
            if (res.data.success) {
                toast.success("Page permanently deleted");
                fetchPages();
            } else {
                toast.error(res.data.message || "Failed to delete page");
            }
        } catch (error) {
            toast.error("An error occurred while deleting page");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="w-full max-w-[95%] xl:max-w-[1800px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto px-4 lg:px-10 py-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        All Pages
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Manage all your pages types, status and content.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Page List</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                    </div>

                    <Button variant="ghost" size="sm" onClick={fetchPages} disabled={loading || isRefreshing}>
                        {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Refresh
                    </Button>
                </div>

                <div className="overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
                            <Loader2 className="animate-spin" /> Loading pages...
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>No pages found</p>
                        </div>
                    ) : (
                        <Table className="min-w-[1000px]">
                            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                <TableRow>
                                    <TableHead className="px-8 py-4 font-bold text-slate-500 uppercase text-xs">Job Title</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Category</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Type</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Created</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs">Updated</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-slate-500 uppercase text-xs text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((pageItem) => (
                                    <TableRow key={pageItem._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50">
                                        <TableCell className="px-8 py-4 font-medium text-slate-900 dark:text-slate-200">
                                            {pageItem.title}
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">{pageItem.slug}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                            {pageItem.category || '-'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs capitalize">
                                            {pageItem.type ? pageItem.type.replace(/_/g, ' ') : '-'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity select-none
                                                        ${pageItem.status === PageStatus.PUBLISHED ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                pageItem.status === PageStatus.DRAFT ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                    pageItem.status === PageStatus.TRASHED ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}
                                                    >
                                                        {pageItem.status}
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="bg-white dark:bg-slate-950">
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleStatusChange(pageItem._id, PageStatus.PUBLISHED)} className="cursor-pointer">
                                                        Published
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(pageItem._id, PageStatus.DRAFT)} className="cursor-pointer">
                                                        Draft
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(pageItem._id, PageStatus.ARCHIVED)} className="cursor-pointer">
                                                        Archived
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(pageItem._id, PageStatus.TRASHED)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer">
                                                        Trash
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                            {pageItem.createdAt ? (
                                                <>
                                                    <div>{format(new Date(pageItem.createdAt), 'MMM dd, yyyy')}</div>
                                                    <div className="text-[10px] text-slate-400">{format(new Date(pageItem.createdAt), 'hh:mm a')}</div>
                                                </>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                            {pageItem.updatedAt ? (
                                                <>
                                                    <div>{format(new Date(pageItem.updatedAt), 'MMM dd, yyyy')}</div>
                                                    <div className="text-[10px] text-slate-400">{format(new Date(pageItem.updatedAt), 'hh:mm a')}</div>
                                                </>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-green-600 cursor-pointer" asChild>
                                                    <Link href={`/page/${pageItem.slug || ''}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 cursor-pointer" asChild>
                                                    <Link href={`/admin/page-editor?id=${pageItem._id || ''}`}><Pencil className="h-4 w-4" /></Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:text-red-600 cursor-pointer"
                                                    onClick={() => pageItem._id && handleDeleteClick(pageItem._id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="px-8 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-xs text-slate-500 font-medium">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={page <= 1 || loading || isRefreshing}
                            className="bg-white dark:bg-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNext}
                            disabled={page >= totalPages || loading || isRefreshing}
                            className="bg-white dark:bg-slate-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Move to Trash"
                description="Are you sure you want to move this page to trash? You can restore it later. Or verify and permanently delete (data will be exported)."
                confirmLabel="Move to Trash"
                variant="destructive"
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                extraActions={
                    <Button
                        variant="destructive"
                        onClick={handlePermanentDelete}
                        disabled={isDeleting}
                        className="bg-red-700 hover:bg-red-800"
                    >
                        Permanent Delete & Export
                    </Button>
                }
            />
        </div>
    );
}
