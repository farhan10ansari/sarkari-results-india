import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Check,
    Copy,
    Download,
    Upload,
    Pencil,
    Eye,
    FileJson,
    AlertTriangle,
} from "lucide-react";
import { usePageStore } from "../usePageStore";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IPage } from "@/lib/page.types";

export default function JsonDialog() {
    const page = usePageStore((s) => s.page);
    const setPage = usePageStore((s) => s.setPage);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [jsonText, setJsonText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------- Sync page → dialog ---------- */
    useEffect(() => {
        if (open) {
            setJsonText(JSON.stringify(page, null, 2));
            setMode("view");
            setError(null);
        }
    }, [open, page]);

    /* ---------- Derived state ---------- */

    const originalJson = useMemo(
        () => JSON.stringify(page, null, 2),
        [page]
    );

    const isModified = jsonText !== originalJson;

    const isValidJson = useMemo(() => {
        try {
            const parsed = JSON.parse(jsonText);
            const validationError = validatePageSchema(parsed);
            if (validationError) {
                setError(validationError);
                return false;
            }
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    }, [jsonText]);

    /* ---------- Actions ---------- */

    const exportJsonFile = () => {
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${page.slug || "page-schema"}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleApply = () => {
        try {
            const parsed = JSON.parse(jsonText) as IPage;
            setPage(parsed);
            setOpen(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleImportFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string);
                setJsonText(JSON.stringify(parsed, null, 2));
                setMode("edit");
                setError(null);
            } catch {
                setError("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    /* ---------- UI ---------- */

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="icon-sm" className="sm:w-auto sm:px-3">
                        <FileJson className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">JSON</span>
                    </Button>
                </DialogTrigger>

                <DialogContent className="w-full min-w-[80vw] xl:min-w-[60vw] h-[90vh] p-0 flex flex-col gap-0 overflow-hidden">
                    {/* Header / Toolbar */}
                    <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-900">
                        <DialogTitle className="text-sm uppercase tracking-widest font-black">
                            Page JSON Editor
                        </DialogTitle>

                        <div className="flex gap-2 mr-8">
                            <Button
                                size="sm"
                                variant={mode === "view" ? "default" : "outline"}
                                onClick={() => setMode("view")}
                                className="cursor-pointer"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>

                            <Button
                                size="sm"
                                variant={mode === "edit" ? "default" : "outline"}
                                onClick={() => setMode("edit")}
                                className="cursor-pointer"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Editor */}
                    <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900">
                        {mode === "view" ? (
                            <pre className="h-full overflow-auto p-6 font-mono text-sm text-slate-800 dark:text-slate-200 whitespace-pre">
                                {jsonText}
                            </pre>
                        ) : (
                            <textarea
                                value={jsonText}
                                onChange={(e) => setJsonText(e.target.value)}
                                spellCheck={false}
                                className="h-full w-full resize-none overflow-auto bg-transparent p-6 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                            />
                        )}
                    </div>

                    {/* Error */}
                    {error && !isValidJson && (
                        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-4 border-t flex justify-between bg-slate-50 dark:bg-slate-900">
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={exportJsonFile} className="cursor-pointer">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Import
                            </Button>

                            <Button size="sm" variant="outline" onClick={handleCopy} className="cursor-pointer">
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            disabled={!isModified || !isValidJson}
                            onClick={handleApply}
                            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-40 cursor-pointer"
                        >
                            Apply JSON
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImportFile(file);
                }}
            />
        </>
    );
}

// --- Validation Helpers ---

function hasUnknownKeys(obj: any, allowedKeys: string[], path: string): string | null {
    if (typeof obj !== 'object' || obj === null) return null; // Let other checks handle non-objects if needed
    const objKeys = Object.keys(obj);
    const allowedSet = new Set(allowedKeys);
    for (const key of objKeys) {
        if (!allowedSet.has(key)) {
            return `Error at ${path}: Unknown key "${key}"`;
        }
    }
    return null;
}

function validateField(field: any, path: string): string | null {
    if (typeof field !== 'object' || field === null) return `Error at ${path}: Must be an object`;
    if (!field.type) return `Error at ${path}: Missing "type" field`;

    const commonKeys = ["_id", "type"];
    let specificKeys: string[] = [];

    switch (field.type) {
        case "KEY_VALUE":
            specificKeys = ["key", "value"];
            break;
        case "TABLE":
            specificKeys = ["tableData"];
            if (field.tableData) {
                const tdErr = hasUnknownKeys(field.tableData, ["columns", "rows"], `${path}.tableData`);
                if (tdErr) return tdErr;
            }
            break;
        case "MARKDOWN":
            specificKeys = ["value"];
            break;
        case "LINK":
            specificKeys = ["key", "value"];
            break;
        case "DATE":
            specificKeys = ["key", "value"];
            break;
        case "SUB_SECTION":
            specificKeys = ["title", "children"];
            if (Array.isArray(field.children)) {
                for (let i = 0; i < field.children.length; i++) {
                    const child = field.children[i];
                    if (child.type === "SUB_SECTION") {
                        return `Error at ${path}.children[${i}]: Nested Sub-Sections are not allowed`;
                    }
                    const err = validateField(child, `${path}.children[${i}]`);
                    if (err) return err;
                }
            }
            break;
        default:
            return `Error at ${path}: Unknown Field Type "${field.type}"`;
    }

    return hasUnknownKeys(field, [...commonKeys, ...specificKeys], path);
}

function validateSection(section: any, path: string): string | null {
    if (typeof section !== 'object' || section === null) return `Error at ${path}: Must be an object`;
    const allowed = ["_id", "title", "type", "children"];
    const keyErr = hasUnknownKeys(section, allowed, path);
    if (keyErr) return keyErr;

    if (Array.isArray(section.children)) {
        for (let i = 0; i < section.children.length; i++) {
            const err = validateField(section.children[i], `${path}.children[${i}]`);
            if (err) return err;
        }
    }
    return null;
}

function validatePageSchema(page: any): string | null {
    if (typeof page !== 'object' || page === null) return "Root must be an object";

    const allowed = [
        "schemaVersion", "_id", "title", "slug", "description",
        "publishedAt", "updatedAt", "type", "status",
        "displayConfig", "metadata", "category", "importantDates", "sections"
    ];

    const keyErr = hasUnknownKeys(page, allowed, "Page");
    if (keyErr) return keyErr;

    if (page.importantDates) {
        const idErr = hasUnknownKeys(page.importantDates, ["startDateOfApplication", "lastDateOfApplication"], "Page.importantDates");
        if (idErr) return idErr;
    }

    if (Array.isArray(page.sections)) {
        for (let i = 0; i < page.sections.length; i++) {
            const err = validateSection(page.sections[i], `Page.sections[${i}]`);
            if (err) return err;
        }
    }
    return null;
}
