import { format } from 'date-fns'
import { Check } from 'lucide-react'

import { Button } from '@/shared/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/Tooltip'

type ProposedHeaderProps = {
  activeTab: 'PROPOSED'
  actions: { canConfirm: boolean; canSuggest: boolean }
  confirmedTopic: boolean
  confirmedTopicDate: string | null
}

type ConfirmedHeaderProps = {
  activeTab: 'CONFIRMED'
  actions: { canViewPreOpinions: boolean; canWritePreOpinions: boolean }
  confirmedTopic: boolean
  confirmedTopicDate: string | null
}

type TopicHeaderProps = ProposedHeaderProps | ConfirmedHeaderProps

export default function TopicHeader(props: TopicHeaderProps) {
  return (
    <>
      {/* 제안탭 */}
      {props.activeTab === 'PROPOSED' && (
        <div className="flex justify-between">
          <div className="flex flex-col gap-tiny">
            {props.confirmedTopic && props.confirmedTopicDate ? (
              // 주제 확정됨
              <>
                <p className="text-black typo-subtitle3">
                  주제 제안이 마감되었어요. 확정된 주제를 확인해보세요!
                </p>
                <p className="typo-body4 text-grey-600">
                  {format(props.confirmedTopicDate, 'yyyy.MM.dd HH:mm')} 마감
                </p>
              </>
            ) : (
              // 주제 제안 중
              <>
                <p className="text-black typo-subtitle3">
                  약속에서 나누고 싶은 주제를 제안해보세요
                </p>
                <p className="typo-body4 text-grey-600">
                  주제를 미리 정하면 우리 모임이 훨씬 풍성하고 즐거워질 거예요
                </p>
              </>
            )}
          </div>

          <div className="flex gap-xsmall">
            {props.actions.canConfirm && (
              <Button variant="secondary" outline>
                주제 확정하기
              </Button>
            )}

            {props.actions.canSuggest && <Button>제안하기</Button>}
          </div>
        </div>
      )}

      {/* 제안탭 */}

      {/* 확정탭 */}
      {props.activeTab === 'CONFIRMED' && (
        <div className="flex justify-between">
          <div className="flex flex-col gap-tiny">
            {props.confirmedTopic ? (
              // 주제 확정됨
              <>
                <p className="flex items-center text-black typo-subtitle3 gap-tiny">
                  <Check size="20" /> 주제가 확정되었어요!
                </p>
                <p className="typo-body4 text-grey-600">
                  나의 생각을 미리 정리해서 공유하면 다른 멤버들의 의견도 바로 확인할 수 있어요
                </p>
              </>
            ) : (
              // 주제 제안 중
              <>
                <p className="text-black typo-subtitle3">약속장이 주제를 선정하고 있어요</p>
                <p className="typo-body4 text-grey-600">
                  주제가 확정되면 사전 의견을 남길 수 있는 창이 열려요
                </p>
              </>
            )}
          </div>

          <div className="flex gap-xsmall">
            {props.actions.canViewPreOpinions ? (
              <Button variant="secondary" outline>
                사전 의견 확인하기
              </Button>
            ) : (
              <Tooltip dismissable>
                <TooltipTrigger asChild>
                  <Button variant="secondary" outline disabled>
                    사전 의견 확인하기
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>내 의견을 먼저 공유해야 다른</p>
                  <p>멤버들의 의견도 확인할 수 있어요!</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Button disabled={!props.actions.canWritePreOpinions}>사전 의견 작성하기</Button>
          </div>
        </div>
      )}
      {/* 확정탭 */}
    </>
  )
}
