import { ChevronLeft, Info } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  TOPIC_TYPE_META,
  TOPIC_TYPE_OPTIONS,
  type TopicType,
  useCreateTopic,
} from '@/features/topics'
import {
  Button,
  Container,
  Input,
  Textarea,
  TopicTypeSelectGroup,
  TopicTypeSelectItem,
} from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function TopicCreatePage() {
  const navigate = useNavigate()
  const { gatheringId, meetingId } = useParams<{ gatheringId: string; meetingId: string }>()
  const { openError } = useGlobalModalStore()
  const createMutation = useCreateTopic()

  const [topicType, setTopicType] = useState<TopicType>('FREE')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ title?: string }>({})

  const topicTypeHint = TOPIC_TYPE_META[topicType].hint

  const validateForm = () => {
    const newErrors: { title?: string } = {}

    if (!title.trim()) {
      newErrors.title = '주제 제목을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const parsedGatheringId = Number(gatheringId)
    const parsedMeetingId = Number(meetingId)
    if (
      Number.isNaN(parsedGatheringId) ||
      parsedGatheringId <= 0 ||
      Number.isNaN(parsedMeetingId) ||
      parsedMeetingId <= 0
    )
      return

    createMutation.mutate(
      {
        gatheringId: parsedGatheringId,
        meetingId: parsedMeetingId,
        body: {
          title: title.trim(),
          description: description.trim() || null,
          topicType,
        },
      },
      {
        onSuccess: () => {
          // TODO : 토스트로 교체
          alert('주제 제안이 완료되었습니다.')
          navigate(-1)
        },
        onError: (error) => {
          openError('주제 제안 실패', error.userMessage)
        },
      }
    )
  }

  return (
    <>
      {/* 공통컴포넌트로 교체 예정 */}
      <div className="sticky top-0 bg-white -mt-xlarge">
        <p className="flex typo-body3 text-grey-600 gap-xtiny py-medium">
          <ChevronLeft size={16} /> 뒤로가기
        </p>
        <div className="flex justify-between py-large">
          <p className="text-black typo-heading3">주제 제안하기</p>
          <Button
            className="w-fit"
            size="small"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? '...' : '제안하기'}
          </Button>
        </div>
      </div>
      {/* 공통컴포넌트로 교체 예정 */}
      <div className="flex flex-col gap-base pb-xlarge">
        <Container>
          <Container.Title className="typo-subtitle3" required>
            주제 타입선택
          </Container.Title>
          <Container.Content>
            <div className="flex flex-col gap-base">
              {/* TopicTypeSelectGroup이 제네릭 타입 지원해주면 캐스팅 제거 가능 */}
              <TopicTypeSelectGroup
                type="single"
                value={topicType}
                onChange={(value) => setTopicType(value as TopicType)}
                className="grid grid-cols-3 gap-xsmall lg:grid-cols-4 xl:grid-cols-5"
              >
                {TOPIC_TYPE_OPTIONS.map(({ value, label }) => (
                  <TopicTypeSelectItem key={value} value={value} className="typo-body3">
                    {label}
                  </TopicTypeSelectItem>
                ))}
              </TopicTypeSelectGroup>
              <p className="typo-body3 text-purple-200 flex gap-tiny items-center">
                <Info size="16" /> {topicTypeHint}
              </p>
            </div>
          </Container.Content>
        </Container>

        <Container>
          <Container.Title className="typo-subtitle3" required>
            주제 제목
          </Container.Title>
          <Container.Content>
            <Input
              maxLength={24}
              placeholder="예: 주인공의 선택은 옳았을까요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              errorMessage={errors.title}
            />
          </Container.Content>
        </Container>

        <Container>
          <Container.Title className="typo-subtitle3">주제 설명</Container.Title>
          <Container.Content>
            <Textarea
              maxLength={150}
              placeholder="어떤 내용을 이야기 나누고 싶은지 자세히 설명해주세요"
              height={150}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Container.Content>
        </Container>
      </div>
    </>
  )
}
