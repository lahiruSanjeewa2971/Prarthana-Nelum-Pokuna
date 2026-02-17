# API & Data Management Architecture

## Overview
This document outlines the architecture for API handling and global data management in the Prarthana Nelum Pokuna hotel booking application. The architecture leverages Next.js 15+ features including Server Components, Server Actions, and modern data fetching patterns.

---

## Architecture Principles

1. **Server-First Approach**: Utilize React Server Components (RSC) for data fetching by default
2. **Type Safety**: Full TypeScript coverage across API layer
3. **Separation of Concerns**: Clear separation between data fetching, business logic, and presentation
4. **Error Handling**: Consistent error handling and user feedback
5. **Performance**: Optimize with caching, parallel requests, and proper revalidation
6. **Security**: Separate public and authenticated endpoints

---

## Folder Structure

```
src/
├── app/
│   ├── api/                    # API Routes (Backend)
│   └── types/                  # Type definitions
│       ├── api.ts              # API response types
│       └── domain.ts           # Domain model types
├── lib/
│   ├── api/                    # API Client Layer (NEW)
│   │   ├── client.ts           # Base API client
│   │   ├── function-types.ts   # Function Types API
│   │   ├── bookings.ts         # Bookings API
│   │   └── types.ts            # API-specific types
│   ├── fetchers/               # Data Fetching Layer (NEW)
│   │   ├── server.ts           # Server-side fetchers
│   │   └── client.ts           # Client-side fetchers (React Query/SWR)
│   └── actions/                # Server Actions (NEW)
│       └── bookings.ts         # Booking mutations
├── services/                   # Business Logic Layer (Existing)
├── repositories/               # Data Access Layer (Existing)
└── hooks/                      # Custom React Hooks (NEW)
    └── use-function-types.ts   # Client-side data hooks
```

---

## Layer Responsibilities

### 1. API Routes (`/app/api`)
- **Purpose**: HTTP endpoints for external/client consumption
- **Responsibilities**:
  - Request validation
  - Authentication/Authorization
  - Call service layer
  - Format responses
- **Current State**: ✅ Already implemented
- **Example**: `/api/function-types/route.ts`

### 2. Services Layer (`/services`)
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Input validation
  - Business rules enforcement
  - Coordinate repository calls
  - Error handling
- **Current State**: ✅ Already implemented
- **Example**: `function-type.service.ts`

### 3. Repositories Layer (`/repositories`)
- **Purpose**: Database operations
- **Responsibilities**:
  - Prisma queries
  - Data transformations
  - Database error handling
- **Current State**: ✅ Already implemented
- **Example**: `function-type.repository.ts`

### 4. API Client Layer (`/lib/api`) - NEW
- **Purpose**: Type-safe HTTP client for consuming API routes
- **Responsibilities**:
  - HTTP request execution
  - Response parsing
  - Type validation
  - Error transformation
- **Pattern**: Repository pattern for API
- **Usage**: Used by Server Components and Client Components

### 5. Data Fetching Layer (`/lib/fetchers`) - NEW
- **Purpose**: High-level data fetching utilities
- **Responsibilities**:
  - Server-side: Direct service calls (bypass HTTP)
  - Client-side: API client calls with caching
  - Error boundary integration
  - Loading states
- **Pattern**: Facade pattern over services/API

### 6. Server Actions (`/lib/actions`) - NEW
- **Purpose**: Server-side mutations for forms
- **Responsibilities**:
  - Form data validation
  - Direct service calls
  - Revalidation triggers
  - Progressive enhancement
- **Usage**: Form submissions, mutations

### 7. Custom Hooks (`/hooks`) - NEW
- **Purpose**: Reusable client-side data logic
- **Responsibilities**:
  - Data fetching state
  - Cache management
  - Optimistic updates
  - Mutation handling
- **Library**: React Query or SWR (TBD)

---

## Data Fetching Strategies

### Strategy 1: Server Components (Recommended for Public Data)

**When to Use:**
- Landing page (function types list)
- Static/semi-static data
- SEO-critical pages
- Initial page load

**Implementation:**
```typescript
// app/page.tsx (Server Component)
import { getFunctionTypes } from '@/lib/fetchers/server';

export default async function HomePage() {
  const functionTypes = await getFunctionTypes();
  
  return <ServicesList services={functionTypes} />;
}

// lib/fetchers/server.ts
import * as functionTypeService from '@/services/function-type.service';

export async function getFunctionTypes() {
  // Direct service call - no HTTP overhead
  return functionTypeService.listFunctionTypes(false);
}
```

