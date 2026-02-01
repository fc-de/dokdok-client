import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  BookDetailPage,
  BookListPage,
  ComponentGuidePage,
  GatheringDetailPage,
  GatheringListPage,
  HomePage,
  LoginPage,
  MeetingCreatePage,
  MeetingListPage,
  MeetingSettingPage,
  OnboardingPage,
  RecordListPage,
} from '@/pages'
import { ROUTES } from '@/shared/constants/routes'
import { AuthLayout, MainLayout, RootLayout } from '@/shared/layout'

import { PrivateRoute } from './PrivateRoute'

export const router = createBrowserRouter([
  {
    path: '/component-guide',
    element: <ComponentGuidePage />,
  },
  {
    element: <RootLayout />,
    children: [
      // 인증 페이지 (GNB 없음)
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
      // 인증 필요한 페이지
      {
        element: <PrivateRoute />,
        children: [
          // 온보딩 (GNB 없음)
          {
            element: <AuthLayout />,
            children: [
              {
                path: ROUTES.ONBOARDING,
                element: <OnboardingPage />,
              },
            ],
          },
          // 메인 페이지들 (GNB 있음)
          {
            element: <MainLayout />,
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
                path: `${ROUTES.GATHERINGS}/:id${ROUTES.MEETING_SETTING}`,
                element: <MeetingSettingPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:id${ROUTES.MEETING_CREATE}`,
                element: <MeetingCreatePage />,
              },
              {
                path: ROUTES.RECORDS,
                element: <RecordListPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])
