import { NextResponse } from "next/server";

export type APIResponse<T> = {
    success: boolean;
    message: string;
    data: T | null;
    statusCode: number;
};

// Helper function for consistent API responses
export function APIResponse<T>(
    success: boolean,
    message: string,
    data: T | null = null,
    statusCode: number = 200
) {
    return NextResponse.json(
        {
            success,
            message,
            data,
        },
        { status: statusCode }
    );
}
