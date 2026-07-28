import { matchPath } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

type RouteLayoutPolicy = {
  path: string
  end?: boolean
  hideGlobalHeaderOnMobile?: boolean
  shouldApply?: (searchParams: URLSearchParams) => boolean
}

// Route 단위의 레이아웃 정책 관리
const ROUTE_LAYOUT_POLICIES: RouteLayoutPolicy[] = [
  { path: ROUTES.HOME, end: true, hideGlobalHeaderOnMobile: true },
  { path: ROUTES.HOME_ALIAS, end: true, hideGlobalHeaderOnMobile: true },
  { path: ROUTES.GATHERINGS, end: true, hideGlobalHeaderOnMobile: true },
  { path: ROUTES.GATHERING_CREATE, end: true, hideGlobalHeaderOnMobile: true },
  { path: `${ROUTES.GATHERINGS}/:gatheringId`, end: true, hideGlobalHeaderOnMobile: true },
  { path: `${ROUTES.INVITE_BASE}/:invitationCode`, end: true, hideGlobalHeaderOnMobile: true },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/info`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/setting`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/create`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/update`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/pre-opinions/new`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/pre-opinions`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/create`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/detail`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/personal`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: `${ROUTES.GATHERINGS}/:gatheringId/meetings/:meetingId/retrospective/personal/view`,
    end: true,
    hideGlobalHeaderOnMobile: true,
  },
  {
    path: ROUTES.BOOKS,
    end: true,
    hideGlobalHeaderOnMobile: true,
    shouldApply: (searchParams) => searchParams.get('edit') !== 'true',
  },
  { path: `${ROUTES.BOOKS}/:id`, end: true, hideGlobalHeaderOnMobile: true },
  { path: `${ROUTES.BOOKS}/:id/*`, hideGlobalHeaderOnMobile: true },
]

export function shouldHideGlobalHeaderOnMobile(pathname: string, search: string) {
  const searchParams = new URLSearchParams(search)

  return ROUTE_LAYOUT_POLICIES.some((policy) => {
    if (!policy.hideGlobalHeaderOnMobile) return false
    if (!matchPath({ path: policy.path, end: policy.end ?? false }, pathname)) return false

    return policy.shouldApply ? policy.shouldApply(searchParams) : true
  })
}
