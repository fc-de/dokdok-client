# 🛠️ Development Guide

이 문서는 **dokdok 프로젝트를 처음 실행하는 개발자**를 위한 가이드입니다.  
운영체제(macOS / Windows)에 따라 **Node 설치 방법만 다르며**,  
그 외 설정과 실행 방법은 동일합니다.

---

## ✅ 필수 환경 요약 (중요)

- **Node.js**: `>=20.19.0 <21`
- **패키지 매니저**: `pnpm`
  - ❌ 직접 설치하지 않음
  - ✅ **Corepack이 자동으로 관리**
- **pnpm 버전**: 프로젝트에 고정됨 (`package.json`의 `packageManager` 참고)

> Node 또는 pnpm 버전이 맞지 않으면 의존성 설치 단계에서 오류가 발생합니다.

---

## 1️⃣ 저장소 클론

```bash
git clone <repository-url>
cd <project-root>
```

---

## 2️⃣ Node.js 설치 (운영체제별)

### 🟢 macOS / Linux 사용자

#### ① nvm 설치 (이미 설치되어 있다면 생략)

https://github.com/nvm-sh/nvm

#### ② Node 20 설치 및 사용

```bash
nvm install 20
nvm use
node -v
```

✅ 출력 결과가 **v20.19.0 이상**이면 정상입니다.

---

### 🟦 Windows 사용자 (중요 ⚠️)

> Windows에서는 일반 nvm이 아닌 **`nvm-windows`**를 사용해야 합니다.

#### ① nvm-windows 설치

아래 링크에서 **Installer**를 다운로드하여 설치하세요.  
https://github.com/coreybutler/nvm-windows

- 설치 중 _“Use nvm for managing Node.js versions”_ 선택
- 설치 후 **터미널을 반드시 새로 열어야 합니다**

#### ② Node 20.19 이상 설치 및 사용

PowerShell 또는 CMD에서 실행:

```powershell
nvm install 20
nvm use 20
node -v
```

✅ 출력 결과가 **v20.19.0 이상**이면 정상입니다.

---

## 3️⃣ Corepack 활성화 (필수)

dokdok은 **Corepack을 사용해 pnpm 버전을 프로젝트 단위로 고정**합니다.

```bash
corepack enable
```

- 한 번만 실행하면 됩니다.
- macOS / Windows 동일합니다.

---

## ⚠️ Corepack 오류가 발생할 경우 (중요)

아래와 같은 에러가 발생할 수 있습니다:

```
Internal Error: Cannot find matching keyid
```

이는 **Node에 포함된 Corepack이 오래된 경우** 발생합니다.

### 해결 방법 (macOS / Windows 동일)

```bash
npm install --global corepack@latest
corepack enable
```

> 이 명령은 **pnpm을 전역 설치하는 것이 아니라**,  
> Node 공식 도구인 Corepack을 최신으로 업데이트하는 작업입니다.

---

## 4️⃣ pnpm 버전 관리 방식

프로젝트는 `package.json`의 `packageManager` 필드를 통해  
pnpm 버전을 고정하고 있습니다.

```
"packageManager": "pnpm@10.28.0"
```

별도 설정 없이 `corepack enable` 이후  
`pnpm install`만 실행하면 됩니다.

---

## 5️⃣ 의존성 설치

```bash
pnpm install
```

- Node 버전이 맞지 않으면 설치가 차단됩니다 (정상 동작).

---

## 6️⃣ 개발 서버 실행

```bash
pnpm dev
```

---

## ✅ 한 줄 요약

> **Node 20.19+ 설치 → `corepack enable` → `pnpm install` → `pnpm dev`**

---

## ℹ️ 참고 사항

- 본 프로젝트는 `package.json`의 `engines`와 `packageManager` 설정을 통해  
  Node 및 pnpm 사용 버전을 일관되게 관리합니다.
- 이는 팀원 간 개발 환경 차이로 인한 오류를 줄이기 위한 정책입니다.
