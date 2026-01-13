# API Architecture - Public vs Admin

## Overview
The application now has separate API endpoints for public access and admin operations, allowing for better security, maintainability, and future authentication implementation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Public Pages              │           Admin Section         │
│  (/jobs, /results, etc)    │           (/admin/*)           │
│           │                 │                │                │
│           ↓                 │                ↓                │
│    /api/jobs (PUBLIC)       │      /api/admin/* (ADMIN)     │
│           │                 │                │                │
│           ↓                 │                ↓                │
│     ┌──────────────────────┴────────────────────┐           │
│     │            MongoDB Database                 │           │
│     └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### 1. Public API - `/api/jobs`

**Purpose:** Public-facing endpoint for job listings accessible to all users.

**Location:** `/app/api/jobs/route.ts`

**Features:**
- ✅ No authentication required
- ✅ Only returns published jobs
- ✅ Supports filtering by category
- ✅ Supports search functionality
- ✅ Pagination support (max 100 per page)
- ✅ Input validation
- ✅ Clean, focused response format

**Endpoint:** `GET /api/jobs`

**Query Parameters:**
```typescript
{
  category?: string;    // Filter by job category
  search?: string;      // Search in title, description, category
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 12, max: 100)
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Found 12 job(s) (Page 1 of 5)",
  "data": {
    "jobs": [
      {
        "_id": "...",
        "title": "Job Title",
        "slug": "job-slug",
        "category": "banking-jobs",
        "description": "...",
        "updatedAt": "2026-01-13T...",
        "publishedAt": "2026-01-13T...",
        "importantDates": {
          "startDateOfApplication": "...",
          "lastDateOfApplication": "..."
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 12,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

**Used By:**
- `/jobs` page (client-side filtering)
- Future mobile app
- Future public API consumers

**Security Considerations:**
- Rate limiting can be added
- No sensitive data exposed
- Only published content returned
- Input validation prevents injection

### 2. Admin API - `/api/admin/pages`

**Purpose:** Admin operations for managing all page types (jobs, results, admissions, etc.).

**Location:** `/app/api/admin/pages/route.ts`

**Features:**
- ✅ Full CRUD operations
- ✅ Access to all page types
- ✅ Access to all statuses (draft, published, archived, trashed)
- ✅ Advanced filtering options
- ✅ Search functionality
- ✅ **Future:** Will have authentication middleware
- ✅ **Future:** Will have authorization checks

**Endpoints:**
- `GET /api/admin/pages` - List all pages
- `POST /api/admin/pages` - Create new page
- `GET /api/admin/pages/[id]` - Get specific page
- `PUT /api/admin/pages/[id]` - Update page
- `DELETE /api/admin/pages/[id]` - Delete page

**Query Parameters (GET):**
```typescript
{
  type?: PageType;         // job, result, admission, etc.
  status?: PageStatus;     // draft, published, archived, trashed
  category?: string;       // Filter by category
  search?: string;         // Search in title, description, category
  page?: number;           // Page number
  limit?: number;          // Items per page
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Retrieved 10 page(s) (Page 1 of 3)",
  "data": {
    "pages": [...],
    "pagination": {...}
  }
}
```

**Used By:**
- Admin dashboard (`/admin/pages`)
- Page editor (`/admin/page-editor`)
- Admin management tools
- **Future:** Admin mobile app

**Security Considerations:**
- **Future:** JWT authentication required
- **Future:** Role-based access control
- **Future:** Audit logging
- **Future:** Rate limiting per admin user

## Data Flow

### Public Jobs Page Flow

#### Initial Load (Server-Side)
```
User visits /jobs
       ↓
Server Component (page.tsx)
       ↓
Direct MongoDB Query
       ↓
Return HTML with data
       ↓
Client Component receives initialData
       ↓
Page displays instantly ⚡
```

#### Filter/Search (Client-Side)
```
User changes filter/searches
       ↓
JobsClient component
       ↓
React Query cache check
       ↓
If not cached:
  → Fetch /api/jobs (PUBLIC API)
       ↓
  → MongoDB query
       ↓
  → Return filtered results
       ↓
Update UI smoothly 🎯
```

### Admin Dashboard Flow

```
Admin visits /admin/pages
       ↓
Admin Component
       ↓
Fetch /api/admin/pages
       ↓
**Future:** Check authentication
       ↓
MongoDB query (all statuses)
       ↓
Return all pages
       ↓
Display in admin UI
```

## Benefits of Separation

### 1. Security
- **Public API:** Can be rate-limited differently
- **Admin API:** Can add authentication without affecting public
- **Separation:** Prevents accidental exposure of admin features
- **Future-proof:** Easy to add middleware to admin routes

### 2. Maintainability
- **Clear responsibility:** Each API has specific purpose
- **Easier debugging:** Know which API to check
- **Independent changes:** Modify admin API without affecting public
- **Better documentation:** Clear separation of concerns

### 3. Performance
- **Public API:** Optimized for public access patterns
- **Admin API:** Can have different caching strategies
- **Server-side:** Initial load bypasses API entirely
- **Client-side:** Uses appropriate API for operation

### 4. Scalability
- **Different rate limits:** Public vs admin
- **Different caching:** Public cached longer
- **Different hosting:** Can separate in future
- **Load balancing:** Can route differently

## Future Enhancements

### Public API (`/api/jobs`)
- [ ] Rate limiting (100 requests/minute per IP)
- [ ] Response caching (CDN integration)
- [ ] API versioning (`/api/v1/jobs`)
- [ ] API key for third-party access
- [ ] GraphQL endpoint option
- [ ] WebSocket for real-time updates

### Admin API (`/api/admin/*`)
- [ ] JWT authentication middleware
- [ ] Role-based access control (RBAC)
- [ ] Audit logging for all operations
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Admin activity tracking
- [ ] Webhook notifications
- [ ] Batch operations

## Migration Notes

### For Adding Authentication to Admin API

1. Create authentication middleware:
```typescript
// middleware/auth.ts
export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization');
  // Verify JWT token
  // Return user info or throw error
}
```

2. Apply to admin routes:
```typescript
// app/api/admin/[route]/route.ts
import { authMiddleware } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  await authMiddleware(request); // Add this line
  // ... rest of your code
}
```

3. Public API remains unchanged! ✅

### Adding Rate Limiting

```typescript
// Public API - Strict limits
const publicLimiter = {
  windowMs: 60000, // 1 minute
  max: 100 // 100 requests per minute
};

// Admin API - More lenient for authenticated users
const adminLimiter = {
  windowMs: 60000,
  max: 1000 // 1000 requests per minute
};
```

## Testing the APIs

### Test Public API
```bash
# Get all jobs
curl http://localhost:3000/api/jobs

# Filter by category
curl http://localhost:3000/api/jobs?category=banking-jobs

# Search
curl http://localhost:3000/api/jobs?search=engineer

# Pagination
curl http://localhost:3000/api/jobs?page=2&limit=10
```

### Test Admin API
```bash
# Get all pages (any status)
curl http://localhost:3000/api/admin/pages

# Filter by type and status
curl http://localhost:3000/api/admin/pages?type=job&status=draft

# Create new page
curl -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","slug":"test-job",...}'
```

## Summary

| Feature | Public API | Admin API |
|---------|-----------|-----------|
| **Endpoint** | `/api/jobs` | `/api/admin/pages` |
| **Authentication** | None | Future: JWT |
| **Access Level** | Published only | All statuses |
| **Rate Limit** | Future: 100/min | Future: 1000/min |
| **Caching** | Aggressive | Minimal |
| **Used By** | Public pages | Admin dashboard |
| **Purpose** | Browse jobs | Manage content |

This separation provides a solid foundation for scaling the application while maintaining security and performance! 🚀
