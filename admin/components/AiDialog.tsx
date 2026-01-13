import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { parsePageDescriptionWithAI } from "../services/geminiService";
import { usePageStore } from "../usePageStore";
export default function AiDialog() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const page = usePageStore(state => state.page)
    const setPage = usePageStore((state) => state.setPage);

    const [aiInput, setAiInput] = useState('');
    const [loading, setLoading] = useState(false);



    const handleAiFill = async () => {
        if (!aiInput.trim()) return;
        setLoading(true);
        try {
            const data = await parsePageDescriptionWithAI(aiInput);
            setPage({ ...data, updatedAt: new Date().toISOString() } as any);
            setIsModalOpen(false)
        } catch (e) { alert("Failed to extract data."); }
        setLoading(false);
    };
    return (

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="sm:w-auto sm:px-3 text-purple-600"
                >
                    <Wand2 size={14} className="sm:mr-2" />
                    <span className="hidden sm:inline">AI Fill</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">
                        AI Intelligent Fill
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Paste the raw notification text. Our AI will structure it instantly.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <textarea
                        className="w-full h-48 border border-slate-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Paste content from the PDF or website here..."
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(false)}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAiFill}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        {loading ? 'Structuring...' : 'Generate Post'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}