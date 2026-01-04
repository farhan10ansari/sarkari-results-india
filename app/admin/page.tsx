import React from 'react';
import { Button } from '@/components/ui/button';
import {
    PlusCircle,
    FileText,
    Settings,
    BarChart3,
    Clock,
    CheckCircle2,
    Search,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';


const DashboardHome: React.FC = () => {
    return (
        <div className="max-w-6xl  mx-5 xl:mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto px-1">
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
                    href="/admin/create-page"
                    className="group relative overflow-hidden bg-blue-600 rounded-3xl p-8 text-left shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all hover:-translate-y-1"
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
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group cursor-pointer">
                    <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-400 transition-colors">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Posts</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        View, edit, or delete existing job posts. Manage status and publication dates.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <span className="flex items-center"><CheckCircle2 size={14} className="mr-1 text-green-500" /> 12 Active</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1 text-orange-500" /> 3 Drafts</span>
                    </div>
                </div>

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
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                            <tr>
                                <th className="px-8 py-4 font-bold">Job Title</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-8 py-4 font-medium text-slate-900 dark:text-slate-200">
                                        SSC CGL Recruitment 2024
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Published
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        Oct 24, 2024
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;