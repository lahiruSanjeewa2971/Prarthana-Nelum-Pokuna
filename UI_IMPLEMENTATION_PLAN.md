# Prarthana Nelum Pokuna - UI Implementation Plan

## Project Overview
Full-stack hotel booking system for Prarthana Nelum Pokuna Hotel. Customers can book without login (public booking form) or optionally create accounts to track their bookings. Admin authentication required for booking management. Single login system that automatically routes users based on email (admin vs customer).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React (comes with shadcn)
- **Forms**: React Hook Form + Zod
- **API Client**: Native fetch with custom wrapper
- **State Management**: 
  - Auth: React Context API
  - Server State: React Query (TanStack Query)
  - Local State: React useState/useReducer
- **Responsive**: Mobile-first approach (100% mobile support)
- **Authentication**: JWT-based with unified login (httpOnly cookies)
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Native Fetch API with custom wrapper
- **UI Components**: Headless UI + Heroicons

---

## Project Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page (admin + optional customer)
│   │   ├── register/
│   │   │   └── page.tsx         # Customer registration (optional)
│   │   └── forgot-password/
│   │       └── page.tsx         # Forgot password page
│   │
│   ├── (public)/                # Public routes (no auth required)
│   │   ├── layout.tsx           # Public layout wrapper
│   │   ├── page.tsx             # Landing/home page
│   │   ├── booking/
│   │   │   └── page.tsx         # Public booking form (NO LOGIN REQUIRED)
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   └── gallery/
│   │       └── page.tsx         # Gallery page
│   │
│   ├── customer/                # Customer protected routes (OPTIONAL - for logged-in customers)
│   │   ├── layout.tsx           # Customer layout with nav
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Customer dashboard
│   │   ├── bookings/
│   │   │   ├── page.tsx         # My bookings list (requires login)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Booking details
│   │   └── profile/
│   │       └── page.tsx         # Profile management
│   │
│   ├── admin/                   # Admin protected routes
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx         # Bookings list
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Booking details
│   │   ├── function-types/
│   │   │   └── page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/                     # Existing API routes
│   │   ├── bookings/
│   │   ├── admin/
│   │   └── function-types/
│   │
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles + Tailwind
│   ├── not-found.tsx            # 404 page
│   └── error.tsx                # Error boundary
│
├── components/                  # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── DatePicker.tsx
│   │   ├── TimePicker.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── auth/                    # Auth-specific components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Breadcrumbs.tsx
│   │
│   ├── booking/                 # Booking-related components
│   │   ├── BookingCard.tsx
│   │   ├── BookingList.tsx
│   │   ├── BookingFilters.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingStatusBadge.tsx
│   │   └── BookingTimeline.tsx
│   │
│   ├── function-type/           # Function type components
│   │   ├── FunctionTypeCard.tsx
│   │   ├── FunctionTypeList.tsx
│   │   ├── FunctionTypeForm.tsx
│   │   └── FunctionTypeModal.tsx
│   │
│   └── customer/                # Customer management components
│       ├── CustomerCard.tsx
│       ├── CustomerList.tsx
│       └── CustomerDetails.tsx
│
├── contexts/                    # React Context providers
│   ├── AuthContext.tsx          # Auth state management
│   ├── ToastContext.tsx         # Toast notifications
│   └── ThemeContext.tsx         # Theme/dark mode (optional)
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Auth hook
│   ├── useToast.ts              # Toast notifications
│   ├── useApi.ts                # API calls wrapper
│   ├── useBookings.ts           # Bookings data fetching
│   ├── useFunctionTypes.ts      # Function types data
│   ├── useMediaQuery.ts         # Responsive breakpoint detection
│   └── useDebounce.ts           # Debounce values
│
├── lib/                         # Existing utility libraries
│   ├── api/                     # NEW: API client utilities
│   │   ├── client.ts            # Fetch wrapper with auth
│   │   ├── endpoints.ts         # API endpoint constants
│   │   └── types.ts             # API types/interfaces
│   ├── db.ts
│   ├── jwt.ts
│   ├── logger.ts
│   ├── constants.ts
│   └── ...
│
├── utils/                       # Client-side utilities
│   ├── formatters.ts            # Date/time/currency formatters
│   ├── validators.ts            # Client-side validation helpers
│   ├── storage.ts               # LocalStorage helpers
│   └── cn.ts                    # className utility (clsx + tailwind-merge)
│
├── types/                       # TypeScript types
│   ├── auth.ts                  # Auth types
│   ├── booking.ts               # Booking types
│   ├── user.ts                  # User types
│   └── common.ts                # Common types
│
└── middleware.ts                # Next.js middleware for route protection
```

---

## Architecture Details

### Global Auth State Management

#### AuthContext Provider (`src/contexts/AuthContext.tsx`)

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth status on mount (read from cookie/verify JWT)
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Try to get current user from the server (will use httpOnly cookie)
      const response = await api.get('/api/auth/me');
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post('/api/admin/login', { email, password });
    
    if (response.success) {
      const userData = response.data.admin;
      
      // Determine role based on email
      const role = email === 'rathne1997@gmail.com' ? 'admin' : 'customer';
      
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role,
      });

      // Redirect based on role
      router.push(role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
    }
  }

  async function register(name: string, email: string, phone: string, password: string) {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      phone,
      password,
    });

    if (response.success) {
      const userData = response.data.user;
      
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: 'customer',
      });

      router.push('/customer/dashboard');
    }
  }

  async function logout() {
    await api.post('/api/admin/logout');
    setUser(null);
    router.push('/login');
  }

  function isAdmin() {
    return user?.role === 'admin';
  }

  function isAuthenticated() {
    return !!user;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### Hook Usage Example

```typescript
// In any component
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      {isAdmin() && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### API Client Architecture

#### API Client Wrapper (`src/lib/api/client.ts`)

```typescript
// src/lib/api/client.ts
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important: Include cookies (JWT)
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP errors
        throw {
          code: data.error?.code || 'API_ERROR',
          message: data.error?.message || 'An error occurred',
          details: data.error?.details,
          status: response.status,
        };
      }

      return data;
    } catch (error: any) {
      // Network errors or thrown errors
      if (error.code) {
        throw error; // Already formatted error
      }

      throw {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network request failed',
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
```

#### API Endpoints Constants (`src/lib/api/endpoints.ts`)

```typescript
// src/lib/api/endpoints.ts
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/admin/login',
  LOGOUT: '/api/admin/logout',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  
  // Bookings (Customer)
  BOOKINGS: '/api/bookings',
  BOOKING_BY_ID: (id: string) => `/api/bookings/${id}`,
  
  // Bookings (Admin)
  ADMIN_BOOKINGS: '/api/admin/bookings',
  ADMIN_BOOKING_BY_ID: (id: string) => `/api/admin/bookings/${id}`,
  
  // Function Types
  FUNCTION_TYPES: '/api/function-types',
  ADMIN_FUNCTION_TYPES: '/api/admin/function-types',
  ADMIN_FUNCTION_TYPE_BY_ID: (id: string) => `/api/admin/function-types/${id}`,
  ADMIN_FUNCTION_TYPE_STATUS: (id: string) => `/api/admin/function-types/${id}/status`,
  
  // Customers (Admin)
  ADMIN_CUSTOMERS: '/api/admin/customers',
  ADMIN_CUSTOMER_BY_ID: (id: string) => `/api/admin/customers/${id}`,
} as const;
```

#### Custom Hooks for API Calls

```typescript
// src/hooks/useBookings.ts
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useToast } from './useToast';

export function useBookings(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const endpoint = queryString 
        ? `${API_ENDPOINTS.ADMIN_BOOKINGS}?${queryString}`
        : API_ENDPOINTS.ADMIN_BOOKINGS;

      const response = await api.get(endpoint);

      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (err: any) {
      setError(err.message);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(
    id: string,
    status: string,
    adminNote?: string
  ) {
    try {
      const response = await api.patch(
        API_ENDPOINTS.ADMIN_BOOKING_BY_ID(id),
        { status, adminNote }
      );

      if (response.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id ? { ...booking, status, adminNote } : booking
          )
        );
        return response.data;
      }
    } catch (err: any) {
      showError(err.message);
      throw err;
    }
  }

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
  };
}

// Usage in component:
// const { bookings, loading, updateBookingStatus } = useBookings({ status: 'PENDING' });
```

#### Example Component with API Integration

```typescript
// src/app/admin/bookings/page.tsx
'use client';

import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { BookingCard } from '@/components/booking/BookingCard';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminBookingsPage() {
  const { isAdmin } = useAuth();
  const { bookings, loading, updateBookingStatus } = useBookings();

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  async function handleAccept(bookingId: string) {
    await updateBookingStatus(bookingId, 'ACCEPTED', 'Booking approved');
  }

  return (
    <div>
      <h1>Bookings</h1>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onAccept={handleAccept}
        />
      ))}
    </div>
  );
}
```

---

## Authentication Strategy

### Login System
- **Admin**: Required - Email-based validation (rathne1997@gmail.com)
- **Customer**: Optional - Can book without account OR register/login to track bookings
- **Public Booking**: No authentication required for placing bookings
- **Customer Accounts**: Optional feature for booking history and profile management

### Login Form
- One unified login form for both admin and customers
- Email detection: Check if email matches admin email
  - Admin email: `rathne1997@gmail.com` → Admin Dashboard
  - All others: Customers → Customer Dashboard
- **Registration**: Only for customers who want to track bookings (admin pre-exists)

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 special character
- Enforced client-side and server-side

### User Flow Options
```
Option 1 (Public Booking - No Account):
Landing Page → Public Booking Form → Submit → Confirmation Email

Option 2 (Customer with Account):
Landing Page → Login/Register → Customer Dashboard → My Bookings

Option 3 (Admin):
Landing Page → Login → Admin Dashboard → Manage Bookings
```

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (layout without sidebar)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (customer)/               # Customer group (customer layout)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Customer layout wrapper
│   ├── (admin)/                  # Admin group (admin layout)
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── function-types/
│   │   │   │   └── page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── layout.tsx            # Admin layout wrapper
│   ├── api/                      # API routes (already exists)
│   ├── page.tsx                  # Landing/home page
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/                   # React components
│   ├── ui/                       # shadcn components (auto-generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── calendar.tsx
│   │   └── ...
│   ├── auth/                     # Auth-related components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── protected-route.tsx
│   ├── booking/                  # Booking-specific components
│   │   ├── booking-card.tsx
│   │   ├── booking-filters.tsx
│   │   ├── booking-status-badge.tsx
│   │   ├── booking-form-step1.tsx
│   │   ├── booking-form-step2.tsx
│   │   └── booking-form-step3.tsx
│   ├── layout/                   # Layout components
│   │   ├── customer-nav.tsx
│   │   ├── admin-nav.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   └── shared/                   # Shared components
│       ├── page-header.tsx
│       ├── data-table.tsx
│       ├── empty-state.tsx
│       └── loading-spinner.tsx
│
├── lib/                          # Utility functions (already exists)
│   ├── api-client.ts             # NEW: API wrapper
│   ├── utils.ts                  # shadcn utility (cn function)
│   ├── db.ts
│   ├── jwt.ts
│   └── ...
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts               # Auth context consumer
│   ├── use-booking.ts            # Booking operations
│   ├── use-function-types.ts     # Function types query
│   ├── use-toast.ts              # shadcn toast hook
│   └── use-mobile.ts             # Detect mobile viewport
│
├── context/                      # React Context providers
│   ├── auth-context.tsx          # Global auth state
│   └── theme-context.tsx         # Theme provider (optional)
│
├── types/                        # TypeScript types (already exists)
│   ├── api.ts
│   ├── booking.ts
│   ├── auth.ts                   # NEW: Auth types
│   └── customer.ts               # NEW: Customer types
│
├── services/                     # Backend services (already exists)
├── repositories/                 # Backend repositories (already exists)
├── middleware/                   # Backend middleware (already exists)
└── domain/                       # Domain logic (already exists)
```

---

## Global State Management

### Authentication State (Context API)

**Location**: `src/context/auth-context.tsx`

```typescript
// Auth Context structure
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// User type
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}
```

**Why Context API for Auth?**
- Simple, built-in solution
- Auth state doesn't change frequently
- No need for external library overhead
- Easy to implement and maintain

**Provider Location**: Wrap in root `app/layout.tsx`

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Usage in components:**
```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();
  // ...
}
```

---

## API Client Strategy

### Custom API Wrapper

**Location**: `src/lib/api-client.ts`

```typescript
// API client with automatic error handling and auth
class ApiClient {
  private baseUrl = '/api';

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include', // Send cookies (JWT token)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error.message, response.status, data.error);
    }

    return data;
  }

  // Convenient methods
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

