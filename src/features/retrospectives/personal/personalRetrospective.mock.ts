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
      profileImage: 'https://example.com/profile.jpg',
    },
    {
      meetingMemberId: 15,
      nickname: '애옹',
      profileImage:
        'data:image/jpeg;base64,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',
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
      profileImage: 'https://example.com/profile.jpg',
    },
    {
      meetingMemberId: 15,
      nickname: '애옹',
      profileImage: null,
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
