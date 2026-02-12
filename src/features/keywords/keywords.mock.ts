/**
 * @file keywords.mock.ts
 * @description 키워드 API 목데이터
 */

import type { GetKeywordsResponse } from '@/features/keywords/keywords.types'

/**
 * 키워드 목록 조회 목데이터
 */
const mockKeywordsResponse: GetKeywordsResponse = {
  keywords: [
    // ============================================================
    // 책 키워드 카테고리 (BOOK, level 1)
    // ============================================================
    { id: 1, name: '인간관계', type: 'BOOK', parentId: null, parentName: null, level: 1, sortOrder: 1, isSelectable: false },
    { id: 2, name: '개인', type: 'BOOK', parentId: null, parentName: null, level: 1, sortOrder: 2, isSelectable: false },
    { id: 3, name: '삶과 죽음', type: 'BOOK', parentId: null, parentName: null, level: 1, sortOrder: 3, isSelectable: false },
    { id: 4, name: '사회', type: 'BOOK', parentId: null, parentName: null, level: 1, sortOrder: 4, isSelectable: false },
    { id: 5, name: '기타', type: 'BOOK', parentId: null, parentName: null, level: 1, sortOrder: 5, isSelectable: false },

    // ============================================================
    // 인간관계 키워드 (level 2, parentId: 1)
    // ============================================================
    { id: 42, name: '사랑', type: 'BOOK', parentId: 1, parentName: '인간관계', level: 2, sortOrder: 1, isSelectable: true },
    { id: 43, name: '관계', type: 'BOOK', parentId: 1, parentName: '인간관계', level: 2, sortOrder: 2, isSelectable: true },
    { id: 44, name: '가족', type: 'BOOK', parentId: 1, parentName: '인간관계', level: 2, sortOrder: 3, isSelectable: true },
    { id: 45, name: '우정', type: 'BOOK', parentId: 1, parentName: '인간관계', level: 2, sortOrder: 4, isSelectable: true },
    { id: 46, name: '이별', type: 'BOOK', parentId: 1, parentName: '인간관계', level: 2, sortOrder: 5, isSelectable: true },

    // ============================================================
    // 개인 키워드 (level 2, parentId: 2)
    // ============================================================
    { id: 47, name: '성장', type: 'BOOK', parentId: 2, parentName: '개인', level: 2, sortOrder: 1, isSelectable: true },
    { id: 48, name: '자아', type: 'BOOK', parentId: 2, parentName: '개인', level: 2, sortOrder: 2, isSelectable: true },
    { id: 49, name: '고독', type: 'BOOK', parentId: 2, parentName: '개인', level: 2, sortOrder: 3, isSelectable: true },
    { id: 50, name: '선택', type: 'BOOK', parentId: 2, parentName: '개인', level: 2, sortOrder: 4, isSelectable: true },
    { id: 51, name: '자유', type: 'BOOK', parentId: 2, parentName: '개인', level: 2, sortOrder: 5, isSelectable: true },

    // ============================================================
    // 삶과 죽음 키워드 (level 2, parentId: 3)
    // ============================================================
    { id: 52, name: '삶', type: 'BOOK', parentId: 3, parentName: '삶과 죽음', level: 2, sortOrder: 1, isSelectable: true },
    { id: 53, name: '죽음', type: 'BOOK', parentId: 3, parentName: '삶과 죽음', level: 2, sortOrder: 2, isSelectable: true },
    { id: 54, name: '상실', type: 'BOOK', parentId: 3, parentName: '삶과 죽음', level: 2, sortOrder: 3, isSelectable: true },
    { id: 55, name: '치유', type: 'BOOK', parentId: 3, parentName: '삶과 죽음', level: 2, sortOrder: 4, isSelectable: true },
    { id: 56, name: '기억', type: 'BOOK', parentId: 3, parentName: '삶과 죽음', level: 2, sortOrder: 5, isSelectable: true },

    // ============================================================
    // 사회 키워드 (level 2, parentId: 4)
    // ============================================================
    { id: 57, name: '사회', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 1, isSelectable: true },
    { id: 58, name: '현실', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 2, isSelectable: true },
    { id: 59, name: '역사', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 3, isSelectable: true },
    { id: 60, name: '노동', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 4, isSelectable: true },
    { id: 61, name: '여성', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 5, isSelectable: true },
    { id: 62, name: '윤리', type: 'BOOK', parentId: 4, parentName: '사회', level: 2, sortOrder: 6, isSelectable: true },

    // ============================================================
    // 기타 키워드 (level 2, parentId: 5)
    // ============================================================
    { id: 63, name: '청춘', type: 'BOOK', parentId: 5, parentName: '기타', level: 2, sortOrder: 1, isSelectable: true },
    { id: 64, name: '모험', type: 'BOOK', parentId: 5, parentName: '기타', level: 2, sortOrder: 2, isSelectable: true },
    { id: 65, name: '판타지', type: 'BOOK', parentId: 5, parentName: '기타', level: 2, sortOrder: 3, isSelectable: true },
    { id: 66, name: '추리', type: 'BOOK', parentId: 5, parentName: '기타', level: 2, sortOrder: 4, isSelectable: true },

    // ============================================================
    // 감상 키워드 카테고리 (IMPRESSION, level 1)
    // ============================================================
    { id: 6, name: '긍정', type: 'IMPRESSION', parentId: null, parentName: null, level: 1, sortOrder: 1, isSelectable: false },
    { id: 7, name: '감상', type: 'IMPRESSION', parentId: null, parentName: null, level: 1, sortOrder: 2, isSelectable: false },
    { id: 8, name: '부정', type: 'IMPRESSION', parentId: null, parentName: null, level: 1, sortOrder: 3, isSelectable: false },

    // ============================================================
    // 긍정 키워드 (level 2, parentId: 6)
    // ============================================================
    { id: 9, name: '즐거운', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 1, isSelectable: true },
    { id: 10, name: '감동적인', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 2, isSelectable: true },
    { id: 11, name: '위로받은', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 3, isSelectable: true },
    { id: 12, name: '뭉클한', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 4, isSelectable: true },
    { id: 13, name: '후련한', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 5, isSelectable: true },
    { id: 14, name: '벅찬', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 6, isSelectable: true },
    { id: 15, name: '안도한', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 7, isSelectable: true },
    { id: 16, name: '희망이 생긴', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 8, isSelectable: true },
    { id: 17, name: '설레는', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 9, isSelectable: true },
    { id: 18, name: '흥미로운', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 10, isSelectable: true },
    { id: 19, name: '빠져든', type: 'IMPRESSION', parentId: 6, parentName: '긍정', level: 2, sortOrder: 11, isSelectable: true },

    // ============================================================
    // 감상 키워드 (level 2, parentId: 7)
    // ============================================================
    { id: 20, name: '여운이 남는', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 1, isSelectable: true },
    { id: 21, name: '먹먹한', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 2, isSelectable: true },
    { id: 22, name: '울컥한', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 3, isSelectable: true },
    { id: 23, name: '찡한', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 4, isSelectable: true },
    { id: 24, name: '그리운', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 5, isSelectable: true },
    { id: 25, name: '익숙한', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 6, isSelectable: true },
    { id: 26, name: '이해가 되는', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 7, isSelectable: true },
    { id: 27, name: '의문이 남는', type: 'IMPRESSION', parentId: 7, parentName: '감상', level: 2, sortOrder: 8, isSelectable: true },

    // ============================================================
    // 부정 키워드 (level 2, parentId: 8)
    // ============================================================
    { id: 28, name: '지루한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 1, isSelectable: true },
    { id: 29, name: '씁쓸한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 2, isSelectable: true },
    { id: 30, name: '허무한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 3, isSelectable: true },
    { id: 31, name: '찝찝한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 4, isSelectable: true },
    { id: 32, name: '공허한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 5, isSelectable: true },
    { id: 33, name: '서글픈', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 6, isSelectable: true },
    { id: 34, name: '분노가 이는', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 7, isSelectable: true },
    { id: 35, name: '복잡한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 8, isSelectable: true },
    { id: 36, name: '허탈한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 9, isSelectable: true },
    { id: 37, name: '불안한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 10, isSelectable: true },
    { id: 38, name: '괴로운', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 11, isSelectable: true },
    { id: 39, name: '안타까운', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 12, isSelectable: true },
    { id: 40, name: '답답한', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 13, isSelectable: true },
    { id: 41, name: '슬픈', type: 'IMPRESSION', parentId: 8, parentName: '부정', level: 2, sortOrder: 14, isSelectable: true },
  ],
}

/**
 * 키워드 목록 조회 목데이터 반환 함수
 *
 * @description
 * 실제 API 호출을 시뮬레이션하여 키워드 목데이터를 반환합니다.
 */
export const getMockKeywords = (): GetKeywordsResponse => {
  return mockKeywordsResponse
}
