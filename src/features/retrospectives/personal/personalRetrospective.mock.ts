/**
 * @file personalRetrospective.mock.ts
 * @description 개인 회고 API 목데이터
 */

import type {
  GetPersonalRetrospectiveEditFormResponse,
  GetPersonalRetrospectiveResponse,
  GetPersonalRetrospectiveViewResponse,
} from './personalRetrospective.types'

/**
 * 개인 회고 조회 목데이터
 */
const mockPersonalRetrospectiveDetail: GetPersonalRetrospectiveResponse = {
  meetingHeaderInfo: {
    gatheringName: '책을 읽자',
    bookTitle: '데미안',
    bookAuthor: '헤르만 헤세',
  },
  meetingId: 1,
  preOpinions: [
    {
      topicId: 1,
      topicName: '가짜 욕망, 유사 욕망',
      content: '사전 의견 내용입니다.',
    },
  ],
  topics: [
    {
      topicId: 1,
      topicName: '가짜 욕망, 유사 욕망',
      confirmOrder: 1,
    },
    {
      topicId: 2,
      topicName: '선과 악',
      confirmOrder: 2,
    },
  ],
  meetingMembers: [
    {
      meetingMemberId: 10,
      nickname: '독서왕',
      profileImage: 'https://placehold.co/100x100/9ee2d1/FFFFFF?text=D',
    },
    {
      meetingMemberId: 15,
      nickname: '애옹',
      profileImage: 'https://placehold.co/100x100/ffd9d9/FFFFFF?text=MEOW',
    },
  ],
}

/**
 * 개인 회고 조회 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 개인 회고 목데이터를 반환합니다.
 */
export const getMockPersonalRetrospectiveDetail = (): GetPersonalRetrospectiveResponse => {
  return mockPersonalRetrospectiveDetail
}

/**
 * 개인 회고 뷰 조회 목데이터
 *
 * changedThoughts 는 바뀐 내 의견의 5가지 경우를 모두 포함합니다:
 * 1. 모든 답변이 없는 경우 (keyIssue, preOpinion, postOpinion 모두 null)
 * 2. 쟁점만 있는 경우 (keyIssue만 존재)
 * 3. 모임 전 의견만 있는 경우 (preOpinion만 존재)
 * 4. 모임 후 의견만 있는 경우 (postOpinion만 존재)
 * 5. 모임 전·후 의견이 모두 있는 경우 (preOpinion + postOpinion)
 */