### React Query for Server State

**Location**: Wrap in `app/layout.tsx` (after AuthProvider)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Custom Hooks for API Calls

**Example**: `src/hooks/use-bookings.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => apiClient.get<BookingListResponse>('/admin/bookings'),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, note }: UpdateBookingParams) =>
      apiClient.patch(`/admin/bookings/${id}`, { status, adminNote: note }),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Usage in component:
function BookingList() {
  const { data, isLoading, error } = useBookings({ status: 'PENDING' });
  const updateStatus = useUpdateBookingStatus();

  const handleAccept = (id: string) => {
    updateStatus.mutate({ id, status: 'ACCEPTED', note: 'Approved' });
  };
}
```

**Example**: `src/hooks/use-function-types.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useFunctionTypes() {
  return useQuery({
    queryKey: ['function-types'],
    queryFn: () => apiClient.get<FunctionTypesResponse>('/function-types'),
    staleTime: 5 * 60 * 1000, // 5 minutes (doesn't change often)
  });
}

// Usage:
function BookingForm() {
  const { data, isLoading } = useFunctionTypes();
  const functionTypes = data?.data.functionTypes || [];
}
```

**Benefits of React Query:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Loading/error states handled
- ✅ Request deduplication
- ✅ Pagination support
- ✅ Invalidation and refetch control

