import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { type ApiError, ErrorCode } from '@/api'
import {
  GatheringBookshelfSection,
  GatheringDetailHeader,
  GatheringDetailInfo,
  GatheringMeetingSection,
  useGatheringDetail,
  useToggleFavorite,
} from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { useScrollCollapse } from '@/shared/hooks'
import { useGlobalModalStore } from '@/store/globalModalStore'

export default function GatheringDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { openAlert, openError } = useGlobalModalStore()

  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0

  // 스크롤 상태 (헤더 접힘 여부)
  const isHeaderCollapsed = useScrollCollapse({ collapseThreshold: 100, expandThreshold: 20 })

  // 모임 상세 조회
  const { data: gathering, isLoading, error } = useGatheringDetail(gatheringId)

  // 즐겨찾기 토글
  const { mutate: toggleFavorite } = useToggleFavorite()

  // 즐겨찾기 핸들러
  const handleFavoriteToggle = useCallback(() => {
    if (!gathering) return

    toggleFavorite(gatheringId, {
      onError: (error: ApiError) => {
        if (error.is(ErrorCode.FAVORITE_LIMIT_EXCEEDED)) {
          openAlert('알림', '즐겨찾기는 최대 4개까지만 등록할 수 있습니다.')
        } else {
          openAlert('오류', '즐겨찾기 변경에 실패했습니다.')
        }
      },
    })
  }, [gatheringId, gathering, toggleFavorite, openAlert])

  // 설정 버튼 핸들러
  const handleSettingsClick = useCallback(() => {
    navigate(ROUTES.GATHERING_SETTING(gatheringId))
  }, [navigate, gatheringId])

  // 초대 링크 복사 핸들러
  const handleInviteClick = useCallback(async () => {
    if (!gathering?.invitationLink) return

    try {
      const inviteUrl = `${window.location.origin}/invite/${gathering.invitationLink}`
      await navigator.clipboard.writeText(inviteUrl)
      openAlert('알림', '초대 링크가 복사되었습니다.')
    } catch {
      openAlert('오류', '링크 복사에 실패했습니다.')
    }
  }, [gathering, openAlert])

  // 유효하지 않은 ID 처리
  useEffect(() => {
    if (gatheringId === 0) {
      openError('오류', '잘못된 모임 ID입니다.', () => {
        navigate(ROUTES.GATHERINGS, { replace: true })
      })
    }
  }, [gatheringId, navigate, openError])

  // API 에러 처리
  useEffect(() => {
    if (error) {
      openError('오류', '모임 정보를 불러오는데 실패했습니다.', () => {
        // 브라우저 히스토리가 없으면 모임 목록으로 이동
        if (window.history.length > 1) {
          navigate(-1)
        } else {
          navigate(ROUTES.GATHERINGS, { replace: true })
        }
      })
    }
  }, [error, navigate, openError])

  // 로딩 상태
  if (isLoading || !gathering) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-grey-600 typo-subtitle2">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="pb-medium">
      {/* 헤더 (sticky, 전체 너비) */}
      <GatheringDetailHeader
        gatheringName={gathering.gatheringName}
        isFavorite={gathering.isFavorite}
        currentUserRole={gathering.currentUserRole}
        isSticky={isHeaderCollapsed}
        onFavoriteToggle={handleFavoriteToggle}
        onSettingsClick={handleSettingsClick}
        onInviteClick={handleInviteClick}
      />

      {/* 컨텐츠 영역 (패딩 적용) */}
      <div className="w-full mx-auto max-w-layout-max px-layout-padding flex flex-col gap-xlarge">
        {/* 모임 정보 (헤더 접힘 시 숨김) */}
        <GatheringDetailInfo
          daysFromCreation={gathering.daysFromCreation}
          totalMeetings={gathering.totalMeetings}
          totalMembers={gathering.totalMembers}
          members={gathering.members}
          description={gathering.description}
        />

        {/* 약속 섹션 */}
        <GatheringMeetingSection
          gatheringId={gatheringId}
          currentUserRole={gathering.currentUserRole}
        />

        {/* 모임 책장 섹션 */}
        <GatheringBookshelfSection gatheringId={gatheringId} />
      </div>
    </div>
  )
}
