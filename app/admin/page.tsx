"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    PlusCircle,
    FileText,
    BarChart3,
    Clock,
    CheckCircle2,
    Search,
    ArrowRight,
    Loader2,
    Trash,
    Pencil,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { GetAllPages, UpdatePage, DeletePage, GetDashboardStats, PermanentDeletePage } from '@/service/ApiService';
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

const DashboardHome: React.FC = () => {
    const [pages, setPages] = useState<IPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        if (pages.length === 0) {
            setLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            // Fetch stats and top 5 pages in parallel
            const [statsRes, pagesRes] = await Promise.all([
                GetDashboardStats(),
                GetAllPages(1, 5)
            ]);

            if (statsRes.data.success && statsRes.data.data) {
                setStats(statsRes.data.data);
            }

            if (pagesRes.data.success && pagesRes.data.data) {
                setPages(pagesRes.data.data.pages);
            }
        } catch (e) {
            console.error("Failed to fetch data", e);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleStatusChange = async (id: string, newStatus: PageStatus) => {
        try {
            const res = await UpdatePage(id, { status: newStatus });
            if (res.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchData();
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
                fetchData();
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
                fetchData();
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
        <div className="max-w-7xl mx-5 xl:mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto px-1 pb-10">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Welcome back, Admin
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Manage your government job postings and notifications from one place.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Create New Card (Primary) */}
                <Link
                    href="/admin/page-editor"
                    className="group relative overflow-hidden bg-blue-600 rounded-3xl p-8 text-left shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all hover:-translate-y-1 cursor-pointer block"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PlusCircle size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <PlusCircle className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Create Job Post</h3>
                            <p className="text-blue-100 text-sm font-medium mb-6">
                                Start a new government job notification from scratch or use AI to extract data.
                            </p>
                            <span className="inline-flex items-center text-white font-bold text-sm bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                Start Editor <ArrowRight size={16} className="ml-2" />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Manage Posts Card */}
                <Link href="/admin/pages" className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer block">
                    <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-400 transition-colors">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Pages</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        View, edit, or delete existing job posts. Manage status and publication dates.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <span className="flex items-center"><CheckCircle2 size={14} className="mr-1 text-green-500" /> {stats.published} Published</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1 text-orange-500" /> {stats.drafts} Drafts</span>
                    </div>
                    <div className="mt-4 text-xs text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 inline-block">
                        Total {stats.total} Pages (Excluding Trash)
                    </div>
                </Link>

                {/* Analytics/Settings Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer">
                    <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-slate-600 dark:text-slate-300 group-hover:bg-purple-50 group-hover:text-purple-600 dark:group-hover:bg-purple-900/20 dark:group-hover:text-purple-400 transition-colors">
                        <BarChart3 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Check visitor stats, click-through rates, and engagement on your job posts.
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-500 h-full w-2/3"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Weekly Goal: 65%</p>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                        {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                    </div>
                    <Button variant="ghost" size="sm" asChild className='cursor-pointer'>
                        <Link href="/admin/pages">View All</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
                            <Loader2 className="animate-spin" /> Loading pages...
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>No pages found</p>
                        </div>
                    ) : (
                        <Table>
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
};

export default DashboardHome;