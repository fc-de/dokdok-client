import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { ApiError, ErrorCode } from '@/api'
import { useAuth } from '@/features/auth'
import {
  type GatheringMemberStatus,
  useGatheringByInviteCode,
  useJoinGathering,
} from '@/features/gatherings'
import EnvelopeBottom from '@/shared/assets/icon/envelope-bottom.svg'
import EnvelopeTop from '@/shared/assets/icon/envelope-top.svg'
import { ROUTES } from '@/shared/constants'
import { Button } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function InvitePage() {
  const { invitationCode } = useParams<{ invitationCode: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { openAlert, openError } = useGlobalModalStore()

  // 로그인 상태 확인
  const { data: user } = useAuth()
  const isLoggedIn = !!user

  // 모임 정보 조회
  const {
    data: gatheringResponse,
    isPending: isLoading,
    error,
  } = useGatheringByInviteCode(invitationCode)

  const gathering = gatheringResponse?.data

  // 가입 신청
  const { mutate: joinGathering, isPending: isJoining } = useJoinGathering()

  const handleJoin = () => {
    if (!invitationCode) return

    // 비로그인 시 로그인 페이지로 이동
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } })
      return
    }

    // 가입 신청
    joinGathering(invitationCode, {
      onSuccess: (response) => {
        const status: GatheringMemberStatus = response.data.memberStatus

        if (status === 'PENDING') {
          openAlert('가입 신청 완료', '모임장의 승인을 기다려주세요.')
          navigate(ROUTES.GATHERINGS)
        } else if (status === 'ACTIVE') {
          // 바로 가입된 경우 모임 상세로 이동
          navigate(ROUTES.GATHERING_DETAIL(response.data.gatheringId))
        } else if (status === 'REJECTED') {
          openError('가입 불가', '해당 모임에 가입할 수 없습니다.')
        }
      },
      onError: (error) => {
        if (error instanceof ApiError && error.is(ErrorCode.ALREADY_GATHERING_MEMBER)) {
          openAlert('이미 가입된 모임', '이미 가입된 모임입니다.')
          navigate(ROUTES.GATHERINGS)
          return
        }
        openError('오류', '가입 신청 중 오류가 발생했습니다.')
      },
    })
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 pt-xlarge">
        <p className="typo-body1 text-grey-600">모임 정보를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태 (유효하지 않은 초대 코드)
  if (error || !gathering) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-base pt-xlarge">
        <h1 className="typo-heading2 text-black">유효하지 않은 초대 링크</h1>
        <p className="typo-body3 text-grey-600">초대 링크가 만료되었거나 잘못된 링크입니다.</p>
        <Button variant="primary" size="medium" onClick={() => navigate(ROUTES.HOME)}>
          홈으로 이동
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-9 w-full pt-xlarge">
      {/* 제목 영역 */}
      <div className="flex flex-col gap-xtiny items-center text-center w-full">
        <h1 className="typo-heading2 text-black">새로운 독서모임에 초대되었어요!</h1>
        <p className="typo-body3 text-grey-600">모임 정보를 확인하고 가입을 신청해 보세요</p>
      </div>

      {/* 모임 정보 카드 (봉투 디자인) */}
      <div className="flex flex-col gap-9 items-center w-full max-w-100">
        {/* 봉투 컨테이너 */}
        <div className="relative w-full">
          {/* 봉투 상단 (열린 뚜껑) */}
          <img
            src={EnvelopeTop}
            alt=""
            className="absolute top-14.5 left-1/2 -translate-x-1/2 w-full z-0"
          />

          {/* 카드 (편지지) */}
          <div className="relative z-10 mx-8.25 flex flex-col gap-base bg-white rounded-xl shadow-drop px-9 pt-9 pb-25">
            {/* 모임 이름 & 설명 */}
            <div className="flex flex-col gap-xtiny w-full">
              <p className="typo-subtitle1 text-primary-300">{gathering.gatheringName}</p>
              {gathering.gatheringDescription && (
                <p className="typo-body3 text-grey-700 h-15 line-clamp-3">
                  {gathering.gatheringDescription}
                </p>
              )}
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center gap-tiny text-grey-600 typo-body6">
              <span>시작한지 {gathering.daysFromCreation}일</span>
              <span className="w-px h-2.5 bg-grey-600" />
              <span>약속 {gathering.totalMeetings}회</span>
              <span className="w-px h-2.5 bg-grey-600" />
              <span>총 구성원 {gathering.totalMembers}명</span>
            </div>
          </div>

          {/* 봉투 하단 */}
          <img src={EnvelopeBottom} alt="" className="relative -mt-24.25 w-full z-20" />
        </div>

        {/* 가입 신청 버튼 */}
        <Button
          variant="primary"
          size="large"
          className="w-full"
          disabled={isJoining}
          onClick={handleJoin}
        >
          {isLoggedIn ? '가입 신청하기' : '로그인하고 가입 신청하기'}
        </Button>
      </div>
    </div>
  )
}
