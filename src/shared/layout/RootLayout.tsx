import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">독크독크</h1>
            {/* TODO: Add navigation links */}
          </div>
          <div>{/* TODO: Add user menu */}</div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 독크독크. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
