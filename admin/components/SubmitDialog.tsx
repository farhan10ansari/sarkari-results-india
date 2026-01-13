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
import { CreateNewPage, UpdatePage } from "@/service/ApiService";
import { useRouter, useSearchParams } from "next/navigation";


export default function SubmitDialog() {
    const page = usePageStore((state) => state.page);
    const resetPage = usePageStore((state) => state.resetPage);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const pageId = useSearchParams().get("id");

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // submit logic 
            console.log("submitting")

            let res;
            if (pageId) {
                res = await UpdatePage(pageId, page);
                toast.success(res?.data.message)
                setIsOpen(false)
                // Do not reset page on update, so user can continue editing or see update.
            } else {
                res = await CreateNewPage(page);
                const slug = page.slug
                toast.success(res?.data.message)
                setIsOpen(false)
                setTimeout(() => {
                    resetPage()
                    router?.push(`/page/${slug}`)
                }, 1000)
            }


        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Something went wrong")
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditMode = !!pageId;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="cursor-pointer">
                    <Send size={14} className="mr-2" />
                    {isEditMode ? 'Update' : 'Submit'}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px] p-0">
                <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <DialogTitle className="font-black tracking-widest text-xs uppercase">
                        {isEditMode ? 'Confirm Update' : 'Confirm Submission'}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-2  text-sm text-slate-600 dark:text-slate-300">
                    {isEditMode
                        ? "Are you sure you want to update this page? Changes will be live immediately."
                        : "Are you sure you want to submit & publish this page? Please make sure you have checked all the details."
                    }
                </div>

                <DialogFooter className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                {isEditMode ? 'Updating...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <Send size={16} className="mr-2" />
                                {isEditMode ? 'Confirm Update' : 'Confirm Submit'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