**Benefits:**
- ✅ No HTTP overhead (direct DB access)
- ✅ Automatic caching
- ✅ SEO-friendly
- ✅ Reduced client bundle size
- ✅ Type-safe end-to-end

**Caching:**
```typescript
export const revalidate = 3600; // Revalidate every hour
// or
export const dynamic = 'force-static'; // Build-time only
```

---

### Strategy 2: Client Components with API Routes

**When to Use:**
- Interactive data (search, filters)
- User-specific data
- Real-time updates
- Data that changes frequently

**Implementation:**
```typescript
// components/FunctionTypeSelector.tsx (Client Component)
'use client';

import { useFunctionTypes } from '@/hooks/use-function-types';

export function FunctionTypeSelector() {
  const { data, isLoading, error } = useFunctionTypes();
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  
  return <Select options={data} />;
}

// hooks/use-function-types.ts
import { useQuery } from '@tanstack/react-query';
import { functionTypesApi } from '@/lib/api/function-types';

export function useFunctionTypes() {
  return useQuery({
    queryKey: ['function-types'],
    queryFn: () => functionTypesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// lib/api/function-types.ts
import { apiClient } from './client';

export const functionTypesApi = {
  getAll: async () => {
    return apiClient.get<FunctionType[]>('/api/function-types');
  },
};
```

**Benefits:**
- ✅ Real-time updates
- ✅ Client-side caching
- ✅ Optimistic updates
- ✅ Background refetching

---

### Strategy 3: Hybrid Approach (Server + Client)

**When to Use:**
- Initial SSR data + client-side updates
- Best of both worlds

**Implementation:**
```typescript
// app/page.tsx
import { getFunctionTypes } from '@/lib/fetchers/server';
import { ServicesList } from '@/components/ServicesList';

export default async function HomePage() {
  const initialData = await getFunctionTypes();
  
  return <ServicesList initialData={initialData} />;
}

// components/ServicesList.tsx
'use client';

import { useFunctionTypes } from '@/hooks/use-function-types';

export function ServicesList({ initialData }) {
  const { data } = useFunctionTypes(initialData);
  
  return <div>{/* Use client-side data with server fallback */}</div>;
}
```

---

## API Client Implementation Plan

### Core Client (`/lib/api/client.ts`)

```typescript
class ApiClient {
  private baseURL: string;
  
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Fetch implementation
    // Response validation
    // Error transformation
  }
  
  async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    // POST implementation
  }
  
  // put, patch, delete methods
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || '');
```

### Function Types API (`/lib/api/function-types.ts`)

```typescript
export const functionTypesApi = {
  getAll: async (includeInactive = false) => {
    const params = new URLSearchParams({ includeInactive: String(includeInactive) });
    return apiClient.get<FunctionTypesResponse>(`/api/function-types?${params}`);
  },
  
  getById: async (id: string) => {
    return apiClient.get<FunctionType>(`/api/function-types/${id}`);
  },
};

// Type definitions
interface FunctionTypesResponse {
  functionTypes: FunctionType[];
  count: number;
}
```

---

## Type System

### Domain Types (`/app/types/domain.ts`)

```typescript
// Extend Prisma types with computed fields
export type FunctionType = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FunctionTypeWithStats = FunctionType & {
  bookingCount: number;
  lastBookedAt?: Date;
};
```

### API Response Types (`/app/types/api.ts`)

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface FunctionTypesApiResponse {
  functionTypes: FunctionType[];
  count: number;
}
```

---

## State Management Strategy

### For Public Data (Function Types on Landing)

**Option A: No State Management (Recommended)**
- Use Server Components for initial render
- No client-side state needed
- Revalidate via Next.js caching

**Option B: React Query (If client interactivity needed)**
- Automatic caching
- Background refetching
- Optimistic updates
- Devtools integration

**Option C: Zustand (If complex global state needed)**
- Global store
- Persist to localStorage
- Synchronize across tabs

**Recommendation**: Start with Option A (Server Components), upgrade to Option B if needed.

---

## Error Handling

### Server-Side Errors

```typescript
// lib/fetchers/server.ts
export async function getFunctionTypes() {
  try {
    return await functionTypeService.listFunctionTypes(false);
  } catch (error) {
    logger.error('Failed to fetch function types', error);
    // Return empty array or throw based on criticality
    return [];
  }
}
```

### Client-Side Errors

```typescript
// hooks/use-function-types.ts
export function useFunctionTypes() {
  return useQuery({
    queryKey: ['function-types'],
    queryFn: functionTypesApi.getAll,
    retry: 3,
    onError: (error) => {
      toast.error('Failed to load services. Please try again.');
    },
  });
}
```

---

## Caching Strategy

### Server Component Caching

```typescript
// app/page.tsx
export const revalidate = 3600; // ISR - revalidate every hour

