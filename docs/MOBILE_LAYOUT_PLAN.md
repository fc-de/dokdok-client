# 모바일 레이아웃 적용 계획

## 목적

현재 프로젝트의 레이아웃은 데스크톱 GNB와 콘텐츠 폭 제어를 기준으로 `MainLayout`, `FullWidthLayout`, `AuthLayout`, `LandingLayout`에 나뉘어 있다. 모바일 반응형 작업에서는 이 구분만으로 `메인 UI`, `독립 화면 UI`, `콘텐츠 UI`를 안정적으로 판별하기 어렵다.

따라서 기존 데스크톱 레이아웃은 유지하고, 모바일 전용 레이아웃은 라우트 메타데이터와 공통 Host를 통해 별도 레이어로 적용한다.

## 현재 구조 요약

- `RootLayout`: 전역 래퍼와 권한 리다이렉트만 담당한다.
- `MainLayout`: 데스크톱 Header, `max-w-layout-max`, `px-layout-padding`을 제공한다.
- `FullWidthLayout`: 데스크톱 Header만 제공하고 페이지가 자체 헤더/폭/패딩을 관리한다.
- `AuthLayout`: 로그인/온보딩 중앙 정렬 화면을 담당한다.
- `LandingLayout`: 랜딩 전용 헤더와 배경을 담당한다.
- `SubPageHeader`, `FormPageHeader`, `GatheringDetailHeader`, `PreOpinionWriteHeader`는 페이지 내부에서 개별적으로 사용된다.

## 문제점

- `MainLayout`과 `FullWidthLayout`은 모바일 화면 유형이 아니라 데스크톱 콘텐츠 폭과 GNB 포함 여부를 기준으로 분리되어 있다.
- `/books`는 1Depth 메인 화면이지만 `FullWidthLayout` 아래에 있다.
- `/gatherings/create`는 독립 작업 화면이지만 `MainLayout` 아래에 있다.
- `/invite/:invitationCode`는 특수 공개 페이지지만 현재 `MainLayout` 아래에 있다.
- 상세/작성/설정 화면은 페이지 내부 헤더가 흩어져 있어 모바일 공통 정책을 일괄 적용하기 어렵다.

## 권장 방향

기존 라우트 그룹을 모바일 기준으로 재배치하지 않고, 각 라우트에 `handle.mobileLayout` 메타데이터를 추가한다.

```tsx
{
  path: ROUTES.GATHERINGS,
  element: <GatheringListPage />,
  handle: {
    mobileLayout: {
      variant: 'main',
      title: '독서모임',
    },
  },
}
```

공통 `MobileLayoutHost`는 `useMatches()`로 현재 라우트의 `handle.mobileLayout`을 읽고, 이를 `MobileLayoutFrame`에 전달한다.

```tsx
const matches = useMatches()
const mobileLayout = [...matches].reverse().find((match) => match.handle?.mobileLayout)
  ?.handle.mobileLayout
```

정적 정보는 라우트 `handle`에 둔다. 페이지 상태가 필요한 저장, 삭제, CTA, dirty confirm 등은 페이지 내부에서 `useMobileLayout()` 같은 hook으로 동적 override한다.

### 라우터와 페이지 hook의 책임 분리

독립형과 콘텐츠형 레이아웃은 헤더에 들어가는 액션의 성격이 다르다. 이 액션들은 대부분 페이지 내부 상태와 mutation에 의존하므로 router에 직접 넣지 않는다.

라우터가 담당할 정적 정보:

- `variant`: `main`, `content`, `independent`, `none`
- 기본 `title`
- 기본 `backTo`
- GNB 또는 CTA 영역을 사용할 화면 유형

라우터가 담당하지 않을 동적 정보:

- `onClick`
- `disabled`
- `isPending`
- 저장/삭제 mutation
- dirty 상태 이탈 확인
- API 로딩 후 바뀌는 title

페이지는 `useMobileLayout()` 같은 hook으로 동적 액션을 등록한다.

```tsx
useMobileLayout({
  title: isEditMode ? '약속 수정하기' : '약속 만들기',
  headerAction: {
    label: '저장하기',
    onClick: handleSave,
    disabled: isSaving,
  },
  bottomCTA: {
    label: isEditMode ? '수정하기' : '만들기',
    onClick: handleSubmit,
    disabled: !isValid || isSubmitting,
    loading: isSubmitting,
  },
  onBack: handleClose,
})
```

`MobileLayoutHost`는 route 기본값과 page override를 병합해서 최종 레이아웃을 만든다.

```tsx
const routeLayout = useRouteMobileLayout()
const pageLayout = useMobileLayoutState()

const resolvedLayout = {
  ...routeLayout,
  ...pageLayout,
}
```

```tsx
<MobileLayoutFrame
  variant={resolvedLayout.variant}
  title={resolvedLayout.title}
  onBack={resolvedLayout.onBack}
  headerAction={resolvedLayout.headerAction}
  bottomCTA={resolvedLayout.bottomCTA}
>
  <Outlet />
</MobileLayoutFrame>
```

### 화면 유형별 액션 슬롯 정책

`content` 화면:

- 좌측: 이전 버튼 `←`
- 중앙: title
- 우측: 선택 액션. 예: `수정하기`, `삭제`, `완료`
- 하단 CTA 없음이 기본

`independent` 화면:

- 좌측: 닫기 버튼 `X`
- 중앙: title
- 우측: 보조 액션. 예: `저장하기`, `임시저장`
- 하단: 주요 CTA. 예: `만들기`, `수정하기`, `공유하기`, `완료`

헤더 컴포넌트는 액션의 의미를 판단하지 않고 슬롯만 제공한다. 액션의 의미와 활성화 조건은 페이지가 책임진다.

## 추천 분류

| 유형          | 대상                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------ |
| `main`        | `/`, `/home`, `/books`, `/gatherings`                                                      |
| `independent` | `/gatherings/create`, 모임 설정, 약속 생성/수정, 사전 의견 작성, 주제 생성, 회고 작성/수정 |
| `content`     | 도서 상세/리뷰, 모임 상세, 약속 상세, 사전 의견 목록, 회고 결과/상세/view, 약속 설정 관리  |
| `none`        | landing, login, onboarding, invite, component-guide                                        |

`/records`는 하단 GNB 3개 메뉴에 포함되어 있지 않으므로 별도 제품 판단이 필요하다. GNB에 포함하지 않는다면 `content`에 가깝고, 기록을 1Depth 메뉴로 본다면 GNB 정책 자체를 다시 정해야 한다.

## 적용 순서

1. 현재 추가된 모바일 레이아웃 컴포넌트는 유지한다.
2. `MobileLayoutHost`와 `handle.mobileLayout` 타입을 추가한다.
3. 기존 페이지 UI를 바꾸지 않고 라우트별 `variant`만 먼저 선언한다.
4. 데스크톱 `Header`, `SubPageHeader`, `FormPageHeader`가 모바일에서 중복 노출되지 않도록 단계적으로 분기한다.
5. 페이지별 CTA, 저장, 삭제, dirty confirm 등 동적 액션은 `useMobileLayout()` hook으로 연결한다.

## 결론

데스크톱 레이아웃은 현재 구조를 유지하고, 모바일 레이아웃은 route metadata와 공통 Host를 통해 별도 레이어로 얹는 방식이 가장 안전하다. 이렇게 하면 페이지별 판단은 유지하면서도 모바일 레이아웃 정책이 페이지마다 흩어지는 것을 막을 수 있다.
