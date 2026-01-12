import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page-model';
import { APIResponse } from '@/lib/api';
import { PageStatus } from '@/lib/page.types';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const [total, published, drafts] = await Promise.all([
            Page.countDocuments({ status: { $ne: PageStatus.TRASHED } }), // Total active docs (excluding trash)
            Page.countDocuments({ status: PageStatus.PUBLISHED }),
            Page.countDocuments({ status: PageStatus.DRAFT }),
        ]);

        return APIResponse(
            true,
            'Stats retrieved',
            {
                total,
                published,
                drafts
            },
            200
        );

    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return APIResponse(false, 'Error fetching stats', null, 500);
    }
}
