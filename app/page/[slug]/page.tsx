import { notFound } from 'next/navigation';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page';
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
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <header className="mb-8 border-b pb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
                        <p className="text-gray-600 text-lg">{page.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                            {page.type}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm uppercase">
                            {page.status || 'DRAFT'}
                        </span>
                    </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {page.category && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Category:</span>
                            <span className="capitalize">{page.category}</span>
                        </div>
                    )}

                    {page.updatedAt && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Updated:</span>
                            <time>{new Date(page.updatedAt).toLocaleDateString()}</time>
                        </div>
                    )}

                    {page.publishedAt && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Published:</span>
                            <time>{new Date(page.publishedAt).toLocaleDateString()}</time>
                        </div>
                    )}
                </div>

                {/* Important Dates Section */}
                {page.importantDates && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-3 text-yellow-900">
                            Important Dates
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {page.importantDates.startDateOfApplication && (
                                <div>
                                    <span className="font-medium text-gray-700">Application Start Date:</span>
                                    <p className="text-lg text-gray-900">
                                        {new Date(page.importantDates.startDateOfApplication).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}

                            {page.importantDates.lastDateOfApplication && (
                                <div>
                                    <span className="font-medium text-gray-700">Application Last Date:</span>
                                    <p className="text-lg text-red-600 font-semibold">
                                        {new Date(page.importantDates.lastDateOfApplication).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Render Page Content */}
            {/* <PageRenderer page={page} /> */}
            <PreviewMode page={page} />

        </div>
    );
}

// Generate metadata for SEO
// export async function generateMetadata({ params }: PageProps) {
//   const page = await getPageBySlug(params.slug);

//   if (!page) {
//     return {
//       title: 'Page Not Found',
//     };
//   }

//   return {
//     title: page.metadata?.metaTitle || page.title,
//     description: page.metadata?.metaDescription || page.description,
//     keywords: page.metadata?.keywords,
//     openGraph: {
//       title: page.title,
//       description: page.description,
//       images: page.metadata?.ogImage ? [page.metadata.ogImage] : [],
//     },
//   };
// }

export async function generateStaticParams() {
    try {
        await dbConnect();

        const pages = await Page.find({ status: 'PUBLISHED' })
            .select('slug')
            .lean();

        return pages.map((page: any) => ({
            slug: page.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export const revalidate = 60;
