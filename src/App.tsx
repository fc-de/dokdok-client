import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { setupInterceptors } from '@/api'
import { queryClient } from '@/shared/lib/tanstack-query'
import { GlobalModalHost, Sonner, TooltipProvider } from '@/shared/ui'

import { router } from './routes'

// API 인터셉터 초기화 (앱 시작 시 한 번만 실행)
setupInterceptors()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <GlobalModalHost />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
