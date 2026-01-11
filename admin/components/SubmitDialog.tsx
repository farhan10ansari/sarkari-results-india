import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { usePageStore } from "@/admin/usePageStore";
import { CreateNewPage } from "@/service/ApiService";
import { useRouter } from "next/navigation";


export default function SubmitDialog() {
    const page = usePageStore((state) => state.page);
    const resetPage = usePageStore((state) => state.resetPage);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // submit logic 
            console.log("submitting")
            const res = await CreateNewPage(page);
            const slug = page.slug
            toast.success(res?.data.message)
            setIsOpen(false)
            setTimeout(() => {
                resetPage()
                router?.push(`/page/${slug}`)
            }, 1000)


        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Send size={14} className="mr-2" />
                    Submit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px] p-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <DialogTitle className="font-black tracking-widest text-xs uppercase">
                        Confirm Submission
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-2  text-sm text-slate-600 dark:text-slate-300">
                    Are you sure you want to submit & publish this page?
                    Please make sure you have checked all the details.
                </div>

                <DialogFooter className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Submitting
                            </>
                        ) : (
                            <>
                                <Send size={16} className="mr-2" />
                                Confirm Submit
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