---

## Phase 1: Foundation & Authentication (Week 1)

### 1.1 Setup & Configuration
- [ ] Install and configure Tailwind CSS (if not already)
- [ ] **Install shadcn/ui** (`npx shadcn@latest init`)
- [ ] Configure shadcn with Tailwind theme (hotel colors)
- [ ] Install React Query (`@tanstack/react-query`)
- [ ] Install React Hook Form (`react-hook-form`)
- [ ] Install Lucide React icons (`lucide-react`)
- [ ] Setup global CSS with custom styles
- [ ] Configure responsive breakpoints (mobile-first)
- [ ] Setup middleware for route protection
- [ ] Create API client wrapper (`src/lib/api-client.ts`)

### 1.2 Install shadcn Components (Base Set)
- [ ] Install button component (`npx shadcn@latest add button`)
- [ ] Install input component (`npx shadcn@latest add input`)
- [ ] Install card component (`npx shadcn@latest add card`)
- [ ] Install dialog component (`npx shadcn@latest add dialog`)
- [ ] Install dropdown-menu component (`npx shadcn@latest add dropdown-menu`)
- [ ] Install form component (`npx shadcn@latest add form`)
- [ ] Install toast/sonner component (`npx shadcn@latest add toast`)
- [ ] Install calendar component (`npx shadcn@latest add calendar`)
- [ ] Install select component (`npx shadcn@latest add select`)
- [ ] Install badge component (`npx shadcn@latest add badge`)
- [ ] Install table component (`npx shadcn@latest add table`)
- [ ] Install skeleton component (`npx shadcn@latest add skeleton`)
- [ ] Install alert component (`npx shadcn@latest add alert`)