const mockPersonalRetrospectiveView: GetPersonalRetrospectiveViewResponse = {
  retrospectiveId: 1,
  meetingHeaderInfo: {
    gatheringName: '책을 읽자',
    bookTitle: '데미안',
    bookAuthor: '헤르만 헤세',
  },
  retrospective: {
    changedThoughts: [
      {
        // 케이스 1: 모든 답변이 없는 경우
        topicId: 1,
        topicTitle: '가짜 욕망, 유사 욕망',
        keyIssue: null,
        preOpinion: null,
        postOpinion: null,
      },
      {
        // 케이스 2: 쟁점만 있는 경우
        topicId: 2,
        topicTitle: '선과 악',
        keyIssue: '선과 악은 고정된 개념이 아니라 시각에 따라 달라질 수 있다.',
        preOpinion: null,
        postOpinion: null,
      },
      {
        // 케이스 3: 모임 전 의견만 있는 경우
        topicId: 3,
        topicTitle: '자아의 각성',
        keyIssue: null,
        preOpinion: '싱클레어가 자신의 내면을 발견하는 과정이 성장의 본질이라고 생각한다.',
        postOpinion: null,
      },
      {
        // 케이스 4: 모임 후 의견만 있는 경우
        topicId: 4,
        topicTitle: '아브락사스',
        keyIssue: null,
        preOpinion: null,
        postOpinion: '선과 악을 초월한 존재라는 개념이 인간의 내면 갈등을 잘 표현한다고 느꼈다.',
      },
      {
        // 케이스 5: 모임 전·후 의견이 모두 있는 경우
        topicId: 5,
        topicTitle: '새는 알을 깨고 나온다',
        keyIssue: '성장은 안락함을 포기하는 용기에서 시작된다.',
        preOpinion: '사람들은 대개 사회가 원하는 것을 자신이 원한다고 착각한다.',
        postOpinion: '토론 후 욕망의 진정성에 대해 더 깊이 생각하게 되었다.',
      },
    ],
    othersPerspectives: [
      {
        topicId: 2,
        topicTitle: '선과 악',
        meetingMemberId: 10,
        profileImage: null,
        nickname: '독서왕',
        opinionContent:
          '선과 악을 나눌 수 있느냐는 질문보다, 우리는 왜 그렇게 나누어 마음이 편해지는지를 더 봐야 하는 것 같아요.',
        impressiveReason:
          '기존에 선악을 당연히 구분할 수 있다고 생각했는데, 이 관점 덕분에 구분 자체를 의심하게 되었습니다.',
      },
      {
        topicId: 4,
        topicTitle: '아브락사스',
        meetingMemberId: 120,
        profileImage: null,
        nickname: '애옹',
        opinionContent:
          '선과 악을 나눌 수 있느냐는 질문보다, 우리는 왜 그렇게 나누어 마음이 편해지는지를 더 봐야 하는 것 같아요.',
        impressiveReason:
          '기존에 선악을 당연히 구분할 수 있다고 생각했는데, 이 관점 덕분에 구분 자체를 의심하게 되었습니다.',
      },
    ],
    freeTexts: [
      {
        title: '오늘의 한 줄',
        content: '내가 진정으로 원하는 것이 무엇인지 다시 한번 생각해보는 계기가 되었다.',
      },
    ],
  },
}

/**
 * 개인 회고 뷰 조회 목데이터 반환 함수
 */
export const getMockPersonalRetrospectiveView = (): GetPersonalRetrospectiveViewResponse => {
  return mockPersonalRetrospectiveView
}

/**
 * 개인 회고 수정 폼 목데이터
 */
const mockPersonalRetrospectiveEditForm: GetPersonalRetrospectiveEditFormResponse = {
  retrospectiveId: 1,
  meetingHeaderInfo: {
    gatheringName: '책을 읽자',
    bookTitle: '데미안',
    bookAuthor: '헤르만 헤세',
  },
  topics: [
    {
      topicId: 1,
      topicName: '가짜 욕망, 유사 욕망',
      confirmOrder: 1,
    },
    {
      topicId: 2,
      topicName: '선과 악',
      confirmOrder: 2,
    },
  ],
  meetingMembers: [
    {
      meetingMemberId: 10,
      nickname: '독서왕',
      profileImage: 'https://placehold.co/100x100/9ee2d1/FFFFFF?text=D',
    },
    {
      meetingMemberId: 15,
      nickname: '애옹',
      profileImage: ' https://placehold.co/100x100/ffd9d9/FFFFFF?text=MEOW',
    },
  ],
  retrospective: {
    changedThoughts: [
      {
        topicId: 1,
        keyIssue: '기존에 작성한 핵심 쟁점입니다.',
        preOpinion: '기존에 작성한 사전 의견입니다.',
        postOpinion: '기존에 작성한 모임 후 의견입니다.',
      },
    ],
    othersPerspectives: [
      {
        topicId: 2,
        meetingMemberId: 10,
        opinionContent: '기존에 작성한 상대 의견입니다.',
        impressiveReason: '기존에 작성한 인상적이었던 이유입니다.',
      },
    ],
    freeTexts: [
      {
        title: '오늘의 한 줄',
        content: '기존에 작성한 자유 기록 내용입니다.',
      },
    ],
  },
}

/**
 * 개인 회고 수정 폼 목데이터 반환 함수
 */
export const getMockPersonalRetrospectiveEditForm =
  (): GetPersonalRetrospectiveEditFormResponse => {
    return mockPersonalRetrospectiveEditForm
  }
