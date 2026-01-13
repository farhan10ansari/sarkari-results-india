import { PreviewSection } from "./PreviewSection";
import { Calendar } from "lucide-react";
import { IPageWithoutId } from "@/lib/page.types";

type Props = {
    page: IPageWithoutId;
};

export default function PreviewMode({ page }: Props) {
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="bg-slate-800 dark:bg-slate-900 rounded-3xl p-10 text-white mb-10">
                <span className="inline-block mb-4 text-xs uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">
                    {page.category}
                </span>

                <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
                    {page.title}
                </h1>

                <p className="text-slate-300 max-w-3xl">
                    {page.description}
                </p>

                {/* Important Dates */}
                {page.importantDates && (
                    <div className="mt-8">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {page.importantDates.startDateOfApplication && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
                                            Application Start
                                        </p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">
                                            {new Date(page.importantDates.startDateOfApplication).toDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {page.importantDates.lastDateOfApplication && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-300">
                                            Last Date to Apply
                                        </p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">
                                            {new Date(page.importantDates.lastDateOfApplication).toDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {page.sections.map(section => (
                    <PreviewSection key={section._id} section={section} />
                ))}
            </div>
        </div>
    );
}