### 1.3 Design System Customization
- [ ] Customize shadcn theme colors in `tailwind.config.ts`
  - Primary colors (hotel brand)
  - Secondary colors
  - Accent colors
  - Semantic colors (success, warning, error, info)
- [ ] Customize typography scale
- [ ] Customize spacing system
- [ ] Add custom animations/transitions
- [ ] Configure dark mode (optional)

### 1.4 Global State Setup
- [ ] **Create Auth Context** (`src/context/auth-context.tsx`)
  - User state (id, email, name, role)
  - isAuthenticated, isAdmin, isLoading
  - login, register, logout, refreshUser functions
- [ ] **Create useAuth hook** (`src/hooks/use-auth.ts`)
- [ ] **Setup React Query Provider** in root layout
- [ ] **Create QueryClient** with default options
- [ ] **Wrap app with providers** (AuthProvider → QueryClientProvider)

### 1.5 Authentication UI (Using shadcn components)
- [ ] **Landing/Home Page** (`app/(public)/page.tsx`)
  - Hero section with hotel image
  - Brief description
  - CTA buttons (shadcn Button)
    - "Book Now" → Public booking form (no login)
    - "My Bookings" → Login (for customers with accounts)
    - "Admin Login" → Admin login
  - Available function types preview (shadcn Card)
  - Contact information
  - Fully responsive mobile layout

- [ ] **Public Booking Page** (`app/(public)/booking/page.tsx`)
  - **NO LOGIN REQUIRED**
  - Booking form component (`components/booking/public-booking-form.tsx`)
  - Customer information fields:
    - Full name (shadcn Input)
    - Email (shadcn Input)
    - Phone number (shadcn Input)
  - Event details:
    - Function type selection (dropdown with active types)
    - Event date picker (disable past dates)
    - Start time selector
    - End time selector
    - Additional notes textarea
  - Form validation with React Hook Form + Zod
  - Submit creates booking with status PENDING
  - Success message with booking reference
  - Email sent to customer (confirmation) and admin (notification)
  - Option to "Create account to track this booking"
  - Mobile-optimized layout

- [ ] **Login Page** (`app/(auth)/login/page.tsx`)
  - Login form component (`components/auth/login-form.tsx`)
  - Email input (shadcn Input)
  - Password input with show/hide toggle (shadcn Input)
  - "Remember me" checkbox (shadcn Checkbox)
  - Form validation with React Hook Form + Zod
  - Error messages (shadcn Alert)
  - "Forgot password?" link
  - "Don't have an account? Register" link (for customers)
  - Submit button (shadcn Button with loading state)
  - Auto-route: Admin → /admin/dashboard, Customer → /customer/dashboard
  - Mobile-optimized layout

