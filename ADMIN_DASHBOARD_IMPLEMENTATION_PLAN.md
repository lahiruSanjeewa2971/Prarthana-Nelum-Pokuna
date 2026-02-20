# Admin Dashboard - Complete Implementation Plan

> **📌 Last Updated**: February 19, 2026
> 
> **✅ Pre-existing Components Found**: 
> - `middleware.ts` - Route protection fully configured
> - `src/lib/jwt.ts` - JWT utilities complete (signToken, verifyToken, decodeToken)
> - `src/services/auth.service.ts` - Login service with bcrypt password hashing
> - `src/middleware/auth.ts` - requireAuth() HOF for protecting routes
> - `src/repositories/admin.repository.ts` - Complete admin database operations
> - `src/app/api/admin/login/route.ts` - Login endpoint ✅
> - `src/app/api/admin/logout/route.ts` - Logout endpoint ✅
> - `src/app/api/admin/profile/route.ts` - Verify/profile endpoint ✅
> - `src/app/api/admin/bookings/` - Full bookings CRUD API ✅
> - `src/app/api/admin/function-types/` - Full function types CRUD API ✅
> - `src/contexts/AuthContext.tsx` - Client-side auth state management ✅
> - `src/hooks/useAuth.ts` - Auth hook for easy context access ✅
> - `src/app/page.tsx` - Landing page with server-side auth check ✅
> - `src/lib/auth-helpers.ts` - Server-side auth helper functions ✅
> - `src/components/auth/LoginForm.tsx` - Login form with validation ✅
> - `src/components/auth/LoginModal.tsx` - Login modal wrapper ✅
> - `src/components/layout/Navbar.tsx` - Updated with login button ✅
> - `src/components/ui/dialog.tsx` - shadcn/ui dialog component ✅
> 
> **⏱️ Time Saved**: ~14-15 hours
> **📊 Updated Estimate**: 23-24 hours (down from 38-40 hours)

---

## 📊 Implementation Status Summary

| Component | Backend API | Frontend UI | Status |
|-----------|-------------|-------------|--------|
| **Authentication** | ✅ Complete | ✅ Complete | 100% Done |
| **Route Protection** | ✅ Complete | ✅ Complete | 100% Done |
| **Admin Layout** | N/A | ⚠️ Sidebar + Header | 0% Done |
| **Bookings Dashboard** | ✅ Complete | ⚠️ Table + Filters | 50% Done |
| **Function Types** | ✅ Complete | ⚠️ Table + Modal | 50% Done |
| **Hotel Settings** | ⚠️ API needed | ⚠️ Form needed | 0% Done |
| **Services/Repos** | ✅ Complete | N/A | 100% Done |

**Overall Progress**: 🟩🟩🟩🟩🟩�⬜⬜⬜⬜ **~50% Complete**

**Next Priority Steps**:
1. ✅ ~~Create `AuthContext.tsx` + `useAuth.ts` hook~~ **DONE**
2. ✅ ~~Build admin login modal with form validation~~ **DONE**
3. ⚠️ Create admin layout with sidebar (3 hours) **NEXT**
4. ⚠️ Build dashboard with bookings table (3 hours)
5. ⚠️ Build function types management page (2 hours)

---

## 📋 Project Overview
Comprehensive admin dashboard for Prarthana Nelum Pokuna hotel booking system. Includes authentication flow, booking management with CRUD operations, function type management, and hotel settings management.

---

## 🎯 Goals & Requirements

### Primary Goals
- ✅ Secure admin authentication with JWT
- ✅ Auto-redirect authenticated users from landing page
- ✅ Full booking management with status filters
- ✅ Function type CRUD operations
- ✅ Hotel settings management
- ✅ Responsive sidebar navigation
- ✅ Real-time data updates

### User Flow Requirements

**Landing Page Behavior:**
```
1. User visits "/" (landing page)
   ↓
2. Check for auth token (httpOnly cookie)
   ↓
3a. Token exists + valid → Redirect to /admin/dashboard
3b. Token missing/expired → Show landing page
   ↓
4. User clicks "Login" button
   ↓
5. Login modal/page appears
   ↓
6. User enters credentials
   ↓
7. Submit → POST /api/admin/login
   ↓
8. Success → Set JWT cookie → Redirect to /admin/dashboard
```

### Admin Dashboard Features
- **Dashboard Page**: View all bookings with filters (pending, accepted, rejected)
- **Booking CRUD**: Create, Read, Update, Delete bookings
- **Function Management**: Full CRUD for FunctionType model
- **Settings**: View and edit Hotel information
- **Responsive Design**: Mobile-friendly sidebar (drawer on mobile)
- **Role-based Access**: Admin-only routes with middleware protection

---

## 🏗️ File Structure

```
src/
├── app/
│   ├── page.tsx (modify - add auth check)
│   ├── admin/
│   │   ├── layout.tsx (NEW - admin layout with sidebar)
│   │   ├── login/
│   │   │   └── page.tsx (NEW - login page)
│   │   ├── dashboard/
│   │   │   └── page.tsx (NEW - bookings dashboard)
│   │   ├── function-types/
│   │   │   └── page.tsx (NEW - function types CRUD)
│   │   └── settings/
│   │       └── page.tsx (NEW - hotel settings)
│   └── api/
│       ├── admin/
│       │   ├── login/
│       │   │   └── route.ts (NEW - login endpoint)
│       │   ├── verify/
│       │   │   └── route.ts (NEW - verify token)
│       │   └── logout/
│       │       └── route.ts (NEW - logout endpoint)
│       ├── bookings/
│       │   ├── route.ts (modify - add CRUD operations)
│       │   └── [id]/
│       │       └── route.ts (NEW - single booking operations)
│       ├── function-types/
│       │   ├── route.ts (modify - add CRUD)
│       │   └── [id]/
│       │       └── route.ts (NEW - single function type operations)
│       └── hotel/
│           └── route.ts (NEW - hotel settings CRUD)
│
├── components/
│   ├── admin/
│   │   ├── Sidebar.tsx (NEW - left sidebar navigation)
│   │   ├── MobileSidebar.tsx (NEW - mobile drawer)
│   │   ├── AdminHeader.tsx (NEW - top header with logout)
│   │   ├── BookingTable.tsx (NEW - bookings data table)
│   │   ├── BookingFilters.tsx (NEW - status filters)
│   │   ├── BookingDialog.tsx (NEW - create/edit booking modal)
│   │   ├── BookingDeleteDialog.tsx (NEW - delete confirmation)
│   │   ├── FunctionTypeTable.tsx (NEW - function types table)
│   │   ├── FunctionTypeDialog.tsx (NEW - create/edit function type)
│   │   ├── SettingsForm.tsx (NEW - hotel settings form)
│   │   └── StatsCards.tsx (NEW - dashboard statistics)
│   ├── auth/
│   │   ├── LoginForm.tsx (NEW - login form component)
│   │   └── LoginModal.tsx (NEW - modal wrapper)
│   └── ui/
│       ├── dialog.tsx (NEW - shadcn dialog)
│       ├── table.tsx (NEW - shadcn table)
│       ├── dropdown-menu.tsx (NEW - shadcn dropdown)
│       └── sheet.tsx (NEW - shadcn sheet for mobile)
│
├── contexts/
│   └── AuthContext.tsx (NEW - global auth state)
│
├── hooks/
│   ├── useAuth.ts (NEW - auth hook)
│   ├── useBookings.ts (NEW - bookings data hook)
│   ├── useFunctionTypes.ts (NEW - function types hook)
│   └── useHotel.ts (NEW - hotel settings hook)
│
├── lib/
│   ├── auth/
│   │   └── cookies.ts (NEW - cookie helpers)
│   ├── jwt.ts (✅ EXISTS - JWT utilities already complete)
│   └── api/
│       ├── bookings.ts (NEW - bookings API client)
│       ├── function-types.ts (NEW - function types API client)
│       └── hotel.ts (NEW - hotel API client)
│
├── middleware.ts (NEW - route protection)
│
└── types/
    └── admin.ts (NEW - admin-specific types)
```

