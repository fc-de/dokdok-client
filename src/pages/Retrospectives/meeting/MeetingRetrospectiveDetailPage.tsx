import { MessageCircleMore } from 'lucide-react'
import { useParams } from 'react-router-dom'

import SubPageHeader from '@/shared/components/SubPageHeader'
import { ROUTES } from '@/shared/constants'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextButton,
} from '@/shared/ui'

export default function MeetingRetrospectiveDetailPage() {
  const { gatheringId, meetingId } = useParams<{
    gatheringId: string
    meetingId: string
  }>()

  if (!gatheringId || !meetingId) return null

  return (
    <>
      <SubPageHeader label="뒤로가기" to={ROUTES.MEETING_DETAIL(gatheringId, meetingId)} />
      {/* 헤더: 타이틀 */}
      <div className="sticky top-[calc(var(--gnb-height)+59px)] z-30 flex items-center justify-between bg-white pb-large">
        <div className="flex flex-col gap-xtiny">
          <h3 className="text-black typo-heading3">약속 회고</h3>
          <p className="text-grey-600 typo-caption1">
            약속 회고는 모임의 내용을 함께 돌아보고 각자의 생각을 마무리하는 곳이에요
          </p>
        </div>
      </div>
      <Card className="p-[36px]">
        <div className="flex flex-col gap-xtiny border-b border-grey-300 pb-base mb-xsmall">
          <p className="typo-heading2 text-black">약속 이름</p>
          <p className="typo-body6 text-grey-600">2026.01.15(월) 19:00-20:00</p>
        </div>

        <Tabs defaultValue="tab1" className="gap-large">
          <TabsList className="border-b border-grey-300" size="medium">
            <TabsTrigger value="tab1">주제 1</TabsTrigger>
            <TabsTrigger value="tab2">주제 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <dl className="flex flex-col gap-medium">
              <div className="flex flex-col gap-small text-black">
                <dt className="typo-subtitle2">핵심 요약</dt>
                <dd className="typo-body1">
                  참여자들은 『데미안』 속 싱클레어가 느꼈던 혼란을 자신들의 경험과 연결하며,
                  스스로의 욕망이라고 믿어왔던 선택들 중 상당수가 사회적 기대와 타인의 시선에서
                  비롯되었을 가능성에 대해 이야기했다. 진짜 욕망은 명확한 목표나 언어로 쉽게
                  설명되지 않으며, 오히려 불안과 책임을 함께 요구한다는 점에 공감이 모였다.
                </dd>
              </div>

              <div className="flex flex-col gap-small text-black">
                <dt className="typo-subtitle2">주요 포인트</dt>
                <dd>
                  <ol className="flex flex-col gap-large">
                    <li className="typo-body1">
                      <p className="typo-subtitle2">1&#41; 사회가 만든 욕망의 구조</p>
                      안정적인 직업, 성과, 인정 욕구가 개인의 욕망처럼 내면화된 경험 공유 “원해서
                      선택했다”기보다 “선택하지 않으면 불안해서 택했다”는 표현이 반복됨
                    </li>
                    <li className="typo-body1">
                      <p className="typo-subtitle2">2&#41; 사회가 만든 욕망의 구조</p>
                      안정적인 직업, 성과, 인정 욕구가 개인의 욕망처럼 내면화된 경험 공유 “원해서
                      선택했다”기보다 “선택하지 않으면 불안해서 택했다”는 표현이 반복됨
                    </li>
                    <li className="typo-body1">
                      <p className="typo-subtitle2">3&#41; 사회가 만든 욕망의 구조</p>
                      안정적인 직업, 성과, 인정 욕구가 개인의 욕망처럼 내면화된 경험 공유 “원해서
                      선택했다”기보다 “선택하지 않으면 불안해서 택했다”는 표현이 반복됨
                    </li>
                  </ol>
                </dd>
              </div>
            </dl>
          </TabsContent>
          <TabsContent value="tab2">탭 2의 컨텐츠</TabsContent>
        </Tabs>
      </Card>
      {/* Comments 영역 */}
      <div className="mt-[36px]">
        <p className="flex gap-tiny text-grey-600 typo-body2 items-center mb-large">
          <MessageCircleMore size={20} />
          3개의 의견
        </p>
        <div className="flex gap-small mb-base">
          <Avatar>
            <AvatarImage src="" alt="" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <Input maxLength={500} placeholder="코멘트는 공백 포함 500자까지 작성할 수 있어요" />
        </div>
        <div className="flex justify-end">
          <Button className="w-[90px]">등록</Button>
        </div>

        <ul>
          <li className="border-b border-grey-300 py-large flex gap-small last:border-none">
            <Avatar className="mt-xtiny">
              <AvatarImage src="" alt="" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-base">
              <div className="flex justify-between items-start">
                <div>
                  <p className="typo-subtitle5 text-black">닉네임</p>
                  <p className="typo-body6 text-grey-600">2026.01.15(월)</p>
                </div>
                <TextButton size="medium">삭제</TextButton>
              </div>
              <div className="typo-body1 text-grey-700">
                코멘트는 공백 포함 500자 제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는
                공백 포함 500자 제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는 공백 포함
                500자 제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는 공백 포함 500자
                제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는 공백 포함 500자 제한입니다
                코멘트는 공백 포함 500자 제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는
                공백 포함 500자 제한입니다 코멘트는 공백 포함 500자 제한입니다 코멘트는 공백
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
