import { Link as LinkIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useGatheringDetail } from '@/features/gatherings'
import PaperPlane from '@/shared/assets/icon/paper-plane.svg'
import { ROUTES } from '@/shared/constants'
import { MobileLayoutFrame } from '@/shared/layout'
import { showErrorToast, showToast } from '@/shared/lib/toast'
import { Spinner } from '@/shared/ui'
import { useGlobalModalStore } from '@/store'

export default function MobileGatheringInvitePage() {
  const { id } = useParams<{ id: string }>()
  const parsedId = id ? Number(id) : NaN
  const gatheringId = Number.isFinite(parsedId) ? parsedId : 0
  const navigate = useNavigate()
  const { openError } = useGlobalModalStore()
  const { data: gathering, isLoading, error } = useGatheringDetail(gatheringId)

  useEffect(() => {
    if (!error) return

    openError('오류', '모임 정보를 불러오는 데 실패했습니다.', () => {
      navigate(ROUTES.GATHERING_SETTING(gatheringId), { replace: true })
    })
  }, [error, gatheringId, navigate, openError])

  if (isLoading) return <Spinner height="full" />

  if (!gathering) return null

  const inviteUrl = `${window.location.origin}${ROUTES.INVITE(gathering.invitationLink)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      showToast('초대링크가 복사되었습니다')
    } catch {
      showErrorToast('링크 복사에 실패했습니다.')
    }
  }

  return (
    <MobileLayoutFrame
      variant="header"
      title="초대 링크"
      leftAction={{ type: 'back', to: ROUTES.GATHERING_SETTING(gatheringId) }}
      bottomCTA={{ label: '복사하기', onClick: handleCopy }}
      className="min-h-dvh lg:hidden"
      contentClassName="lg:hidden"
    >
      <main className="flex flex-col items-center px-5 pt-10 text-center">
        <img src={PaperPlane} alt="종이비행기" className="mb-10 h-[182px] w-[209px]" />
        <p className="mb-6 whitespace-pre-line typo-m-body1 text-grey-600">
          초대 링크를 복사해서{`\n`}함께하고 싶은 멤버들에게 전달해 보세요
        </p>
        <div className="flex w-full items-center gap-4 rounded-full border border-grey-400 px-6 py-3">
          <p className="min-w-0 flex-1 truncate text-left typo-body1 text-grey-700">{inviteUrl}</p>
          <button
            type="button"
            className="relative flex size-5 shrink-0 items-center justify-center text-grey-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 before:absolute before:-inset-3 before:content-['']"
            onClick={handleCopy}
            aria-label="초대 링크 복사"
          >
            <LinkIcon aria-hidden className="size-5" />
          </button>
        </div>
      </main>
    </MobileLayoutFrame>
  )
}
