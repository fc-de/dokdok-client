import { Settings } from 'lucide-react'
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
import { MobileBottomNavigation, MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store/globalModalStore'

/** 모바일 상단바 아이콘 버튼 스타일 */
const MOBILE_HEADER_ICON_BUTTON =
  'flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

export default function GatheringDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()

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
          showErrorToast('즐겨찾기는 최대 4개까지만 등록할 수 있습니다.')
        } else {
          showErrorToast('즐겨찾기 변경에 실패했습니다.')
        }
      },
    })
  }, [gatheringId, gathering, toggleFavorite])

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
      showToast('초대 링크가 복사되었습니다.')
    } catch {
      showErrorToast('링크 복사에 실패했습니다.')
    }
  }, [gathering])

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
    return <Spinner height="full" />
  }

  const isLeader = gathering.currentUserRole === 'LEADER'

  return (
    <MobileLayoutFrame
      variant="header"
      // 모바일 상단바: 스크롤로 헤더가 접히면 모임명 노출 (공백은 상단바 유지용)
      title={isHeaderCollapsed ? gathering.gatheringName : ' '}
      leftAction={{ type: 'back', to: ROUTES.GATHERINGS }}
      headerActionSlot={
        <div className="relative z-10 -mr-2.5 flex items-center">
          {isLeader && (
            <button
              type="button"
              className={MOBILE_HEADER_ICON_BUTTON}
              onClick={handleSettingsClick}
              aria-label="모임 설정"
            >
              <Settings aria-hidden className="size-6" />
            </button>
          )}
        </div>
      }
      contentClassName="max-lg:pb-[calc(var(--spacing-mobile-bottom-nav-height)+env(safe-area-inset-bottom))]"
    >
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
        <div className="w-full mx-auto max-w-layout-max px-layout-padding flex flex-col gap-xlarge max-lg:gap-8 max-lg:px-5">
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

      {/* 모바일 하단 GNB (fixed, lg 이상에서는 숨김) */}
      <MobileBottomNavigation />
    </MobileLayoutFrame>
  )
}
