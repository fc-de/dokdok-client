import { useUserProfile } from '@/features/user'

export default function HomePage() {
  const { data: user } = useUserProfile()

  return (
    <div className="flex flex-col gap-xtiny pt-xlarge">
      <h1 className="text-black typo-heading2">안녕하세요, {user?.nickname ?? ''}님!</h1>
      <p className="text-grey-600 typo-heading2">읽고 있는 책과 생각을 기록해보세요</p>
    </div>
  )
}