---

## 📝 Implementation Phases

### **Phase 0: Pre-existing Components** ✅

**Already Complete**:
- ✅ `middleware.ts` - Route protection configured
- ✅ `src/lib/jwt.ts` - JWT utilities (signToken, verifyToken, decodeToken)
- ✅ `src/services/auth.service.ts` - Login, password verification, bcrypt hashing
- ✅ `src/middleware/auth.ts` - requireAuth() HOF, getAdminFromRequest()
- ✅ `src/repositories/admin.repository.ts` - All admin database operations
- ✅ `src/app/api/admin/login/route.ts` - POST login with cookie & validation
- ✅ `src/app/api/admin/logout/route.ts` - POST logout clears cookie
- ✅ `src/app/api/admin/profile/route.ts` - GET protected profile (verify endpoint)
- ✅ `src/contexts/AuthContext.tsx` - Client-side auth state management
- ✅ `src/hooks/useAuth.ts` - Auth hook for easy context access
- ✅ `src/app/api/admin/bookings/route.ts` - GET bookings with filters & pagination
- ✅ `src/app/api/admin/bookings/[id]/route.ts` - GET, PATCH (update status)
- ✅ `src/app/api/admin/function-types/route.ts` - GET all, POST create
- ✅ `src/app/api/admin/function-types/[id]/route.ts` - GET, PATCH, DELETE
- ✅ `src/app/api/admin/function-types/[id]/status/route.ts` - PATCH toggle active
- ✅ Booking & Function Type services + repositories
- ✅ Prisma schema with Admin, Booking, FunctionType, Hotel models
- ✅ Database connection setup
- ✅ Error handling utilities
- ✅ Response builder utilities

**Time Saved**: ~13-14 hours

---

### **Phase 1: Authentication Infrastructure** ✅ COMPLETE

#### Step 1.1: JWT Utilities ✅ COMPLETE
**File**: `src/lib/jwt.ts`

**Status**: ✅ **Fully implemented and working!**

**Implemented Functions**:
- ✅ `signToken(payload: JwtPayload): string` - Creates JWT tokens
- ✅ `verifyToken(token: string): DecodedToken | null` - Verifies and decodes tokens
- ✅ `decodeToken(token: string): DecodedToken | null` - Decodes without verification
- ✅ JWT_SECRET and JWT_EXPIRES_IN environment variables configured
- ✅ Error handling and logging

---

#### Step 1.2: Auth Service ✅ COMPLETE
**File**: `src/services/auth.service.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Functions**:
- ✅ `login(credentials)` - Validates email/password, returns JWT token
- ✅ `verifyPassword(password, hash)` - bcrypt password comparison
- ✅ `hashPassword(password)` - bcrypt hashing with salt rounds: 10
- ✅ Uses `adminRepository.findAdminByEmail()`
- ✅ Uses `signToken()` from jwt.ts
- ✅ Proper error handling with AuthorizationError

---

#### Step 1.3: Auth Middleware ✅ COMPLETE
**File**: `src/middleware/auth.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Functions**:
- ✅ `requireAuth(handler)` - Higher-order function to protect API routes
- ✅ Extracts token from `auth-token` cookie
- ✅ Verifies token using `verifyToken()`
- ✅ Attaches decoded admin to request as `AuthenticatedRequest`
- ✅ Returns proper 401 errors for unauthorized requests
- ✅ `getAdminFromRequest(request)` - Helper to extract admin from any request

---

#### Step 1.4: Admin Repository ✅ COMPLETE
**File**: `src/repositories/admin.repository.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Functions**:
- ✅ `findAdminByEmail(email, options)` - Find admin with optional password hash
- ✅ `findAdminById(adminId, options)` - Find admin by ID
- ✅ `createAdmin(data)` - Create new admin
- ✅ `updateAdminPassword(adminId, hash)` - Update admin password
- ✅ Proper TypeScript types (AdminWithPassword, AdminWithoutPassword)

---

#### Step 1.5: Login API Endpoint ✅ COMPLETE
**File**: `src/app/api/admin/login/route.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Features**:
- ✅ POST endpoint
- ✅ Zod validation (email, password)
- ✅ Calls `auth.service.login()`
- ✅ Sets httpOnly cookie named `auth-token`
- ✅ Cookie config: httpOnly, secure in production, sameSite: strict, maxAge: 1 hour
- ✅ Returns admin data + redirect URL (`/admin/dashboard`)
- ✅ Proper error handling with `handleApiError()`

---

