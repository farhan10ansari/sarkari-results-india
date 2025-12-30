import { PreviewSection } from "./PreviewSection";
import { useJobStore } from "./useJobStore";

export default function PreviewMode() {
    const job = useJobStore((state) => state.job);
    return (
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 max-w-4xl mx-auto text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
            <div className="bg-slate-900 p-16 text-center text-white dark:bg-black">

                <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter">{job.title}</h1>
                <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">{job.shortDescription}</p>
            </div>
            <div className="p-8 lg:p-12 space-y-8 bg-slate-50/30 dark:bg-slate-900/50">
                {job.sections.map(s => <PreviewSection key={s.id} section={s} />)}
            </div>
        </div>
    );
}