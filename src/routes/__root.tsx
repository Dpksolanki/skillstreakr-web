import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Anything put here is available in every route's loader (e.g. to prefetch data).
interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-background">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <Link to="/" className="font-bold">
            SkillStreakr
          </Link>
          <Link to="/" className="text-sm [&.active]:font-semibold">
            Home
          </Link>
          <Link to="/login" className="text-sm [&.active]:font-semibold">
            Login
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </div>
  )
}

function NotFound() {
  return <p className="text-center text-muted-foreground">Page not found.</p>
}
