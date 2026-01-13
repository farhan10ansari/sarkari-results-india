"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

type Props = {
    category?: string;
    title: string;
    description: string;
    importantDates?: {
        startDateOfApplication?: string;
        lastDateOfApplication?: string;
    };
};

/**
 * PreviewHeader Component
 * 
 * Displays the page header with category, title, description, and important dates.
 * The description is truncated to 4 lines on smaller screens and 10 lines on larger screens,
 * with a "Show more" button to expand/collapse the full description.
 */
export default function PreviewHeader({ category, title, description, importantDates }: Props) {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <div className="bg-slate-800 dark:bg-slate-900 rounded-3xl p-6 md:p-10 text-white mb-4 lg:mb-8">
            {category && (
                <span className="inline-block mb-4 text-xs uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">
                    {category}
                </span>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
                {title}
            </h1>

            <div className="relative">
                <div 
                    className={`w-full overflow-hidden ${
                        !isDescriptionExpanded 
                            ? "line-clamp-4 lg:line-clamp-8" 
                            : ""
                    }`}
                >
                    <MarkdownRenderer
                        content={description}
                        size="sm"
                        textColor="text-slate-300"
                        headingColor="text-white"
                        className="[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ol]:mb-2 [&_h1]:mb-2 [&_h2]:mb-2 [&_h3]:mb-2 [&_h4]:mb-2 [&_h5]:mb-2 [&_h6]:mb-2"
                    />
                </div>
                <div className="mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-slate-300 hover:text-white hover:bg-slate-700 px-0 cursor-pointer"
                    >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                    </Button>
                </div>
            </div>

            {/* Important Dates */}
            {importantDates && (
                <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {importantDates.startDateOfApplication && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
                                        Application Start
                                    </p>
                                    <p className="text-md sm:text-lg font-black text-slate-900 dark:text-white">
                                        {new Date(importantDates.startDateOfApplication).toDateString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {importantDates.lastDateOfApplication && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-300">
                                        Last Date to Apply
                                    </p>
                                    <p className="text-md sm:text-lg font-black text-slate-900 dark:text-white">
                                        {new Date(importantDates.lastDateOfApplication).toDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