- [ ] **Registration Page** (`app/(auth)/register/page.tsx`) - **OPTIONAL for customers**
  - Registration form component (`components/auth/register-form.tsx`)
  - Full name input (shadcn Input)
  - Email input with validation
  - Phone number input
  - Password input with strength indicator
  - Confirm password input
  - Terms & conditions checkbox (shadcn Checkbox)
  - Form validation (React Hook Form + Zod)
  - Error messages (shadcn Alert)
  - Success toast (shadcn Toast)
  - "Already have an account? Login" link
  - Auto-redirect to customer dashboard after success
  - Note: "Create account to track your bookings"

- [ ] **Forgot Password Page** (`app/(auth)/forgot-password/page.tsx`)
  - Email input (shadcn Input)
  - Send reset link button (shadcn Button)
  - Success/error messages (shadcn Alert)
  - Back to login link

### 1.6 API Integration (Auth)
- [ ] **Create Customer Model** in Prisma schema (OPTIONAL - for customers who register)
  - id, name, email, password, phone, createdAt, updatedAt
  - Relation to Booking model (nullable customerId in Booking)
- [ ] Run Prisma migration
- [ ] **Update Booking Model** to support both:
  - customerId (nullable - for registered customers)
  - customerName, customerEmail, customerPhone (for public bookings)
- [ ] **Create customer repository** (`src/repositories/customer.repository.ts`)
  - findCustomerByEmail, createCustomer, updateCustomer
- [ ] **Create customer service** (`src/services/customer.service.ts`)
  - register, updateProfile, changePassword
- [ ] **Create auth API endpoints**
  - POST `/api/auth/register` (optional customer registration)
  - POST `/api/auth/login` (unified login - admin or customer)
  - POST `/api/auth/logout`
  - GET `/api/auth/me` (get current user)
- [ ] **Create public booking API**
  - POST `/api/bookings` (public - NO AUTH REQUIRED)
    - Accept: customerName, customerEmail, customerPhone, functionType, date, time, notes
    - Create booking with status PENDING
    - Send emails (customer confirmation + admin notification)
    - Return booking reference
- [ ] **Update booking service** to handle:
  - Public bookings (no customerId)
  - Authenticated customer bookings (with customerId)
- [ ] **Update auth service** to handle both admin and customer login
- [ ] **Create API hooks**
  - `useAuth` hook with login, register, logout mutations
  - `usePublicBooking` hook for public booking form
- [ ] Implement error handling in auth flows
- [ ] Test complete flows:
  - Public booking (no login)
  - Customer registration → login → view bookings
  - Admin login → manage bookings

---

## Phase 2: Customer UI (Week 2-3)

### 2.1 Public Pages (No Authentication Required)
- [ ] **About Page** (`/about`)
  - Hotel history and information
  - Mission/vision
  - Image gallery
  - Contact details
  - Mobile-responsive layout

- [ ] **Gallery Page** (`/gallery`)
  - Photo grid of hotel and events
  - Lightbox for image viewing
  - Categories/filters (optional)
  - Mobile-optimized grid

### 2.2 Customer Layout (For Logged-In Customers Only)
- [ ] **Customer Layout Component** (`/customer/layout`)
  - Top navigation bar
    - Logo
    - Navigation links (Dashboard, My Bookings, New Booking, Profile)
    - User menu dropdown (Profile, Logout)
    - Mobile: Hamburger menu
  - Responsive mobile drawer/sidebar
  - Footer with contact info
  - Breadcrumb navigation

### 2.3 Customer Dashboard (Requires Login)
- [ ] **Dashboard Page** (`/customer/dashboard`)
  - Welcome message with user name
  - Quick stats cards
    - Total bookings
    - Pending bookings
    - Accepted bookings
    - Upcoming events
  - Upcoming bookings list (3 most recent)
  - Quick action buttons
    - Create new booking
    - View all bookings
  - Mobile: Stacked cards layout

### 2.4 My Bookings (Requires Login)
- [ ] **My Bookings Page** (`/customer/bookings`)
  - Bookings list with filters
    - Status filter (All, Pending, Accepted, Rejected)
    - Date range filter
    - Search by event type
  - Booking cards showing:
    - Event date & time
    - Function type
    - Status badge (color-coded)
    - Customer details
    - Admin note (if any)
  - Empty state design
  - Pagination
  - Mobile: Vertical card stack

