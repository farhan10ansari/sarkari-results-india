import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page';
import { IPage, PageStatus } from '@/lib/page.types';
import { APIResponse } from '@/lib/api';


// POST - Create new page
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json() as IPage;

    console.log('Received page:', body);

    // Basic validation
    if (!body.title || !body.slug || !body.type || !body.category) {
      return APIResponse(
        false,
        'Missing required fields: title, slug, type, and category are required',
        null,
        400
      );
    }

    // Check if page with same _id already exists
    const existingPageById = await Page.findById(body._id);
    if (existingPageById) {
      return APIResponse(
        false,
        `Page with _id '${body._id}' already exists`,
        null,
        409
      );
    }

    // Check if page with same slug already exists
    const existingPage = await Page.findOne({ slug: body.slug });
    if (existingPage) {
      return APIResponse(
        false,
        `Page with slug '${body.slug}' already exists`,
        null,
        409
      );
    }

    // Prepare page data with defaults
    const pageData = {
      ...body,
      status: body.status || PageStatus.DRAFT,
      displayConfig: body.displayConfig || {},
      metadata: body.metadata || {},
      sections: body.sections || [],
      updatedAt: new Date().toISOString(),
    };

    // Create the page
    const page = await Page.create(pageData);

    return APIResponse(
      true,
      'Page created successfully',
      page,
      201
    );
  } catch (error: any) {
    console.error('Error creating page:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return APIResponse(
        false,
        'Validation failed: ' + validationErrors.join(', '),
        { errors: validationErrors },
        422
      );
    }

    // Handle duplicate key errors (MongoDB E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'unknown';
      return APIResponse(
        false,
        `Duplicate value for field: ${field}`,
        null,
        409
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return APIResponse(
        false,
        'Invalid JSON format in request body',
        null,
        400
      );
    }

    // Generic error handler
    return APIResponse(
      false,
      error.message || 'An unexpected error occurred while creating the page',
      null,
      500
    );
  }
}

// GET - Fetch all pages
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;

    // Fetch pages
    const pages = await Page.find(query).sort({ updatedAt: -1 });

    // Build descriptive message
    let message = 'Pages retrieved successfully';
    if (type && status) {
      message = `Retrieved ${pages.length} ${status} ${type} page(s)`;
    } else if (type) {
      message = `Retrieved ${pages.length} ${type} page(s)`;
    } else if (status) {
      message = `Retrieved ${pages.length} ${status} page(s)`;
    } else {
      message = `Retrieved ${pages.length} page(s)`;
    }

    return APIResponse(
      true,
      message,
      { pages, count: pages.length },
      200
    );
  } catch (error: any) {
    console.error('Error fetching pages:', error);

    return APIResponse(
      false,
      error.message || 'An unexpected error occurred while fetching pages',
      null,
      500
    );
  }
}
