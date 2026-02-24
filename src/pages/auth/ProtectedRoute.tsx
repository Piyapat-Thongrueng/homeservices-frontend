import { useRequireAuth } from "@/contexts/useRequireAuth"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {

  const { loading, isAuthenticated } =
    useRequireAuth()

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  }

  if (!isAuthenticated) {

    return null

  }

  return <>{children}</>

}