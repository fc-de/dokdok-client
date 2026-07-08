# 모바일 레이아웃 적용 계획

## 목적

현재 프로젝트의 레이아웃은 데스크톱 GNB와 콘텐츠 폭 제어를 기준으로 `MainLayout`, `FullWidthLayout`, `AuthLayout`, `LandingLayout`에 나뉘어 있다. 모바일 반응형 작업에서는 이 구분만으로 모바일 전용 헤더, 하단 GNB, 하단 CTA를 안정적으로 판별하기 어렵다.

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
      variant: 'navigation',
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

상단 헤더의 좌측 액션, 우측 액션, 하단 CTA는 대부분 페이지 내부 상태와 mutation에 의존하므로 router에 직접 넣지 않는다.

라우터가 담당할 정적 정보:

- `variant`: `navigation`, `header`, `none`
- 기본 `title`
- 기본 `leftAction`
- GNB를 사용할 화면 유형

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
  leftAction: {
    type: 'close',
    onClick: handleClose,
  },
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
  leftAction={resolvedLayout.leftAction}
  headerAction={resolvedLayout.headerAction}
  bottomCTA={resolvedLayout.bottomCTA}
>
  <Outlet />
</MobileLayoutFrame>
```

### 기능별 액션 슬롯 정책

`navigation` 레이아웃:

- 상단: 메인 헤더
- 하단: GNB
- 대상: 1Depth 탐색 화면

`header` 레이아웃:

- 상단: 모바일 화면 헤더
- 좌측: `leftAction.type`에 따라 `back`, `close`, `none` 중 선택
- 중앙: title
- 우측: 선택 액션. 예: `수정하기`, `삭제`, `저장하기`
- 하단: 필요할 때 `bottomCTA`로 주요 액션 제공

`bottomCTA`는 `header` 화면에서 선택적으로 사용하는 별도 기능이며, 좌측 액션이 `back`인지 `close`인지와 결합하지 않는다.

헤더 컴포넌트는 액션의 의미를 판단하지 않고 슬롯만 제공한다. 액션의 의미와 활성화 조건은 페이지가 책임진다.

## 추천 분류

| 유형         | 대상                                  |
| ------------ | ------------------------------------- |
| `navigation` | `/`, `/home`, `/books`, `/gatherings` |
| `header`     | 상세, 작성, 생성, 수정, 결과 화면    |
| `none`       | landing, login, onboarding, component-guide |

`/records`는 하단 GNB 3개 메뉴에 포함되어 있지 않으므로 별도 제품 판단이 필요하다. GNB에 포함하지 않는다면 `header`에 가깝고, 기록을 1Depth 메뉴로 본다면 GNB 정책 자체를 다시 정해야 한다.

## 적용 순서

1. 현재 추가된 모바일 레이아웃 컴포넌트는 유지한다.
2. `MobileLayoutHost`와 `handle.mobileLayout` 타입을 추가한다.
3. 기존 페이지 UI를 바꾸지 않고 라우트별 `variant`와 기본 `leftAction`만 먼저 선언한다.
4. 데스크톱 `Header`, `SubPageHeader`, `FormPageHeader`가 모바일에서 중복 노출되지 않도록 단계적으로 분기한다.
5. 페이지별 CTA, 저장, 삭제, dirty confirm 등 동적 액션은 `useMobileLayout()` hook으로 연결한다.

## 결론

데스크톱 레이아웃은 현재 구조를 유지하고, 모바일 레이아웃은 route metadata와 공통 Host를 통해 별도 레이어로 얹는 방식이 가장 안전하다. 이렇게 하면 페이지별 판단은 유지하면서도 모바일 레이아웃 정책이 페이지마다 흩어지는 것을 막을 수 있다.
