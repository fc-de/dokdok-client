import type { TopicType } from '@/features/topics/topics.types'

export const TOPIC_TYPE_META: Record<
  TopicType,
  {
    label: string
    hint: string
  }
> = {
  FREE: {
    label: '자유형',
    hint: '자유롭게 이야기 나누는 주제입니다',
  },
  DISCUSSION: {
    label: '토론형',
    hint: '찬반 토론이나 다양한 관점을 나누는 주제입니다',
  },
  EMOTION: {
    label: '감정 공유형',
    hint: '책을 읽으며 느낀 감정을 공유하는 주제입니다',
  },
  EXPERIENCE: {
    label: '경험 연결형',
    hint: '책의 내용을 개인 경험과 연결하는 주제입니다',
  },
  CHARACTER_ANALYSIS: {
    label: '인물 분석형',
    hint: '등장인물의 성격, 동기, 변화를 분석하는 주제입니다',
  },
  COMPARISON: {
    label: '비교 분석형',
    hint: '다른 작품이나 현실과 비교하는 주제입니다',
  },
  STRUCTURE: {
    label: '구조 분석형',
    hint: '책의 구성, 서술 방식, 문제를 분석하는 주제입니다',
  },
  IN_DEPTH: {
    label: '심층 분석형',
    hint: '주제, 상징, 메시지를 깊이 있게 분석하는 주제입니다',
  },
  CREATIVE: {
    label: '창작형',
    hint: '후속 이야기나 다른 결말을 창작하는 주제입니다',
  },
  CUSTOM: {
    label: '질문형',
    hint: '궁금한 점을 질문하고 함께 답을 찾는 주제입니다',
  },
}

export const TOPIC_TYPE_OPTIONS = (Object.keys(TOPIC_TYPE_META) as TopicType[]).map((key) => ({
  value: key,
  ...TOPIC_TYPE_META[key],
}))
