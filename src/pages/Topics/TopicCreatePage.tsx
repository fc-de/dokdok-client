import { Info } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PAGE_ACCESS_ERROR_CODES } from '@/api/errors'
import {
  TOPIC_TYPE_META,
  TOPIC_TYPE_OPTIONS,
  type TopicType,
  useCreateTopic,
} from '@/features/topics'
import FormPageHeader from '@/shared/components/FormPageHeader'
import { showToast } from '@/shared/lib/toast'
import { Container, Input, Textarea, TopicTypeSelectGroup, TopicTypeSelectItem } from '@/shared/ui'
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
          showToast('주제 제안이 완료되었습니다.')
          navigate(-1)
        },
        onError: (error) => {
          if (PAGE_ACCESS_ERROR_CODES.has(error.code)) return
          openError('주제 제안 실패', error.userMessage)
        },
      }
    )
  }

  return (
    <>
      <FormPageHeader
        title="주제 제안하기"
        actionLabel={createMutation.isPending ? '...' : '제안하기'}
        onAction={handleSubmit}
        isActionDisabled={createMutation.isPending}
      />
      <div className="bg-grey-100">
        <div className="mx-auto max-w-layout-max px-layout-padding">
          <div className="flex flex-col gap-base py-xlarge">
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
        </div>
      </div>
    </>
  )
}