- [ ] **Booking Details Page** (`/customer/bookings/[id]`)
  - Full booking information
  - Status with visual indicator
  - Timeline/history (created, updated, status changes)
  - Admin notes section
  - Download/print booking confirmation
  - Cancel request option (if pending)
  - Mobile-optimized detail view

### 2.5 Customer Profile (Requires Login)
- [ ] **Profile Page** (`/customer/profile`)
  - View/edit personal information
    - Name
    - Email (read-only)
    - Phone number
  - Change password section
  - Account activity log
  - Delete account option
  - Mobile-optimized forms

---

## Phase 3: Admin UI (Week 4-5)

### 3.1 Admin Layout
- [ ] **Admin Layout Component** (`/admin/layout`)
  - Sidebar navigation (desktop)
    - Dashboard
    - Bookings
    - Function Types
    - Customers
    - Settings
    - Logout
  - Top bar
    - Admin badge/indicator
    - Notifications icon
    - Admin profile dropdown
  - Mobile: Bottom navigation bar + hamburger menu
  - Collapsible sidebar (desktop)

### 3.2 Admin Dashboard
- [ ] **Dashboard Page** (`/admin/dashboard`)
  - **Key Metrics Cards**
    - Total bookings (all time)
    - Pending bookings (requires action)
    - Accepted bookings (upcoming)
    - Rejected bookings
    - Total customers
    - Active function types
  
  - **Charts & Visualizations**
    - Bookings by month (line chart)
    - Bookings by status (pie chart)
    - Popular function types (bar chart)
    - Revenue/bookings trend
  
  - **Recent Activity Feed**
    - Latest bookings (5 most recent)
    - Recent customer registrations
    - Quick action buttons
  
  - **Calendar View**
    - Monthly calendar with booked dates highlighted
    - Click date to see bookings
    - Color-coded by status
  
  - Mobile: Stacked sections with horizontal scroll for charts

### 3.3 Booking Management (Admin View)
- [ ] **Bookings List Page** (`/admin/bookings`)
  - **Advanced Filters**
    - Status (Pending, Accepted, Rejected, All)
    - Date range picker
    - Function type dropdown
    - Customer search
  - **Table View** (Desktop)
    - Columns: Date, Customer, Function Type, Time, Status, Actions
    - Sortable columns
    - Bulk actions (accept/reject multiple)
    - Row selection checkboxes
    - Export to CSV button
  - **Card View** (Mobile)
    - Vertical stack of booking cards
    - Swipe actions (accept/reject)
  - Pagination
  - Search functionality
  - Quick status change buttons

- [ ] **Booking Details Page** (`/admin/bookings/[id]`)
  - **Booking Information Section**
    - Customer details with contact buttons
    - Event details
    - Function type
    - Date & time
    - Additional notes from customer
    - Status timeline
  
  - **Admin Action Panel**
    - Accept booking button (with confirmation)
    - Reject booking button (with reason modal)
    - Admin note textarea (visible to customer)
    - Save notes button
    - Email customer button
  
  - **Related Information**
    - Customer's booking history
    - Conflicting bookings (if any)
  
  - Mobile: Single column layout with sticky action buttons

- [ ] **Booking Status Actions**
  - Accept modal
    - Confirmation message
    - Optional admin note
    - Send confirmation email checkbox
    - Process button
  - Reject modal
    - Required rejection reason
    - Admin note textarea
    - Send rejection email checkbox
    - Process button
  - Success/error toast notifications

### 3.4 Function Type Management
- [ ] **Function Types List Page** (`/admin/function-types`)
  - **Table/Grid View**
    - Name, Slug, Status (Active/Inactive), Booking Count
    - Toggle active/inactive switch
    - Edit button
    - Delete button (with confirmation)
  - Add new function type button
  - Search functionality
  - Filter by status (Active/Inactive)
  - Mobile: Card grid layout

- [ ] **Add/Edit Function Type Modal**
  - Function type name input
  - Slug input (auto-generated, editable)
  - Active status toggle
  - Linked bookings warning (if editing)
  - Save button
  - Cancel button
  - Validation messages

- [ ] **Delete Confirmation Modal**
  - Warning message about linked bookings
  - Booking counts by status
  - "Cannot delete if active bookings" message
  - Confirm/cancel buttons

### 3.5 Customer Management
- [ ] **Customers List Page** (`/admin/customers`)
  - Customer table/cards
    - Name, Email, Phone, Registration Date, Total Bookings
    - View details button
  - Search by name/email
  - Sort options
  - Filter by registration date
  - Export customer list
  - Mobile: Card layout

- [ ] **Customer Details Page** (`/admin/customers/[id]`)
  - Customer information
  - Booking history
  - Account activity
  - Quick actions (send email, block/unblock)
  - Mobile-optimized layout

