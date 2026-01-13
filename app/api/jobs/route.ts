import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page-model';
import { PageType, PageStatus } from '@/lib/page.types';

/**
 * Public Jobs API Route
 * 
 * This is the public-facing API for fetching job listings.
 * Separate from admin API to allow for:
 * - Different authentication/authorization rules
 * - Different rate limiting
 * - Different caching strategies
 * - Public access without admin credentials
 * 
 * Features:
 * - Filter by category
 * - Search functionality
 * - Pagination support
 * - Only returns published jobs
 */

interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}

function createResponse(success: boolean, message: string, data: any = null, status: number = 200): NextResponse {
  const response: APIResponse = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return NextResponse.json(response, { status });
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return createResponse(
        false,
        'Invalid pagination parameters',
        null,
        400
      );
    }

    const skip = (page - 1) * limit;

    // Build query - only published jobs
    const query: any = {
      type: PageType.JOB,
      status: PageStatus.PUBLISHED,
    };

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch jobs with pagination
    const jobs = await Page.find(query)
      .select('_id title slug category updatedAt publishedAt importantDates description')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Page.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Build descriptive message
    const filters = [];
    if (category && category !== 'all') filters.push(`category: ${category}`);
    if (search) filters.push(`search: "${search}"`);

    const message = filters.length > 0
      ? `Found ${jobs.length} job(s) matching: ${filters.join(', ')} (Page ${page} of ${totalPages})`
      : `Retrieved ${jobs.length} job(s) (Page ${page} of ${totalPages})`;

    return createResponse(
      true,
      message,
      {
        jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages,
        },
      },
      200
    );
  } catch (error: any) {
    console.error('Error fetching jobs:', error);

    return createResponse(
      false,
      'An error occurred while fetching jobs',
      null,
      500
    );
  }
}
