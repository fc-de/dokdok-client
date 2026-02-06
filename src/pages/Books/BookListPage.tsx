import { BookList, useBooks } from '@/features/book'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'

export default function BookListPage() {
  const { data } = useBooks()

  // 첫 페이지에서 카운트 정보 가져오기
  const firstPage = data?.pages[0]
  const totalCount = firstPage?.totalCount ?? 0
  const readingCount = firstPage?.readingCount ?? 0
  const completedCount = firstPage?.completedCount ?? 0

  return (
    <div>
      <h1 className="typo-heading1 text-black mt-xlarge mb-medium">내 책장</h1>
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center">
          <TabsList size="large">
            <TabsTrigger value="all" badge={totalCount}>
              전체
            </TabsTrigger>
            <TabsTrigger value="reading" badge={readingCount}>
              기록 중
            </TabsTrigger>
            <TabsTrigger value="completed" badge={completedCount}>
              기록 완료
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-xsmall">
            <Button variant="secondary" outline disabled={totalCount === 0}>
              편집하기
            </Button>
            <Button>책 추가하기</Button>
          </div>
        </div>
        <TabsContent value="all">
          <BookList />
        </TabsContent>
        <TabsContent value="reading">
          <BookList status="READING" />
        </TabsContent>
        <TabsContent value="completed">
          <BookList status="COMPLETED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