### 3.6 Admin Settings
- [ ] **Settings Page** (`/admin/settings`)
  - Hotel information editor
    - Name, description, address, phone, email
    - Map link
    - Upload logo/images
  - Working hours configuration
  - Notification preferences
  - Email template customization
  - Change admin password
  - Mobile-friendly forms

---

## Phase 4: Shared Components & Features (Week 6)

### 4.1 Shared Components
- [ ] **Booking Status Badge**
  - Color-coded: Pending (yellow), Accepted (green), Rejected (red)
  - Icons for each status
  - Tooltip with status description

- [ ] **Date & Time Pickers**
  - Calendar component
  - Time selector
  - Mobile-optimized input
  - Disable past dates
  - Highlight unavailable dates

- [ ] **Confirmation Dialogs**
  - Standard confirmation modal
  - Destructive action warning
  - Success/error modals

- [ ] **Toast Notifications**
  - Success toast (green)
  - Error toast (red)
  - Warning toast (yellow)
  - Info toast (blue)
  - Auto-dismiss with custom duration
  - Stack multiple toasts

- [ ] **Loading States**
  - Full-page loader
  - Component skeleton loaders
  - Button loading states
  - Inline spinners

- [ ] **Empty States**
  - No bookings illustration
  - No search results
  - No data available
  - CTA buttons

- [ ] **Error States**
  - 404 page
  - 500 page
  - Network error component
  - Form validation errors
  - API error handling

### 4.2 Responsive Utilities
- [ ] Mobile navigation helper
- [ ] Breakpoint detection hook
- [ ] Touch gesture handlers
- [ ] Responsive table to card converter
- [ ] Mobile-optimized form layouts

### 4.3 Accessibility
- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation support
- [ ] Screen reader optimization
- [ ] Focus management
- [ ] Color contrast validation
- [ ] Alt text for all images

---

## Phase 5: Mobile Optimization & Testing (Week 7)

### 5.1 Mobile-Specific Features
- [ ] Pull-to-refresh on lists
- [ ] Swipe actions on booking cards
- [ ] Bottom sheet modals (instead of center modals)
- [ ] Mobile-optimized date/time pickers
- [ ] Haptic feedback for actions
- [ ] Native-like navigation transitions

### 5.2 Touch Interactions
- [ ] Tap targets minimum 44x44px
- [ ] Swipe gestures for navigation
- [ ] Long-press actions
- [ ] Touch-friendly dropdowns
- [ ] Pinch to zoom on images

### 5.3 Performance Optimization
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading for routes
- [ ] Code splitting
- [ ] Reduce bundle size
- [ ] Optimize fonts loading
- [ ] Service worker for offline support

### 5.4 Testing Checklist
- [ ] **Responsive Testing**
  - iPhone SE (375px)
  - iPhone 12/13/14 (390px)
  - iPhone 14 Plus (428px)
  - Samsung Galaxy S21 (360px)
  - iPad (768px)
  - iPad Pro (1024px)
  - Desktop (1280px, 1920px)

- [ ] **Browser Testing**
  - Chrome (mobile & desktop)
  - Safari (mobile & desktop)
  - Firefox
  - Edge

- [ ] **Functionality Testing**
  - All forms validation
  - API integration
  - Authentication flow
  - Role-based routing
  - Error handling
  - Loading states

- [ ] **Performance Testing**
  - Lighthouse score > 90
  - First Contentful Paint < 2s
  - Time to Interactive < 3.5s
  - Mobile performance optimization

---

## Phase 6: Polish & Launch Preparation (Week 8)

### 6.1 UI Polish
- [ ] Consistent spacing throughout
- [ ] Color palette consistency
- [ ] Typography hierarchy review
- [ ] Animation polish (transitions, hovers)
- [ ] Micro-interactions
- [ ] Loading state improvements
- [ ] Error message improvements

### 6.2 User Experience Enhancements
- [ ] Add helpful tooltips
- [ ] Improve form feedback
- [ ] Add keyboard shortcuts
- [ ] Improve navigation flow
- [ ] Add onboarding tour (optional)
- [ ] Add help/FAQ section

### 6.3 Content & Copy
- [ ] Write all error messages
- [ ] Write all success messages
- [ ] Write empty state messages
- [ ] Write help text for forms
- [ ] Add loading messages
- [ ] Add tooltips text

### 6.4 Security Review
- [ ] XSS prevention check
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] SQL injection prevention (already handled by Prisma)
- [ ] Rate limiting on forms
- [ ] Password requirements enforcement

