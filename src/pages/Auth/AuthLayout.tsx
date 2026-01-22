import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">독크독크</h1>
          <p className="mt-2 text-gray-600">독서모임 기록 서비스</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
