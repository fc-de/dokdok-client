import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  BookDetailPage,
  BookListPage,
  BookReviewHistoryPage,
  ComponentGuidePage,
  CreateGatheringPage,
  GatheringDetailPage,
  GatheringListPage,
  GatheringSettingPage,
  HomePage,
  InvitePage,
  LandingPage,
  LoginPage,
  MeetingCreatePage,
  MeetingDetailPage,
  MeetingRetrospectiveCreatePage,
  MeetingRetrospectiveDetailPage,
  MeetingRetrospectivePage,
  MeetingSettingPage,
  OnboardingPage,
  PreOpinionListPage,
  PreOpinionWritePage,
  RecordListPage,
  TopicCreatePage,
} from '@/pages'
import { ROUTES } from '@/shared/constants'
import { AuthLayout, FullWidthLayout, LandingLayout, MainLayout, RootLayout } from '@/shared/layout'

import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/component-guide',
    element: <ComponentGuidePage />,
  },
  {
    element: <LandingLayout />,
    children: [{ path: ROUTES.LANDING, element: <LandingPage /> }],
  },
  {
    element: <RootLayout />,
    children: [
      // 비로그인 사용자만 접근 가능
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
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
            children: [{ path: ROUTES.ONBOARDING, element: <OnboardingPage /> }],
          },

          // GNB + 콘텐츠 패딩
          {
            element: <MainLayout />,
            children: [
              { path: ROUTES.HOME, element: <HomePage /> },
              { path: ROUTES.HOME_ALIAS, element: <Navigate to={ROUTES.HOME} replace /> },
              { path: ROUTES.BOOKS, element: <BookListPage /> },
              { path: ROUTES.GATHERINGS, element: <GatheringListPage /> },
              { path: ROUTES.GATHERING_CREATE, element: <CreateGatheringPage /> },
              { path: ROUTES.RECORDS, element: <RecordListPage /> },
            ],
          },

          // GNB + 콘텐츠 패딩 없음, 페이지에서 자체 래퍼 관리
          {
            element: <FullWidthLayout />,
            children: [
              // 도서
              { path: `${ROUTES.BOOKS}/:id`, element: <BookDetailPage /> },
              { path: `${ROUTES.BOOKS}/:id/reviews`, element: <BookReviewHistoryPage /> },
              // 모임
              { path: `${ROUTES.GATHERINGS}/:id`, element: <GatheringDetailPage /> },
              { path: `${ROUTES.GATHERINGS}/:id/settings`, element: <GatheringSettingPage /> },
              // 약속
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId`,
                element: <MeetingDetailPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/pre-opinions/new`,
                element: <PreOpinionWritePage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/topic-create`,
                element: <TopicCreatePage />,
              },
              {
                path: ROUTES.PRE_OPINIONS(':gatheringId', ':meetingId'),
                element: <PreOpinionListPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective`,
                element: <MeetingRetrospectivePage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/create`,
                element: <MeetingRetrospectiveCreatePage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/detail`,
                element: <MeetingRetrospectiveDetailPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/setting`,
                element: <MeetingSettingPage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/create`,
                element: <MeetingCreatePage />,
              },
              {
                path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/update`,
                element: <MeetingCreatePage />,
              },
            ],
          },
        ],
      },

      // 로그인/비로그인 모두 접근 가능 (GNB + 콘텐츠 패딩)
      {
        element: <MainLayout />,
        children: [{ path: `${ROUTES.INVITE_BASE}/:invitationCode`, element: <InvitePage /> }],
      },
    ],
  },
])
