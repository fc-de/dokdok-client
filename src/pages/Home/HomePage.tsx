import { useUserProfile } from '@/features/user'

import FavoriteGatheringsSection from './components/FavoriteGatheringsSection'
import MyMeetingsSection from './components/MyMeetingsSection'
import ReadingBooksSection from './components/ReadingBooksSection'

export default function HomePage() {
  const { data: user } = useUserProfile()

  return (
    <div className="pb-20 pt-xlarge">
      {/* 인사말 */}
      <div className="flex flex-col gap-xtiny mb-8.5">
        <h1 className="text-black typo-heading2">안녕하세요, {user?.nickname ?? ''}님!</h1>
        <p className="text-grey-600 typo-heading2">읽고 있는 책과 생각을 기록해보세요</p>
      </div>

      <div className="flex flex-col gap-20">
        {/* 지금 읽고 있는 책 */}
        <ReadingBooksSection />

        {/* 내 약속 */}
        <MyMeetingsSection />

        {/* 즐겨찾는 모임 */}
        <FavoriteGatheringsSection />
      </div>
    </div>
  )
}
