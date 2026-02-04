import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { type ApiError, ErrorCode } from '@/api'
import {
  EmptyState,
  GatheringCard,
  useFavoriteGatherings,
  useGatherings,
  useToggleFavorite,
} from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { useInfiniteScroll } from '@/shared/hooks'
import { Button, Tabs, TabsList, TabsTrigger } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

type TabValue = 'all' | 'favorites'

export default function GatheringListPage() {
  const navigate = useNavigate()
  const { openAlert } = useGlobalModalStore()
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  // 전체 모임 목록 (무한 스크롤)
  const {
    data: gatheringsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGatherings()

  // 즐겨찾기 모임 목록
  const { data: favoritesData } = useFavoriteGatherings()

  // 즐겨찾기 토글
  const { mutate: toggleFavorite } = useToggleFavorite()

  // 모임 목록 평탄화
  const gatherings = gatheringsData?.pages.flatMap((page) => page.items) ?? []
  const favorites = favoritesData?.gatherings ?? []

  // 전체 개수 (첫 페이지 응답의 totalCount 사용)
  const totalCount = gatheringsData?.pages[0]?.totalCount ?? 0
  const favoritesCount = favorites.length

  // 무한 스크롤
  const observerRef = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    enabled: activeTab === 'all',
  })

  // 즐겨찾기 토글 핸들러
  const handleFavoriteToggle = useCallback(
    (gatheringId: number) => {
      toggleFavorite(gatheringId, {
        onError: (error: ApiError) => {
          if (error.is(ErrorCode.FAVORITE_LIMIT_EXCEEDED)) {
            openAlert('알림', '즐겨찾기는 최대 4개까지만 등록할 수 있습니다.')
          } else {
            openAlert('오류', '즐겨찾기 변경에 실패했습니다.')
          }
        },
      })
    },
    [toggleFavorite, openAlert]
  )

  // 카드 클릭 핸들러
  const handleCardClick = useCallback(
    (gatheringId: number) => {
      navigate(ROUTES.GATHERING_DETAIL(gatheringId))
    },
    [navigate]
  )

  // 모임 만들기 버튼 클릭
  const handleCreateClick = () => {
    navigate(ROUTES.GATHERING_CREATE)
  }

  return (
    <div className="flex flex-col gap-large pt-xlarge pb-medium">
      {/* 타이틀 */}
      <h1 className="typo-heading1 text-black">독서모임</h1>

      {/* 탭 + 버튼 영역 */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <TabsList size="large" className="gap-medium">
            <TabsTrigger value="all" badge={totalCount}>
              전체
            </TabsTrigger>
            <TabsTrigger value="favorites" badge={favoritesCount}>
              즐겨찾기
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleCreateClick}>모임 만들기</Button>
      </div>

      {/* 컨텐츠 영역 */}
      {activeTab === 'all' && (
        <>
          {isLoading ? (
            <div className="flex h-35 items-center justify-center">
              <p className="text-grey-600 typo-subtitle2">로딩 중...</p>
            </div>
          ) : gatherings.length === 0 ? (
            <EmptyState type="all" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-small">
                {gatherings.map((gathering) => (
                  <GatheringCard
                    key={gathering.gatheringId}
                    gathering={gathering}
                    onFavoriteToggle={handleFavoriteToggle}
                    onClick={() => handleCardClick(gathering.gatheringId)}
                  />
                ))}
              </div>
              {/* 무한 스크롤 트리거 - 그리드 아래에 위치 */}
              {hasNextPage && <div ref={observerRef} className="h-10" />}
            </>
          )}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <p className="text-grey-600 typo-body3">로딩 중...</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <EmptyState type="favorites" />
          ) : (
            <div className="grid grid-cols-3 gap-small">
              {favorites.map((gathering) => (
                <GatheringCard
                  key={gathering.gatheringId}
                  gathering={gathering}
                  onFavoriteToggle={handleFavoriteToggle}
                  onClick={() => handleCardClick(gathering.gatheringId)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