// Or on-demand revalidation
import { revalidatePath } from 'next/cache';
revalidatePath('/');
```

### Client-Side Caching (React Query)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

---

## Landing Page Implementation Plan

### Phase 1: Server Component Approach (Simplest)

```typescript
// app/page.tsx
import { getFunctionTypes } from '@/lib/fetchers/server';

export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const functionTypes = await getFunctionTypes();
  
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection services={functionTypes} />
      <CTASection />
    </main>
  );
}
```

**Pros:**
- ✅ Simplest implementation
- ✅ No client bundle increase
- ✅ SEO optimized
- ✅ Automatic caching

**Cons:**
- ❌ Data only updates on revalidation
- ❌ No real-time updates

---

### Phase 2: Hybrid Approach (If needed)

```typescript
// app/page.tsx (Server Component)
export default async function HomePage() {
  const initialFunctionTypes = await getFunctionTypes();
  
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection initialData={initialFunctionTypes} />
    </main>
  );
}

// components/ServicesSection.tsx (Client Component)
'use client';
export function ServicesSection({ initialData }) {
  const { data } = useFunctionTypes(initialData);
  // Client can now filter, search, etc.
}
```

---

## Recommended Technology Stack

### For Public Data (Landing Page)
- **Data Fetching**: Server Components (native Next.js)
- **Caching**: Next.js built-in caching + ISR
- **State Management**: None (or minimal with React state)

### For Interactive Features (Booking Form, Admin)
- **Data Fetching**: TanStack Query (React Query) v5
- **State Management**: React Query cache + Zustand (if needed)
- **Forms**: React Hook Form + Zod
- **Mutations**: Server Actions

---

## Implementation Checklist

### Phase 1: Server-Side Foundation
- [ ] Create `/lib/fetchers/server.ts`
- [ ] Implement `getFunctionTypes()` server fetcher
- [ ] Add TypeScript types to `/app/types/domain.ts`
- [ ] Update landing page to use server fetcher
- [ ] Configure ISR/caching strategy
- [ ] Test with real database data

### Phase 2: Client-Side Infrastructure (If Needed)
- [ ] Install `@tanstack/react-query`
- [ ] Create `/lib/api/client.ts`
- [ ] Create `/lib/api/function-types.ts`
- [ ] Set up React Query provider
- [ ] Create `use-function-types` hook
- [ ] Add error boundaries
- [ ] Add loading states

### Phase 3: Optimization
- [ ] Add request deduplication
- [ ] Implement parallel data fetching
- [ ] Add error tracking (Sentry/LogRocket)
- [ ] Performance monitoring
- [ ] Add E2E tests

---

## Best Practices

1. **Prefer Server Components**: Default to server-side data fetching
2. **Type Everything**: Use TypeScript for all API interactions
3. **Cache Wisely**: Balance freshness vs performance
4. **Handle Errors Gracefully**: Never show raw errors to users
5. **Test Both Paths**: Test with and without JavaScript
6. **Monitor Performance**: Track API response times
7. **Document APIs**: Keep OpenAPI/Swagger docs updated
8. **Version APIs**: Use `/api/v1` if public API needed

---

## Security Considerations

### Public Endpoints (Function Types)
- ✅ No authentication required
- ✅ Rate limiting (future)
- ✅ Input validation
- ⚠️ Only return `isActive: true` by default

### Protected Endpoints (Admin)
- 🔒 JWT authentication required
- 🔒 Role-based access control
- 🔒 CSRF protection
- 🔒 Audit logging

---

## Next Steps

1. **Review this architecture** - Confirm approach
2. **Choose data fetching strategy** - Server vs Hybrid for landing
3. **Choose state management** - None vs React Query
4. **Create implementation tasks** - Break down into tickets
5. **Begin implementation** - Start with server fetcher

---

## Questions to Resolve

1. Do you need real-time updates for function types on landing page?
2. Will users need to filter/search services client-side?
3. Do you want to invest in React Query now or later?
4. What's the expected update frequency for function types?

---

**Recommended Starting Point**: 
**Phase 1 - Server Component Approach** (simplest, most performant, SEO-friendly)

Upgrade to hybrid/client approach only if you need:
- Client-side filtering
- Real-time updates
- Complex interactions
