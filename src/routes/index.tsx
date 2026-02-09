import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  BookDetailPage,
  BookListPage,
  BookReviewHistoryPage,
  ComponentGuidePage,
  CreateGatheringPage,
  GatheringDetailPage,
  GatheringListPage,
  HomePage,
  InvitePage,
  LoginPage,
  MeetingCreatePage,
  MeetingDetailPage,
  MeetingSettingPage,
  OnboardingPage,
  PreOpinionListPage,
  RecordListPage,
} from '@/pages'
import { ROUTES } from '@/shared/constants'
import { AuthLayout, FullWidthLayout, MainLayout, RootLayout } from '@/shared/layout'

import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/component-guide',
    element: <ComponentGuidePage />,
  },
  {
    element: <RootLayout />,
    children: [
      // 비로그인 사용자만 접근 가능한 페이지
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
              },
            ],
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
                path: `${ROUTES.BOOKS}/:id/reviews`,
                element: <BookReviewHistoryPage />,
              },
              {
                path: ROUTES.GATHERINGS,
                element: <GatheringListPage />,
              },
              {
                path: ROUTES.GATHERING_CREATE,
                element: <CreateGatheringPage />,
              },
            ],
          },
          // 전체 너비 레이아웃 페이지 (GNB 있음, 컨텐츠 패딩 없음)
          {
            element: <FullWidthLayout />,
            children: [
              {
                path: `${ROUTES.GATHERINGS}/:id`,
                element: <GatheringDetailPage />,
              },
            ],
          },
          // 메인 페이지들 계속 (GNB 있음)
          {
            element: <MainLayout />,
            children: [
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId`,
                element: <MeetingDetailPage />,
              },
              {
                path: ROUTES.PRE_OPINIONS(':gatheringId', ':meetingId'),
                element: <PreOpinionListPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/setting`,
                element: <MeetingSettingPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:id/meetings/create`,
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
      // 로그인/비로그인 모두 접근 가능한 페이지 (GNB 있음)
      {
        element: <MainLayout />,
        children: [
          {
            path: `${ROUTES.INVITE_BASE}/:invitationCode`,
            element: <InvitePage />,
          },
        ],
      },
    ],
  },
])
