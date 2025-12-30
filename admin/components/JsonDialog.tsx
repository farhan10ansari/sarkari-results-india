import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Copy, Download } from "lucide-react";
import { useJobStore } from "../useJobStore";
import { useState } from "react";
export default function JsonDialog() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [copied, setCopied] = useState(false);
    const job = useJobStore((state) => state.job);

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(job, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="sm:inline-flex"
                >
                    <Download size={14} className="sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <DialogTitle className="font-black tracking-widest text-xs uppercase">
                        Schema Output (JSON)
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 p-6 overflow-auto font-mono">
                    <pre className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                        {JSON.stringify(job, null, 2)}
                    </pre>
                </div>
                <DialogFooter className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </Button>
                    <Button onClick={handleCopyJson}>
                        {copied ? (
                            <>
                                <Check size={16} className="mr-2" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={16} className="mr-2" />
                                Copy JSON
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}