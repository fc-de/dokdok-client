export default {
  // @commitlint/config-conventional 기본 규칙 확장
  extends: ['@commitlint/config-conventional'],

  rules: {
    // 허용되는 커밋 타입 정의
    // [2, 'always', [...]] = 에러 레벨 2(오류), 항상 적용, 허용 목록
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'refactor', // 코드 리팩토링 (기능 변경 없는 구조 개선)
        'style', // 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직 변경 없음)
        'design', // CSS 등 사용자 UI 디자인 변경
        'test', // 테스트 코드 추가 및 리팩토링
        'docs', // 문서 수정 (README, 주석 등)
        'chore', // 빌드 업무, 패키지 매니저 설정 등
      ],
    ],

    // 제목(subject) 최대 길이: 50자
    'subject-max-length': [2, 'always', 50],

    // 본문(body) 한 줄 최대 길이: 72자
    'body-max-line-length': [2, 'always', 72],

    // 제목 끝에 마침표(.) 금지
    'subject-full-stop': [2, 'never', '.'],
  },
}
