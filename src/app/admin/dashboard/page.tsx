import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { redirect } from 'next/navigation';

/**
 * Admin Dashboard Page
 * 
 * Protected route - users must be authenticated to access.
 * Middleware handles initial redirect, but this provides server-side verification.
 */
export default async function AdminDashboard() {
  // Double-check authentication on server component
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    redirect('/admin/login');
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">
                Prarthana Nelum Pokuna
              </h1>
              <span className="text-sm text-muted-foreground">Admin Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {decoded.email}
              </span>
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-destructive hover:underline"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Welcome back, <span className="font-medium">{decoded.email}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Pending Bookings
              </h3>
              <p className="text-3xl font-bold text-foreground">-</p>
              <p className="text-xs text-muted-foreground mt-2">
                Awaiting review
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Active Function Types
              </h3>
              <p className="text-3xl font-bold text-foreground">-</p>
              <p className="text-xs text-muted-foreground mt-2">
                Currently available
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-foreground">-</p>
              <p className="text-xs text-muted-foreground mt-2">
                All time
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/admin/bookings"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Manage Bookings</h4>
                  <p className="text-sm text-muted-foreground">
                    View and manage all booking requests
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              <a
                href="/admin/function-types"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Function Types</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage event types and pricing
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">System Status:</span> All systems operational
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
