import { createBrowserRouter, Navigate } from 'react-router-dom'

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
import MeetingSettingPage from '@/pages/Meetings/MeetingSettingPage'
import { ROUTES } from '@/shared/constants/routes'
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
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.ONBOARDING,
            element: <OnboardingPage />,
          },
        ],
      },
      {
        element: <RootLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: <HomePage />,
          },
          {
            path: ROUTES.HOME_ALIAS,
            element: <Navigate to={ROUTES.HOME} replace />,
          },
          {
            path: ROUTES.BOOKS,
            element: <BookListPage />,
          },
          {
            path: `${ROUTES.BOOKS}/:id`,
            element: <BookDetailPage />,
          },
          {
            path: ROUTES.GATHERINGS,
            element: <GatheringListPage />,
          },
          {
            path: `${ROUTES.GATHERINGS}/:id`,
            element: <GatheringDetailPage />,
          },
          {
            path: ROUTES.MEETINGS,
            element: <MeetingListPage />,
          },
          {
            path: `${ROUTES.GATHERINGS}/:id/${ROUTES.MEETING_SETTING}`,
            element: <MeetingSettingPage />,
          },
          {
            path: ROUTES.RECORDS,
            element: <RecordListPage />,
          },
        ],
      },
    ],
  },
])
