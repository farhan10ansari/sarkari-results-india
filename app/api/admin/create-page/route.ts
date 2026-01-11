import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/db/mongodb';
import Page from '@/db/models/page';
import { PageStatus } from '@/lib/page.types';


// POST - Create new page
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();

    // Basic validation
    if (!body.id || !body.title || !body.slug || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, title, slug, and type are required',
        },
        { status: 400 }
      );
    }

    // Check if page with same slug already exists
    const existingPage = await Page.findOne({ slug: body.slug });
    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          error: `Page with slug '${body.slug}' already exists`,
        },
        { status: 409 }
      );
    }

    // Check if page with same id already exists
    const existingPageById = await Page.findOne({ id: body.id });
    if (existingPageById) {
      return NextResponse.json(
        {
          success: false,
          error: `Page with id '${body.id}' already exists`,
        },
        { status: 409 }
      );
    }

    // Set default values if not provided
    const pageData = {
      ...body,
      status: body.status || PageStatus.DRAFT,
      displayConfig: body.displayConfig || {},
      metadata: body.metadata || {},
      sections: body.sections || [],
      updatedAt: new Date(),
    };

    // Create the page
    const page = await Page.create(pageData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Page created successfully',
        data: page,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating page:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        },
        { status: 422 }
      );
    }

    // Handle duplicate key errors (MongoDB E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate value for field: ${field}`,
        },
        { status: 409 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON format',
        },
        { status: 400 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create page',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
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

    const pages = await Page.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pages',
      },
      { status: 500 }
    );
  }
}
