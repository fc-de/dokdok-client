/**
 * @file meetingQueryKeys.ts
 * @description 약속 관련 Query Key Factory
 */

import type { GetMeetingApprovalsParams } from '@/features/meetings/meetings.types'

/**
 * Query Key Factory
 *
 * @description
 * 약속 관련 Query Key를 일관되게 관리하기 위한 팩토리 함수
 */
export const meetingQueryKeys = {
  all: ['meetings'] as const,

  // 약속 승인 리스트 관련
  approvals: () => [...meetingQueryKeys.all, 'approvals'] as const,
  approvalLists: () => [...meetingQueryKeys.approvals(), 'list'] as const,
  approvalList: (params: GetMeetingApprovalsParams) =>
    [...meetingQueryKeys.approvalLists(), params] as const,
  approvalCounts: () => [...meetingQueryKeys.approvals(), 'count'] as const,
  approvalCount: (gatheringId: number, status: GetMeetingApprovalsParams['status']) =>
    [...meetingQueryKeys.approvalCounts(), gatheringId, status] as const,
}
