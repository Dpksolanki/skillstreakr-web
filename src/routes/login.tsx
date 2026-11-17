import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return <h1 className="pt-10 text-center text-2xl font-semibold">Login (coming soon)</h1>
}