### 6.5 Documentation
- [ ] User guide for customers
- [ ] Admin manual
- [ ] API documentation (if needed for future)
- [ ] Component documentation (Storybook optional)
- [ ] Deployment guide

---

## Design Specifications

### Color Palette (Tailwind Custom)
```javascript
// Define in tailwind.config.ts
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... hotel brand colors
    600: '#0284c7',
    700: '#0369a1',
  },
  secondary: { /* ... */ },
  accent: { /* ... */ },
}
```

### Typography Scale
- **Headings**: 
  - H1: 2.5rem (mobile: 2rem)
  - H2: 2rem (mobile: 1.75rem)
  - H3: 1.5rem (mobile: 1.25rem)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Breakpoints
- Mobile: 0px - 639px (default)
- Tablet: 640px - 1023px
- Desktop: 1024px+

### Component Variants
- **Buttons**: primary, secondary, outline, ghost, danger
- **Inputs**: text, email, password, tel, date, time, textarea
- **Cards**: default, elevated, outlined
- **Badges**: primary, success, warning, danger, info

---

## Progress Tracking

### Overall Progress by Phase
- [ ] Phase 1: Foundation & Authentication (0/21 tasks)
- [ ] Phase 2: Public & Customer UI (0/18 tasks)
- [ ] Phase 3: Admin UI (0/24 tasks)
- [ ] Phase 4: Shared Components (0/17 tasks)
- [ ] Phase 5: Mobile Optimization (0/12 tasks)
- [ ] Phase 6: Polish & Launch (0/10 tasks)

**Total Tasks**: 102
**Estimated Timeline**: 8 weeks
**Priority**: P0 (Critical) → Phase 1, 2, 3 | P1 (Important) → Phase 4, 5 | P2 (Nice-to-have) → Phase 6

**Key Features**:
- ✅ Public booking (no login required)
- ✅ Optional customer accounts (track bookings)
- ✅ Admin authentication & dashboard
- ✅ Email notifications (customer + admin)
- ✅ Function type management
- ✅ Hotel content management

---

## Technical Decisions

### State Management
- **Local State**: React useState for component-level state
- **Global State**: Context API for auth and theme
- **Server State**: React Query (optional, or direct fetch with SWR)

### Form Handling
- **Library**: React Hook Form + Zod validation
- **Client-side validation**: Real-time with Zod schemas
- **Server-side validation**: Already implemented

### Styling Approach
- **Utility-first**: Tailwind CSS
- **Component variants**: CVA (class-variance-authority) or custom utility
- **Animations**: Tailwind transitions + Framer Motion (optional)

### API Integration
- **Method**: Native fetch API
- **Error handling**: Centralized error handler
- **Loading states**: React hooks
- **Caching**: SWR or React Query (optional)

---

## Success Criteria

### User Experience
- [ ] **Public users** can book without account in < 2 minutes
- [ ] **Customers** can register/login in < 30 seconds (optional)
- [ ] **Logged-in customers** can view booking history easily
- [ ] **Admin** can review and approve booking in < 1 minute
- [ ] 100% mobile responsive (all features work on mobile)
- [ ] No horizontal scrolling on any device
- [ ] All touch targets > 44x44px

### Performance
- [ ] Lighthouse score > 90 on mobile
- [ ] Page load < 2 seconds
- [ ] No layout shift (CLS < 0.1)
- [ ] All forms submit < 500ms

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader compatible
- [ ] Keyboard navigation works everywhere
- [ ] Color contrast ratio > 4.5:1

---

## Risk Mitigation

### Potential Issues
1. **Mobile performance on slow networks**
   - Solution: Optimize images, lazy loading, service worker

2. **Form validation complexity**
   - Solution: Use React Hook Form + Zod, share schemas with backend

3. **Date/time picker mobile UX**
   - Solution: Use native inputs on mobile, custom on desktop

4. **Admin dashboard complexity**
   - Solution: Phase implementation, start with essential features

5. **Authentication persistence**
   - Solution: httpOnly cookies, refresh token mechanism

---

## Notes for Implementation

- Start with mobile design first, then scale up
- Use Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- Test on real devices, not just browser DevTools
- Keep admin and customer UIs consistent where possible
- Prioritize booking flow (most critical feature)
- Keep bundle size small (code splitting)
- Implement progressive enhancement
- Use semantic HTML throughout
- Keep accessibility in mind from the start

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Approve design direction** (color palette, layout)
3. **Start Phase 1** - Foundation & Authentication
4. **Daily standups** to track progress
5. **Weekly demos** to showcase completed features

---

*Last Updated: February 9, 2026*
*Version: 1.0*
