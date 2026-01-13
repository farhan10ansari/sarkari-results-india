import { notFound } from 'next/navigation';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page-model';
import { IPage } from '@/lib/page.types';
import PreviewMode from '@/admin/PreviewMode';

interface PageProps {
    params: { slug: string };
}

async function getPageBySlug(slug: string): Promise<IPage | null> {
    try {
        await dbConnect();
        const page = await Page.findOne({ slug }).lean();
        if (!page) {
            return null;
        }
        return JSON.parse(JSON.stringify(page));
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

export default async function PageDetail({ params }: PageProps) {
    const { slug } = await params;

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-4 lg:py-8">
            <PreviewMode page={page} />
        </div>
    );
}
