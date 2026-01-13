import { PreviewSection } from "./PreviewSection";
import PreviewHeader from "./PreviewHeader";
import { IPageWithoutId } from "@/lib/page.types";

type Props = {
    page: IPageWithoutId;
};

/**
 * PreviewMode Component
 * 
 * Displays a preview of the page with header information and sections.
 */
export default function PreviewMode({ page }: Props) {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <PreviewHeader
                category={page.category}
                title={page.title}
                description={page.description}
                importantDates={page.importantDates}
            />

            {/* Sections Grid - Masonry Layout */}
            <div className="columns-1 lg:columns-2 gap-8">
                {page.sections.map(section => (
                    <div key={section._id} className="break-inside-avoid mb-8">
                        <PreviewSection section={section} />
                    </div>
                ))}
            </div>
        </div>
    );
}