#### Step 1.6: Logout Endpoint ✅ COMPLETE
**File**: `src/app/api/admin/logout/route.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Features**:
- ✅ POST endpoint
- ✅ Clears `auth-token` cookie
- ✅ Sets maxAge: 0 to expire immediately
- ✅ Returns success response

---

#### Step 1.7: Verify Token Endpoint ✅ COMPLETE
**File**: `src/app/api/admin/profile/route.ts`

**Status**: ✅ **Fully implemented!** (serves as verify endpoint)

**Implemented Features**:
- ✅ GET endpoint
- ✅ Protected with `requireAuth()` middleware
- ✅ Returns authenticated admin data (id, email)
- ✅ Returns 401 if token invalid/expired

---

#### Step 1.8: Cookie Helpers (OPTIONAL)
**File**: `src/lib/auth/cookies.ts`

**Status**: ⚠️ **OPTIONAL** - Cookie operations are currently handled directly in route handlers

**Current Implementation**:
- Login route sets cookie directly: `response.cookies.set('auth-token', ...)`
- Logout route clears cookie directly: `response.cookies.set('auth-token', '', { maxAge: 0 })`
- Middleware reads cookie: `request.cookies.get('auth-token')`

**If you want to create a utility** (optional, 0.5 hours):
```typescript
// Helper functions for consistency
- setAuthCookie(response, token): NextResponse
- getAuthCookie(request): string | null  
- clearAuthCookie(response): NextResponse
```

**Skip This Step** - The current direct approach works perfectly fine!

---

#### Step 1.9: Auth Context Provider ✅ COMPLETE
**File**: `src/contexts/AuthContext.tsx`

**Status**: ✅ **Fully implemented!**

**Implemented Features**:
- ✅ React Context with AuthProvider component
- ✅ State management: admin, isAuthenticated, isLoading, error
- ✅ `login(email, password)` - Calls POST /api/admin/login, redirects to dashboard
- ✅ `logout()` - Calls POST /api/admin/logout, redirects to landing page
- ✅ `refreshAuth()` - Verifies token with GET /api/admin/profile
- ✅ Auto-verification on mount with useEffect
- ✅ Proper error handling and logging
- ✅ Router integration for redirects
- ✅ TypeScript types (Admin, AuthState, AuthContextType)

**Implemented State**:
```typescript
interface AuthState {
  admin: { id: string; email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Implemented Functions**:
- ✅ `login()` - Authenticates admin, stores state, redirects
- ✅ `logout()` - Clears auth state, redirects to home
- ✅ `refreshAuth()` - Verifies current auth token
- ✅ Auto-refresh on component mount

---

#### Step 1.10: useAuth Hook ✅ COMPLETE
**File**: `src/hooks/useAuth.ts`

**Status**: ✅ **Fully implemented!**

**Implemented Features**:
- ✅ Simple hook wrapper around useAuthContext
- ✅ Proper error handling if used outside AuthProvider
- ✅ TypeScript type inference
- ✅ JSDoc documentation with usage example

**Returns**:
```typescript
{
  admin: { id: string; email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}
```

**Usage Example**:
```typescript
const { admin, isAuthenticated, isLoading, login, logout } = useAuth();
```

---

### **Phase 2: Route Protection & Landing Page Auth Check** ✅ COMPLETE

#### Step 2.1: Middleware for Route Protection ✅ COMPLETE
**File**: `middleware.ts`

**Status**: ✅ **Pre-existing - properly configured!**

**Implementation**:
- ✅ Protects all `/admin/*` routes (except `/admin/login`)
- ✅ Verifies JWT token from cookie named `auth-token`
- ✅ Redirects unauthenticated users to `/admin/login`
- ✅ Auto-redirects authenticated users from login page to dashboard
- ✅ Preserves intended destination with redirect query param
- ✅ Uses `verifyToken` function from `@/lib/jwt`

---

#### Step 2.2: Landing Page Auth Check ✅ COMPLETE
**File**: `src/app/page.tsx`

**Status**: ✅ **Already implemented!**

**Implementation Features**:
- ✅ Server-side auth check with `getServerSideAuth()`
- ✅ Redirects authenticated admins to `/admin/dashboard`
- ✅ Shows landing page for non-authenticated users
- ✅ ISR caching with 1-hour revalidation

**Helper Function**: `src/lib/auth-helpers.ts` ✅ Complete
- ✅ Extracts token from `auth-token` cookie
- ✅ Verifies token with JWT utility
- ✅ Returns decoded admin or null

---

#### Step 2.3: Login Button with Modal ✅ COMPLETE
**File**: `src/components/layout/Navbar.tsx` (modified)

**Status**: ✅ **Fully implemented!**

**Implementation Features**:
- ✅ Login button on desktop navigation
- ✅ Login button on mobile navigation
- ✅ Opens LoginModal on click
- ✅ Changed from Link to button for better UX
- ✅ Mobile menu closes before opening modal
- ✅ Desktop: "Admin Login" text button
- ✅ Mobile: Full-width button in drawer

---

#### Step 2.4: Login Form Component ✅ COMPLETE
**File**: `src/components/auth/LoginForm.tsx`

**Status**: ✅ **Fully implemented!**

**Implementation Features**:
- ✅ Email + Password fields with proper labels
- ✅ React Hook Form integration
- ✅ Zod validation schema (email format, password min 6 chars)
- ✅ `useAuth()` hook integration for login
- ✅ Loading state with spinner animation
- ✅ Field-level error display (red borders + messages)
- ✅ Server error display (error banner)
- ✅ Disabled state during submission
- ✅ Auto-complete attributes for better UX
- ✅ Full TypeScript types
- ✅ Callbacks: `onSuccess`, `onError`

---

#### Step 2.5: Login Modal Component ✅ COMPLETE
**File**: `src/components/auth/LoginModal.tsx`

**Status**: ✅ **Fully implemented!**

**Implementation Features**:
- ✅ Radix UI Dialog component (shadcn/ui)
- ✅ Modal with overlay backdrop
- ✅ Close on successful login (via `onSuccess` callback)
- ✅ Escape key to close
- ✅ Click outside to close
- ✅ Focus trap for accessibility
- ✅ Responsive width (max-w-md)
- ✅ Header with title and description
- ✅ Wraps `LoginForm` component
- ✅ Smooth animations (fade + zoom)

---

#### Step 2.6: Login Page (Alternative to Modal) ⏭️ SKIPPED
**File**: `src/app/admin/login/page.tsx`

**Status**: ⏭️ **Skipped - using modal approach instead**

**Decision**: Implemented modal-based login (Steps 2.3-2.5) for better user experience. A dedicated login page is not needed for this project.

---

### **Phase 3: Admin Layout & Sidebar** (3 hours)

#### Step 3.1: Admin Layout
**File**: `src/app/admin/layout.tsx`

**Purpose**: Wrap all admin pages with sidebar + header

**Structure**:
```typescript
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

#### Step 3.2: Sidebar Component
**File**: `src/components/admin/Sidebar.tsx`

**Purpose**: Left navigation sidebar

**Navigation Items**:
```typescript
const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Function Types',
    href: '/admin/function-types',
    icon: Calendar
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];
```

**Features**:
- Active route highlighting
- Icon + label
- Hover states
- Collapse/expand (optional)
- Logo at top
- Logout button at bottom

**Desktop Design**:
```
┌──────────────┐
│ [Logo]       │
│              │
│ Dashboard ●  │ ← Active
│ Functions    │
│ Settings     │
│              │
│              │
│              │
│ [Logout]     │
└──────────────┘
```

---

#### Step 3.3: Mobile Sidebar (Drawer)
**File**: `src/components/admin/MobileSidebar.tsx`

**Purpose**: Drawer sidebar for mobile/tablet

**Features**:
- Hamburger menu button
- Slide-in animation
- Overlay backdrop
- Same nav items as desktop
- Auto-close on navigation

---

#### Step 3.4: Admin Header
**File**: `src/components/admin/AdminHeader.tsx`

**Purpose**: Top header bar

**Contents**:
```
┌────────────────────────────────────────┐
│ [☰] Breadcrumbs       [Admin ▼] [🔔] │
└────────────────────────────────────────┘
```

**Features**:
- Hamburger menu (mobile only)
- Breadcrumbs navigation
- Admin dropdown menu (profile, logout)
- Notifications icon (future)

---

### **Phase 4: Dashboard - Bookings Management** (3 hours)

> **📌 Backend APIs**: ✅ **COMPLETE** - All booking APIs are implemented!
> **🎨 Frontend**: ⚠️ **TO DO** - Need to build UI components

**What's Already Done**:
- ✅ `GET /api/admin/bookings` - List with filters (status, dateRange, email, functionTypeId) + pagination
- ✅ `GET /api/admin/bookings/:id` - Get single booking details
- ✅ `PATCH /api/admin/bookings/:id` - Update status (PENDING/ACCEPTED/REJECTED) + admin note
- ✅ Full booking service layer implemented
- ✅ Zod validation on all endpoints
- ✅ Protected with `requireAuth()` middleware

**What's Left to Build** (3 hours):
- Component: StatsCards.tsx
- Component: BookingFilters.tsx  
- Component: BookingTable.tsx
- Component: BookingDialog.tsx
- Component: BookingDeleteDialog.tsx
- Hook: useBookings.ts (React Query)
- Page: /admin/dashboard/page.tsx

#### Step 4.1: Dashboard Page Layout
**File**: `src/app/admin/dashboard/page.tsx`

**Purpose**: Main admin dashboard

**Structure**:
```
┌───────────────────────────────────────┐
│ Dashboard                             │
├───────────────────────────────────────┤
│ [Stats Cards: Total | Pending | etc] │
├───────────────────────────────────────┤
│ [Filters: All | Pending | Accepted...│
├───────────────────────────────────────┤
│ [Bookings Table]                      │
│ ┌─────┬──────┬──────┬────────────┐   │
│ │ ID  │ Name │ Date │ Actions    │   │
│ ├─────┼──────┼──────┼────────────┤   │
│ │ ... │ ... │ ...  │ [Edit][Del]│   │
│ └─────┴──────┴──────┴────────────┘   │
└───────────────────────────────────────┘
```

---

#### Step 4.2: Statistics Cards
**File**: `src/components/admin/StatsCards.tsx`

**Purpose**: Display key metrics

**Metrics**:
1. **Total Bookings**: Count of all bookings
2. **Pending**: Count of PENDING bookings
3. **Accepted**: Count of ACCEPTED bookings
4. **Rejected**: Count of REJECTED bookings

**Card Design**:
```
┌──────────────────┐
│ 🎫 Total         │
│                  │
│ 247              │
│                  │
│ +12 from last    │
│ month            │
└──────────────────┘
```

**Data Fetching**:
```typescript
const stats = await getBookingStats();

interface BookingStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}
```

---

#### Step 4.3: Booking Filters
**File**: `src/components/admin/BookingFilters.tsx`

**Purpose**: Filter bookings by status

**Filter Options**:
```typescript
const filters = [
  { label: 'All', value: 'all', count: 247 },
  { label: 'Pending', value: 'pending', count: 15 },
  { label: 'Accepted', value: 'accepted', count: 200 },
  { label: 'Rejected', value: 'rejected', count: 32 }
];
```

**UI Design**:
```
┌─────┬─────────┬──────────┬──────────┐
│ All │ Pending │ Accepted │ Rejected │
│ 247 │   15    │   200    │    32    │
└─────┴─────────┴──────────┴──────────┘
    ▲ Active
```

**Behavior**:
- Update URL search params: `?status=pending`
- Trigger table refetch
- Persist filter on page refresh

---

#### Step 4.4: Bookings Table
**File**: `src/components/admin/BookingTable.tsx`

**Purpose**: Display bookings in table format

**Columns**:
1. ID (short format)
2. Customer Name
3. Email
4. Phone
5. Function Type
6. Event Date
7. Time (Start - End)
8. Status Badge
9. Actions (View, Edit, Delete)

**Table Design**:
```
┌────────┬──────────┬───────────┬────────┬────────┬────────────┐
│ ID     │ Customer │ Email     │ Func   │ Date   │ Actions    │
├────────┼──────────┼───────────┼────────┼────────┼────────────┤
│ #1234  │ John Doe │ john@...  │Wedding │ Feb 25 │ [👁][✏][🗑]│
│ PENDING│          │           │        │        │            │
├────────┼──────────┼───────────┼────────┼────────┼────────────┤
│ #1235  │ Jane Sm  │ jane@...  │Birthday│ Mar 10 │ [👁][✏][🗑]│
│ACCEPTED│          │           │        │        │            │
└────────┴──────────┴───────────┴────────┴────────┴────────────┘
```

**Features**:
- Sortable columns
- Pagination (10, 25, 50 per page)
- Status badge with color coding
  - Pending: Yellow
  - Accepted: Green
  - Rejected: Red
- Action buttons (view, edit, delete)
- Responsive (card view on mobile)

---

#### Step 4.5: Booking Detail Dialog
**File**: `src/components/admin/BookingDialog.tsx`

**Purpose**: View/Edit booking details in modal

**Modes**:
1. **View Mode**: Read-only display
2. **Edit Mode**: Editable form
3. **Create Mode**: Empty form

**Form Fields**:
```typescript
- Customer Name (text)
- Customer Email (email)
- Customer Phone (tel)
- Function Type (select)
- Event Date (date picker)
- Start Time (time picker)
- End Time (time picker)
- Additional Notes (textarea)
- Status (select: Pending, Accepted, Rejected)
- Admin Note (textarea)
```

**Actions**:
- Save Changes
- Cancel
- Quick Actions:
  - Accept Booking (status → ACCEPTED)
  - Reject Booking (status → REJECTED)

---

#### Step 4.6: Delete Confirmation Dialog
**File**: `src/components/admin/BookingDeleteDialog.tsx`

**Purpose**: Confirm booking deletion

**Design**:
```
┌─────────────────────────────┐
│ ⚠️  Delete Booking          │
│                             │
│ Are you sure you want to    │
│ delete this booking?        │
│                             │
│ Customer: John Doe          │
│ Event: Wedding              │
│ Date: Feb 25, 2026          │
│                             │
│ This action cannot be       │
│ undone.                     │
│                             │
│ [Cancel]  [Delete Booking]  │
└─────────────────────────────┘
```

---

#### Step 4.7: Bookings API - CRUD Operations ✅ COMPLETE

**Status**: ✅ **All booking APIs are implemented!**

**File**: `src/app/api/admin/bookings/route.ts`

**✅ GET /api/admin/bookings**
```typescript
Implemented Query params:
- status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
- eventDateGte?: string (ISO date)
- eventDateLte?: string (ISO date)
- customerEmail?: string
- functionTypeId?: string
- page?: number (default: 1)
- limit?: number (default: 20, max: 100)

Implemented Response:
{
  success: true,
  data: {
    bookings: Booking[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

**File**: `src/app/api/admin/bookings/[id]/route.ts`

**✅ GET /api/admin/bookings/:id**
- Protected with requireAuth()
- Returns single booking details
- Throws NotFoundError if booking doesn't exist

**✅ PATCH /api/admin/bookings/:id**
```typescript
Implemented Body:
{
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  adminNote?: string (max 1000 chars)
}

Implemented Response:
{
  success: true,
  data: {
    booking: UpdatedBooking
  }
}
```

**Note**: Full booking update (customerName, email, etc.) not implemented yet. Currently only status + adminNote updates are supported. Add full update if needed later.

---

#### Step 4.8: useBookings Hook
**File**: `src/hooks/useBookings.ts`

**Purpose**: React Query hook for bookings data

**Functions**:
```typescript
export function useBookings(filters: BookingFilters) {
  // Fetch bookings with filters
  // Return: { data, isLoading, error, refetch }
}

export function useBooking(id: string) {
  // Fetch single booking
}

export function useCreateBooking() {
  // Mutation: create booking
}

export function useUpdateBooking() {
  // Mutation: update booking
}

export function useDeleteBooking() {
  // Mutation: delete booking
}

export function useBookingStats() {
  // Fetch statistics
}
```

**React Query Configuration**:
```typescript
- Cache time: 5 minutes
- Stale time: 1 minute
- Refetch on window focus: true
- Auto-retry on error: 3 times
```

---

### **Phase 5: Function Types Management** (2 hours)

> **📌 Backend APIs**: ✅ **COMPLETE** - All function type APIs are implemented!
> **🎨 Frontend**: ⚠️ **TO DO** - Need to build UI components

**What's Already Done**:
- ✅ `GET /api/admin/function-types` - List all (includes inactive)
- ✅ `POST /api/admin/function-types` - Create new function type
- ✅ `GET /api/admin/function-types/:id` - Get single function type
- ✅ `PATCH /api/admin/function-types/:id` - Update function type (name, slug, isActive)
- ✅ `DELETE /api/admin/function-types/:id` - Delete (checks for active bookings first)
- ✅ `PATCH /api/admin/function-types/:id/status` - Toggle active/inactive
- ✅ Full function type service layer
- ✅ Zod validation on all endpoints
- ✅ Protected with `requireAuth()` middleware

**What's Left to Build** (2 hours):
- Component: FunctionTypeTable.tsx
- Component: FunctionTypeDialog.tsx (create/edit modal)
- Hook: useFunctionTypes.ts (React Query)
- Page: /admin/function-types/page.tsx

#### Step 5.1: Function Types Page
**File**: `src/app/admin/function-types/page.tsx`

**Purpose**: CRUD interface for function types

**Layout**:
```
┌───────────────────────────────────────┐
│ Function Types       [+ New Function] │
├───────────────────────────────────────┤
│ [Function Types Table]                │
│ ┌──────┬────────┬───────┬──────────┐ │
│ │ Name │ Price  │ Active│ Actions  │ │
│ ├──────┼────────┼───────┼──────────┤ │
│ │Wedding│$5,000 │ ✓     │[Edit][Del│ │
│ │Birthday│$2,000│ ✓     │[Edit][Del│ │
│ └──────┴────────┴───────┴──────────┘ │
└───────────────────────────────────────┘
```

---

#### Step 5.2: Function Types Table
**File**: `src/components/admin/FunctionTypeTable.tsx`

**Purpose**: Display function types

**Columns**:
1. Name
2. Slug (auto-generated)
3. Price (formatted as currency)
4. Description (truncated)
5. Active Status (toggle switch)
6. Actions (Edit, Delete)

**Features**:
- Inline active/inactive toggle
- Sort by name or price
- Quick edit modal
- Delete with confirmation

---

#### Step 5.3: Function Type Dialog
**File**: `src/components/admin/FunctionTypeDialog.tsx`

**Purpose**: Create/Edit function type

**Form Fields**:
```typescript
- Name (text, required)
- Slug (text, auto-generated from name)
- Price (number, required, min: 0)
- Description (textarea, optional)
- Active Status (toggle, default: true)
```

**Validation**:
```typescript
const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  isActive: z.boolean()
});
```

**Slug Auto-generation**:
```typescript
// "Wedding Package" → "wedding-package"
slug = name.toLowerCase().replace(/\s+/g, '-');
```

---

#### Step 5.4: Function Types API ✅ COMPLETE

**Status**: ✅ **All function type APIs are implemented!**

**File**: `src/app/api/admin/function-types/route.ts`

**✅ GET /api/admin/function-types**
```typescript
Implemented Features:
- Returns ALL function types (including inactive)
- Protected with requireAuth()
- Returns count of function types

Response:
{
  success: true,
  data: {
    functionTypes: FunctionType[],
    count: number
  }
}
```

**✅ POST /api/admin/function-types**
```typescript
Implemented Body:
{
  name: string (required, 1-100 chars),
  slug?: string (optional, max 100 chars),
  isActive?: boolean (optional)
}

Implemented Response:
{
  success: true,
  data: {
    functionType: FunctionType
  }
}
```

**File**: `src/app/api/admin/function-types/[id]/route.ts`

**✅ GET /api/admin/function-types/:id**
- Protected with requireAuth()
- Returns single function type
- Throws NotFoundError if not found

**✅ PATCH /api/admin/function-types/:id**
```typescript
Implemented Body:
{
  name?: string (1-100 chars),
  slug?: string (max 100 chars),
  isActive?: boolean
}
```

**✅ DELETE /api/admin/function-types/:id**
- Protected with requireAuth()
- Checks for active bookings before deletion
- Returns 400 error if bookings exist: "Cannot delete function type with active bookings"

**File**: `src/app/api/admin/function-types/[id]/status/route.ts`

**✅ PATCH /api/admin/function-types/:id/status**
```typescript
Implemented Body:
{
  isActive: boolean
}

Purpose: Toggle active/inactive status
```

---

#### Step 5.5: useFunctionTypes Hook
**File**: `src/hooks/useFunctionTypes.ts`

**Purpose**: React Query hook for function types

**Functions**:
```typescript
export function useFunctionTypes(includeInactive = false) {
  // Fetch all function types
}

export function useFunctionType(id: string) {
  // Fetch single function type
}

export function useCreateFunctionType() {
  // Mutation: create
}

export function useUpdateFunctionType() {
  // Mutation: update
}

export function useDeleteFunctionType() {
  // Mutation: delete
}
```

---

### **Phase 6: Hotel Settings Management** (3 hours)

#### Step 6.1: Settings Page
**File**: `src/app/admin/settings/page.tsx`

**Purpose**: Manage hotel information

**Layout**:
```
┌───────────────────────────────────────┐
│ Hotel Settings                        │
├───────────────────────────────────────┤
│ [Settings Form]                       │
│                                       │
│ Hotel Name                            │
│ ┌───────────────────────────────┐    │
│ │ Prarthana Nelum Pokuna       │    │
│ └───────────────────────────────┘    │
│                                       │
│ Description                           │
│ ┌───────────────────────────────┐    │
│ │ Luxury hotel venue for...     │    │
│ │                               │    │
│ └───────────────────────────────┘    │
│                                       │
│ [More fields...]                      │
│                                       │
│ [Cancel]  [Save Changes]              │
└───────────────────────────────────────┘
```

---

#### Step 6.2: Settings Form
**File**: `src/components/admin/SettingsForm.tsx`

**Purpose**: Edit hotel information

**Form Fields** (from Hotel model):
```typescript
- Name (text, required)
- Description (textarea, optional)
- Address (text, optional)
- Phone (tel, optional)
- Email (email, optional)
- Map Link (url, optional - Google Maps embed URL)
```

**Validation**:
```typescript
const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string()
    .regex(/^[0-9\s\-\+\(\)]+$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email').optional(),
  map_link: z.string().url('Invalid URL').optional()
});
```

**Features**:
- Auto-save draft (optional)
- Discard changes confirmation
- Success toast on save
- Preview map link (iframe)

---

#### Step 6.3: Hotel API
**File**: `src/app/api/hotel/route.ts` (NEW)

**GET /api/hotel**
```typescript
Response:
{
  hotel: Hotel | null
}

Note: There should only be ONE hotel record
```

**PUT /api/hotel** (Create or Update)
```typescript
Body: {
  name: string,
  description?: string,
  address?: string,
  phone?: string,
  email?: string,
  map_link?: string
}

Response:
{
  success: true,
  hotel: Hotel
}
```

**Logic**:
```typescript
// Upsert: Update if exists, create if not
const hotel = await prisma.hotel.upsert({
  where: { id: existingId || 'default-id' },
  update: data,
  create: data
});
```

---

#### Step 6.4: useHotel Hook
**File**: `src/hooks/useHotel.ts`

**Purpose**: React Query hook for hotel settings

**Functions**:
```typescript
export function useHotel() {
  // Fetch hotel data
  return useQuery(['hotel'], fetchHotel);
}

export function useUpdateHotel() {
  // Mutation: update hotel
  return useMutation(updateHotel, {
    onSuccess: () => {
      queryClient.invalidateQueries(['hotel']);
      toast.success('Settings saved!');
    }
  });
}
```

---

### **Phase 7: UI Components & Styling** (3 hours)

> **📌 Some shadcn/ui components**: ✅ **Already installed**

**Already Installed Components**:
- ✅ button.tsx
- ✅ input.tsx
- ✅ label.tsx
- ✅ select.tsx
- ✅ textarea.tsx
- ✅ calendar.tsx
- ✅ popover.tsx
- ✅ tabs.tsx

#### Step 7.1: Install Additional shadcn/ui Components (0.5 hours)

**Still Need to Install**:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add card
npx shadcn-ui@latest add toast
```

---

#### Step 7.2: Status Badge Component
**File**: `src/components/admin/StatusBadge.tsx`

**Purpose**: Color-coded status indicators

**Variants**:
```typescript
PENDING: Yellow background + dark yellow text
ACCEPTED: Green background + dark green text
REJECTED: Red background + dark red text
```

---

#### Step 7.3: Empty State Component
**File**: `src/components/ui/EmptyState.tsx`

**Purpose**: Show when no data

**Design**:
```
┌───────────────────────┐
│                       │
│   [📭 Icon]           │
│                       │
│   No bookings yet     │
│                       │
│   Bookings will       │
│   appear here once    │
│   customers submit.   │
│                       │
│   [Create Booking]    │
│                       │
└───────────────────────┘
```

---

#### Step 7.4: Loading Skeleton
**File**: `src/components/ui/Skeleton.tsx`

**Purpose**: Loading placeholders

**Usage**:
- Table loading: Skeleton rows
- Form loading: Skeleton inputs
- Card loading: Skeleton cards

---

#### Step 7.5: Responsive Design Utilities

**Breakpoints**:
```typescript
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Sidebar Behavior**:
- Desktop (≥ 1024px): Fixed sidebar visible
- Tablet/Mobile (< 1024px): Drawer sidebar hidden by default

**Table Responsiveness**:
- Desktop: Full table
- Mobile: Card layout (stack columns vertically)

---

### **Phase 8: Service & Repository Layer Updates** ✅ COMPLETE (0 hours)

> **📌 Status**: ✅ **All service and repository layers are already implemented!**

**What's Already Done**:

#### ✅ Booking Service & Repository - COMPLETE
**Files**: 
- `src/services/booking.service.ts`
- `src/repositories/booking.repository.ts`

**Implemented Functions**:
- ✅ `listBookings(filters)` - Fetch bookings with filters & pagination
- ✅ `getBookingById(id)` - Get single booking
- ✅ `updateBookingStatus(id, status, adminNote)` - Update status
- ✅ Repository has all CRUD operations

---

#### ✅ Function Type Service & Repository - COMPLETE
**Files**:
- `src/services/function-type.service.ts`
- `src/repositories/function-type.repository.ts`

**Implemented Functions**:
- ✅ `listFunctionTypes(includeInactive)` - List all function types
- ✅ `getFunctionTypeById(id)` - Get single function type
- ✅ `createFunctionType(data)` - Create new
- ✅ `updateFunctionType(id, data)` - Update
- ✅ `deleteFunctionType(id)` - Delete (with booking check)
- ✅ `toggleFunctionTypeStatus(id, isActive)` - Toggle active status
- ✅ Repository has all CRUD operations

---

#### ⚠️ Hotel Service & Repository - TO DO (Phase 6)
**Files**: Need to create
- `src/services/hotel.service.ts` 
- `src/repositories/hotel.repository.ts`

**Functions Needed**:
- `getHotel()` - Fetch hotel info
- `upsertHotel(data)` - Create or update hotel

**Note**: This will be done in Phase 6 (Hotel Settings Management)

---

**No additional work needed for bookings and function types!**

---

### **Phase 9: Testing & Quality Assurance** (4 hours)

#### Step 9.1: Unit Tests

**Authentication Tests**:
```typescript
✓ JWT token generation
✓ JWT token verification
✓ Token expiration handling
✓ Cookie setting/clearing
```

**Service Tests**:
```typescript
✓ Booking CRUD operations
✓ Function Type CRUD operations
✓ Hotel upsert logic
✓ Validation error handling
```

---

#### Step 9.2: Integration Tests

**API Route Tests**:
```typescript
✓ POST /api/admin/login (valid credentials)
✓ POST /api/admin/login (invalid credentials)
✓ GET /api/admin/verify (valid token)
✓ GET /api/admin/verify (expired token)
✓ PATCH /api/bookings/:id (update booking)
✓ DELETE /api/bookings/:id (delete booking)
✓ POST /api/function-types (create)
✓ DELETE /api/function-types/:id (with bookings - should fail)
✓ PUT /api/hotel (upsert)
```

---

#### Step 9.3: E2E Tests (Optional - Playwright/Cypress)

**User Flows**:
```typescript
✓ Login as admin → View dashboard
✓ Filter bookings by status
✓ Create new booking
✓ Edit existing booking
✓ Delete booking
✓ Create function type
✓ Update hotel settings
✓ Logout
```

---

#### Step 9.4: Accessibility Testing

**Checklist**:
```
✓ Keyboard navigation works
✓ Focus indicators visible
✓ Screen reader labels present
✓ Form errors announced
✓ Modal focus trap works
✓ Color contrast meets WCAG AA
✓ ARIA attributes correct
```

---

#### Step 9.5: Responsive Testing

**Devices to Test**:
- Desktop (1920x1080, 1366x768)
- Tablet (iPad: 1024x768)
- Mobile (iPhone 12: 390x844, Galaxy S21: 360x800)

**Test Cases**:
- Sidebar collapses on mobile
- Tables convert to cards on mobile
- Forms are scrollable and usable
- Modals fit screen on small devices

---

### **Phase 10: Security & Performance** (2 hours)

> **🔒 Core Security**: ✅ **Already implemented!**

**Already Implemented Security**:
- ✅ **Password Hashing**: bcrypt with salt rounds: 10
- ✅ **JWT Authentication**: signToken with JWT_SECRET from env
- ✅ **httpOnly Cookies**: Prevents XSS attacks
- ✅ **Secure Cookie Flag**: Enabled in production
- ✅ **SameSite**: Set to 'strict' for CSRF protection
- ✅ **Token Expiration**: 1 hour expiry
- ✅ **Zod Validation**: All API inputs validated
- ✅ **Authorization Errors**: Proper error messages without leaking info

#### Step 10.1: Additional Security Measures (1 hour)

**Authentication Security**:
```typescript
✓ Password hashing with bcrypt (salt rounds: 10)
✓ JWT secret from environment variable
✓ httpOnly cookies (prevent XSS)
✓ Secure flag in production
✓ CSRF protection (SameSite: Lax)
✓ Token expiration (7 days)
✓ Logout clears cookie
```

**Authorization**:
```typescript
✓ Middleware protects admin routes
✓ API routes verify admin token
✓ Check admin role before mutations
✓ Rate limiting on login endpoint (prevent brute force)
```

**Input Validation**:
```typescript
✓ Zod schemas on all API inputs
✓ Sanitize user inputs (prevent SQL injection)
✓ Validate file uploads (if implemented)
✓ Max length limits on text fields
```

---

#### Step 10.2: Performance Optimization

**Database**:
```typescript
✓ Indexes on frequently queried fields:
  - Booking.status
  - Booking.eventDate
  - FunctionType.slug
  - Admin.email

✓ Pagination on large lists
✓ Select only needed fields
✓ Use includes efficiently (avoid N+1 queries)
```

**Caching**:
```typescript
✓ React Query cache (5 min stale time)
✓ Next.js ISR for landing page
✓ API response caching headers
✓ Prisma query result caching
```

**Bundle Size**:
```typescript
✓ Dynamic imports for admin routes
✓ Tree-shaking unused code
✓ Lazy load modals
✓ Optimize images
✓ Code splitting
```

**Loading States**:
```typescript
✓ Skeleton loaders for tables
✓ Spinner for buttons
✓ Optimistic updates for mutations
✓ Debounce search inputs
```

---

### **Phase 11: Error Handling & User Feedback** (2 hours)

#### Step 11.1: Error Boundaries
**File**: `src/app/admin/error.tsx`

**Purpose**: Catch and display admin errors gracefully

---

#### Step 11.2: Toast Notifications
**File**: `src/contexts/ToastContext.tsx`

**Usage**:
```typescript
const { toast } = useToast();

// Success
toast.success('Booking updated successfully!');

// Error
toast.error('Failed to delete function type');

// Warning
toast.warning('This action cannot be undone');

// Info
toast.info('New booking received');
```

---

#### Step 11.3: Form Validation Errors

**Display Strategy**:
- Inline errors below fields (red text)
- Error summary at top of form
- Scroll to first error on submit

---

#### Step 11.4: API Error Handling

**Consistent Error Response**:
```typescript
{
  success: false,
  error: {
    message: "User-friendly error message",
    code: "ERROR_CODE",
    details?: any
  }
}
```

**Client Handling**:
```typescript
try {
  await updateBooking(id, data);
  toast.success('Updated!');
} catch (error) {
  if (error.code === 'BOOKING_NOT_FOUND') {
    toast.error('Booking no longer exists');
  } else {
    toast.error('Something went wrong');
  }
}
```

---

### **Phase 12: Documentation & Deployment** (2 hours)

#### Step 12.1: README Updates

**Add Sections**:
```markdown
## Admin Dashboard

### First-Time Setup
1. Create admin account (run seed script)
2. Access login at /admin/login
3. Default credentials: admin@hotel.com / password

### Admin Features
- Dashboard: View and manage bookings
- Function Types: Configure event types and pricing
- Settings: Update hotel information

### Environment Variables
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

---

#### Step 12.2: Admin User Seed Script
**File**: `prisma/seed.ts` (modify)

**Add Admin Creation**:
```typescript
import bcrypt from 'bcrypt';

async function main() {
  // Create default admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@pranelum.com' },
    update: {},
    create: {
      email: 'admin@pranelum.com',
      passwordHash
    }
  });
  
  // Create default hotel
  await prisma.hotel.upsert({
    where: { id: 'default-hotel-id' },
    update: {},
    create: {
      id: 'default-hotel-id',
      name: 'Prarthana Nelum Pokuna',
      description: 'Premier venue for unforgettable events',
      address: '123 Lotus Lane, Colombo',
      phone: '+94 11 234 5678',
      email: 'info@pranelum.com'
    }
  });
  
  console.log('✅ Admin user created');
  console.log('✅ Hotel created');
}
```

**Run Seed**:
```bash
npx prisma db seed
```

---

#### Step 12.3: Deployment Checklist

```
Environment:
✓ DATABASE_URL configured
✓ JWT_SECRET generated (strong random string)
✓ JWT_EXPIRES_IN set (7d)
✓ NODE_ENV=production

Security:
✓ CORS configured
✓ Rate limiting enabled
✓ Secure cookies enabled
✓ HTTPS enforced

Database:
✓ Migrations applied (prisma migrate deploy)
✓ Admin user seeded
✓ Hotel record seeded
✓ Backups configured

Build:
✓ npm run build succeeds
✓ No TypeScript errors
✓ No linting errors
✓ Bundle size acceptable

Testing:
✓ All tests pass
✓ Manual smoke test
✓ Admin login works
✓ CRUD operations work
```

---

## 📅 Implementation Timeline

| Phase | Task | Time | Cumulative | Status |
|-------|------|------|------------|--------|
| 0 | **Pre-existing Components** ✅ | **-12h saved** | **0h** | ✅ Done |
| 1 | Authentication Infrastructure | 0 hours | 0h | ✅ Complete |
| 2 | Route Protection & Login Modal | 0 hours | 0h | ✅ Complete |
| 3 | Admin Layout & Sidebar | 3 hours | 3h | ⚠️ TODO |
| 4 | Dashboard - Bookings Management | 3 hours | 6h | ✅ APIs Done, UI TODO |
| 5 | Function Types Management | 2 hours | 8h | ✅ APIs Done, UI TODO |
| 6 | Hotel Settings Management | 3 hours | 11h | ⚠️ TODO |
| 7 | UI Components & Styling | 3 hours | 14h | ⚠️ TODO |
| 8 | Service & Repository Updates | 0 hours | 14h | ✅ Done |
| 9 | Testing & QA | 4 hours | 18h | ⚠️ TODO |
| 10 | Security & Performance | 2 hours | 20h | ⚠️ TODO |
| 11 | Error Handling & Feedback | 2 hours | 22h | ⚠️ TODO |
| 12 | Documentation & Deployment | 2 hours | 24h | ⚠️ TODO |

**Total Estimated Time**: 23-24 hours (saved 14-15 hours due to existing APIs & infrastructure)

**Breakdown**:
- ✅ Backend Complete: Authentication APIs, Auth Context, Bookings API, Function Types API, Login Modal
- ⚠️ Frontend Needed: Admin layout, Dashboard UI, Settings
- ⚠️ Polish Needed: Testing, Security hardening, Documentation

**Core Features Remaining** (Phases 3-6): ~9-10 hours
**Polish & Quality** (Phases 7-9): ~9 hours
**Optimization & Docs** (Phases 10-12): ~6 hours

---

## 🎯 Success Metrics

### Functional Requirements:
- ✅ Admin can login with email/password
- ✅ Landing page redirects authenticated admins to dashboard
- ✅ Bookings visible with status filters (pending, accepted, rejected)
- ✅ All CRUD operations work for bookings
- ✅ All CRUD operations work for function types
- ✅ Hotel settings can be updated
- ✅ Sidebar navigation works on all devices
- ✅ Logout clears session and redirects to landing

### Technical Requirements:
- ✅ JWT authentication with secure cookies
- ✅ Middleware protects admin routes
- ✅ API endpoints validated with Zod
- ✅ Database operations through services layer
- ✅ Type-safe end-to-end (TypeScript)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessible UI (WCAG AA compliant)

### Performance Requirements:
- ✅ Dashboard loads in < 2 seconds
- ✅ All mutations complete in < 500ms
- ✅ No layout shift on navigation
- ✅ Smooth animations (60 FPS)
- ✅ No console errors or warnings

### User Experience:
- ✅ Intuitive navigation
- ✅ Clear error messages
- ✅ Confirmation before destructive actions
- ✅ Success feedback on actions
- ✅ Loading states prevent confusion

---

## 🔄 Future Enhancements (Post-MVP)

### Phase 13 (Future):
1. **Customer Management**:
   - Customer accounts (optional registration)
   - Customer booking history
   - Customer profiles

2. **Advanced Filtering**:
   - Date range picker
   - Search by customer name/email
   - Export bookings to CSV/PDF

3. **Email Notifications**:
   - Email admin on new booking
   - Email customer on Accept/Reject
   - Email templates customization

4. **Dashboard Analytics**:
   - Charts (bookings over time)
   - Revenue projections
   - Popular function types

5. **Calendar View**:
   - Interactive calendar
   - Booking timeline
   - Availability checking

6. **Multi-Admin Support**:
   - Admin roles (super admin, moderator)
   - Activity logs
   - Admin management page

7. **Notifications**:
   - Browser push notifications
   - Real-time updates (WebSocket)
   - Notification center

---

## 📝 Notes & Considerations

### Design Decisions:

**Why JWT over Sessions?**
- ✅ Stateless (no server-side storage)
- ✅ Works well with Next.js API routes
- ✅ Easy to scale
- ✅ httpOnly cookies for security

**Why React Query?**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error retry logic
- ✅ Less boilerplate than Redux

**Why shadcn/ui?**
- ✅ Customizable components
- ✅ Built on Radix UI (accessible)
- ✅ Tailwind styling
- ✅ Copy-paste approach (no package bloat)

**Why Sidebar Layout?**
- ✅ Industry standard for admin panels
- ✅ Clear navigation structure
- ✅ Scalable (easy to add new pages)
- ✅ Responsive (drawer on mobile)

### Assumptions:

1. Single hotel (one Hotel record in DB)
2. Single admin initially (can add more later)
3. No payment processing in MVP
4. English language only (i18n future)
5. No file uploads yet (images for gallery future)

### Risk Mitigation:

**Security Risks**:
- ✅ bcrypt password hashing
- ✅ httpOnly cookies (XSS protection)
- ✅ Zod validation (injection protection)
- ✅ Rate limiting on login
- ✅ HTTPS in production

**Performance Risks**:
- ✅ Pagination prevents large data load
- ✅ React Query caching reduces API calls
- ✅ Database indexes for fast queries
- ✅ Lazy loading for modals

**Usability Risks**:
- ✅ Confirmation dialogs prevent mistakes
- ✅ Success/error toasts provide feedback
- ✅ Loading states prevent double-submits
- ✅ Responsive design works on all devices

---

## ✅ Definition of Done

**Phase 1-6 (Core Features) Complete When**:
- ✅ Admin can login from landing page
- ✅ Landing page redirects authenticated admins
- ✅ Sidebar navigation works (desktop + mobile)
- ✅ Dashboard displays bookings with filters
- ✅ Bookings can be created, edited, deleted
- ✅ Function types can be created, edited, deleted
- ✅ Hotel settings can be updated
- ✅ All API endpoints work correctly
- ✅ Zero TypeScript errors
- ✅ No console errors in browser

**Full Implementation Complete When**:
- All above +
- ✅ UI is polished and responsive
- ✅ Form validation is comprehensive
- ✅ Error handling is graceful
- ✅ Loading states are present
- ✅ Success/error toasts work
- ✅ Tests pass (unit + integration)
- ✅ Accessibility audit passes
- ✅ Performance benchmarks met
- ✅ Documentation is complete
- ✅ Deployment checklist passed

---

**Ready to start implementation?** 

Recommended approach:
1. Start with **Phase 1** (Authentication) - Foundation
2. Then **Phase 2** (Landing page auth check) - User flow
3. Then **Phase 3** (Layout & Sidebar) - Structure
4. Then **Phase 4** (Dashboard) - Core feature
5. Continue sequentially through remaining phases

Each phase builds on the previous, so sequential implementation is recommended! 🚀
