import { useNavigate } from 'react-router-dom'

import { GatheringCard, useFavoriteGatherings, useToggleFavorite } from '@/features/gatherings'
import { ROUTES } from '@/shared/constants'
import { useDeferredLoading } from '@/shared/hooks'

import HomeSectionHeader from './HomeSectionHeader'

export default function FavoriteGatheringsSection() {
  const navigate = useNavigate()
  const { data, isLoading } = useFavoriteGatherings()
  const showSkeleton = useDeferredLoading(isLoading)
  const { mutate: toggleFavorite } = useToggleFavorite()

  const gatherings = data?.gatherings ?? []

  return (
    <section className="flex flex-col gap-medium">
      <HomeSectionHeader
        title="즐겨찾는 모임"
        linkTo={ROUTES.GATHERINGS}
        linkLabel="모임 홈 바로가기"
      />

      {showSkeleton ? (
        <div className="grid grid-cols-3 gap-small">
          {[...Array(3).keys()].map((i) => (
            <div
              key={i}
              className="flex h-35 animate-pulse flex-col justify-between rounded-base border border-grey-300 p-medium"
            >
              <div className="flex flex-col gap-xsmall">
                <div className="h-5 w-12 rounded-tiny bg-grey-300" />
                <div className="h-5.5 w-2/3 rounded bg-grey-300" />
              </div>
              <div className="h-5 w-3/4 rounded bg-grey-300" />
            </div>
          ))}
        </div>
      ) : gatherings.length === 0 ? (
        <div className="flex h-35 flex-col items-center justify-center gap-xtiny rounded-base border border-grey-300">
          <p className="text-grey-600 typo-subtitle2">즐겨찾기한 모임이 없어요.</p>
          <p className="text-grey-500 typo-body3">
            자주 찾는 모임을 등록하고 한눈에 확인해 보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-small">
          {gatherings.map((gathering) => (
            <GatheringCard
              key={gathering.gatheringId}
              gathering={gathering}
              onFavoriteToggle={(id) => toggleFavorite(id)}
              onClick={() => navigate(ROUTES.GATHERING_DETAIL(gathering.gatheringId))}
            />
          ))}
        </div>
      )}
    </section>
  )
}
