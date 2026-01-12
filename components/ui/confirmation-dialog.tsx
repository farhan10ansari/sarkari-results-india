"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    loading?: boolean;
    extraActions?: React.ReactNode;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title = "Confirm Action",
    description = "Are you sure you want to proceed? This action cannot be undone.",
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    onConfirm,
    variant = "default",
    loading = false,
    extraActions,
}: ConfirmationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : confirmLabel}
                    </Button>
                    {extraActions}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
