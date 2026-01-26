import { createBrowserRouter } from 'react-router-dom'

import {
  AuthLayout,
  BookDetailPage,
  BookListPage,
  ComponentGuidePage,
  GatheringDetailPage,
  GatheringListPage,
  HomePage,
  LoginPage,
  MeetingListPage,
  OnboardingPage,
  RecordListPage,
} from '@/pages'
import { RootLayout } from '@/shared/layout'

import { PrivateRoute } from './PrivateRoute'

export const router = createBrowserRouter([
  {
    path: '/component-guide',
    element: <ComponentGuidePage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/books',
            element: <BookListPage />,
          },
          {
            path: '/books/:id',
            element: <BookDetailPage />,
          },
          {
            path: '/gatherings',
            element: <GatheringListPage />,
          },
          {
            path: '/gatherings/:id',
            element: <GatheringDetailPage />,
          },
          {
            path: '/meetings',
            element: <MeetingListPage />,
          },
          {
            path: '/records',
            element: <RecordListPage />,
          },
        ],
      },
    ],
  },
])
