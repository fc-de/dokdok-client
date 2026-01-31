import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  DatePicker,
  FilterDropdown,
  Input,
  LikeButton,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  NumberedCheckbox,
  NumberedCheckboxGroup,
  Pagination,
  SearchField,
  Select,
  type StarRatingRange,
  StarRatingFilter,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  TextButton,
  TopicTypeSelectGroup,
  TopicTypeSelectItem,
  UserChip,
} from '@/shared/ui'

function ComponentGuidePage() {
  const [selectedSection, setSelectedSection] = useState<string>('button')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    { id: 'button', name: 'Button', category: '인터랙션' },
    { id: 'textButton', name: 'TextButton', category: '인터랙션' },
    { id: 'likeButton', name: 'LikeButton', category: '인터랙션' },
    { id: 'badge', name: 'Badge', category: '표시' },
    { id: 'chip', name: 'Chip', category: '표시' },
    { id: 'userChip', name: 'UserChip', category: '표시' },
    { id: 'avatar', name: 'Avatar', category: '표시' },
    { id: 'card', name: 'Card', category: '레이아웃' },
    { id: 'container', name: 'Container', category: '레이아웃' },
    { id: 'input', name: 'Input', category: '폼' },
    { id: 'textarea', name: 'Textarea', category: '폼' },
    { id: 'searchField', name: 'SearchField', category: '폼' },
    { id: 'checkbox', name: 'Checkbox', category: '폼' },
    { id: 'numberedCheckbox', name: 'NumberedCheckbox', category: '폼' },
    { id: 'switch', name: 'Switch', category: '폼' },
    { id: 'select', name: 'Select', category: '폼' },
    { id: 'topicTypeSelect', name: 'TopicTypeSelect', category: '폼' },
    { id: 'datePicker', name: 'DatePicker', category: '폼' },
    { id: 'filterDropdown', name: 'FilterDropdown', category: '폼' },
    { id: 'starRatingFilter', name: 'StarRatingFilter', category: '폼' },
    { id: 'tabs', name: 'Tabs', category: '내비게이션' },
    { id: 'pagination', name: 'Pagination', category: '내비게이션' },
    { id: 'modal', name: 'Modal', category: '오버레이' },
  ]

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = Array.from(new Set(sections.map((s) => s.category)))

  return (
    <div className="flex h-screen bg-grey-100">
      {/* Sidebar */}
      <aside className="sticky top-0 w-64 h-screen overflow-y-auto bg-white border-r border-grey-300 p-medium custom-scroll">
        <div className="mb-large">
          <h1 className="typo-heading2 text-grey-900 mb-small">컴포넌트 가이드</h1>
          <p className="typo-caption1 text-grey-600">{sections.length}개 컴포넌트</p>
        </div>

        <div className="mb-medium">
          <SearchField
            placeholder="컴포넌트 검색..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <nav>
          {categories.map((category) => {
            const categoryItems = filteredSections.filter((s) => s.category === category)
            if (categoryItems.length === 0) return null

            return (
              <div key={category} className="mb-medium">
                <h3 className="uppercase typo-caption2 text-grey-600 mb-tiny">{category}</h3>
                <ul className="space-y-tiny">
                  {categoryItems.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setSelectedSection(section.id)}
                        className={`w-full text-left px-small py-tiny rounded-small typo-body3 transition-colors ${
                          selectedSection === section.id
                            ? 'bg-primary-100 text-primary-300'
                            : 'text-grey-700 hover:bg-grey-100'
                        }`}
                      >
                        {section.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-large custom-scroll">
        <div className="">
          {selectedSection === 'button' && <ButtonSection />}
          {selectedSection === 'textButton' && <TextButtonSection />}
          {selectedSection === 'likeButton' && <LikeButtonSection />}
          {selectedSection === 'badge' && <BadgeSection />}
          {selectedSection === 'chip' && <ChipSection />}
          {selectedSection === 'userChip' && <UserChipSection />}
          {selectedSection === 'avatar' && <AvatarSection />}
          {selectedSection === 'card' && <CardSection />}
          {selectedSection === 'container' && <ContainerSection />}
          {selectedSection === 'input' && <InputSection />}
          {selectedSection === 'textarea' && <TextareaSection />}
          {selectedSection === 'searchField' && <SearchFieldSection />}
          {selectedSection === 'checkbox' && <CheckboxSection />}
          {selectedSection === 'numberedCheckbox' && <NumberedCheckboxSection />}
          {selectedSection === 'switch' && <SwitchSection />}
          {selectedSection === 'select' && <SelectSection />}
          {selectedSection === 'topicTypeSelect' && <TopicTypeSelectSection />}
          {selectedSection === 'datePicker' && <DatePickerSection />}
          {selectedSection === 'filterDropdown' && <FilterDropdownSection />}
          {selectedSection === 'starRatingFilter' && <StarRatingFilterSection />}
          {selectedSection === 'tabs' && <TabsSection />}
          {selectedSection === 'pagination' && <PaginationSection />}
          {selectedSection === 'modal' && <ModalSection />}
        </div>
      </main>
    </div>
  )
}

// Section Components
function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-large">
        <h2 className="typo-heading1 text-grey-900 mb-small">{title}</h2>
        {description && <p className="typo-body2 text-grey-600">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Showcase({
  title,
  description,
  code,
  children,
}: {
  title: string
  description?: string
  code?: string
  children: React.ReactNode
}) {
  const [showCode, setShowCode] = useState(false)

  return (
    <Card className="mb-medium">
      <div className="mb-medium">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="typo-subtitle2 text-grey-900 mb-tiny">{title}</h3>
            {description && <p className="typo-caption1 text-grey-600">{description}</p>}
          </div>
          {code && (
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center transition-colors px-small py-tiny rounded-small typo-caption2 text-grey-700 hover:bg-grey-100 gap-tiny"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showCode ? 'rotate-180' : ''}`}
              />
              코드
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-medium">{children}</div>
      {code && showCode && (
        <div className="mt-medium">
          <pre className="overflow-x-auto bg-grey-100 rounded-small p-small">
            <code className="typo-caption2 text-grey-900">{code}</code>
          </pre>
        </div>
      )}
    </Card>
  )
}

// Individual Component Sections
function ButtonSection() {
  return (
    <Section title="Button" description="다양한 변형과 크기를 지원하는 기본 버튼 컴포넌트">
      <Showcase
        title="변형"
        description="variant prop"
        code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ai">AI Button</Button>
<Button variant="cta">Call to Action</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ai">AI Button</Button>
        <Button variant="cta">Call to Action</Button>
      </Showcase>

      <Showcase
        title="크기"
        description="size prop"
        code={`<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`}
      >
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </Showcase>

      <Showcase
        title="아웃라인"
        description="outline prop (secondary & danger)"
        code={`<Button variant="secondary" outline>
  Secondary Outline
</Button>
<Button variant="danger" outline>
  Danger Outline
</Button>`}
      >
        <Button variant="secondary" outline>
          Secondary Outline
        </Button>
        <Button variant="danger" outline>
          Danger Outline
        </Button>
      </Showcase>

      <Showcase
        title="상태"
        code={`<Button disabled>Disabled</Button>
<Button asChild>
  <a href="#button">As Child (Link)</a>
</Button>`}
      >
        <Button disabled>Disabled</Button>
        <Button asChild>
          <a href="#button">As Child (Link)</a>
        </Button>
      </Showcase>
    </Section>
  )
}

function TextButtonSection() {
  return (
    <Section title="TextButton" description="아이콘을 선택적으로 포함할 수 있는 텍스트 전용 버튼">
      <Showcase
        title="크기"
        description="size prop"
        code={`<TextButton size="small">Small Text</TextButton>
<TextButton size="medium">Medium Text</TextButton>`}
      >
        <TextButton size="small">Small Text</TextButton>
        <TextButton size="medium">Medium Text</TextButton>
      </Showcase>

      <Showcase
        title="아이콘 포함"
        description="icon and iconPosition props"
        code={`<TextButton icon={ChevronRight} iconPosition="left">
  Icon Left
</TextButton>
<TextButton icon={ChevronRight} iconPosition="right">
  Icon Right
</TextButton>
<TextButton size="medium" icon={Search}>
  Medium with Icon
</TextButton>`}
      >
        <TextButton icon={ChevronRight} iconPosition="left">
          Icon Left
        </TextButton>
        <TextButton icon={ChevronRight} iconPosition="right">
          Icon Right
        </TextButton>
        <TextButton size="medium" icon={Search}>
          Medium with Icon
        </TextButton>
      </Showcase>

      <Showcase title="상태" code={`<TextButton disabled>Disabled</TextButton>`}>
        <TextButton disabled>Disabled</TextButton>
      </Showcase>
    </Section>
  )
}

function LikeButtonSection() {
  const [liked1, setLiked1] = useState(false)
  const [liked2, setLiked2] = useState(true)
  const [count1, setCount1] = useState(42)
  const [count2, setCount2] = useState(128)

  return (
    <Section title="LikeButton" description="좋아요 카운트를 표시하는 인터랙티브 버튼">
      <Showcase
        title="상태"
        description="isLiked and count props"
        code={`const [liked, setLiked] = useState(false)
const [count, setCount] = useState(42)

<LikeButton
  count={count}
  isLiked={liked}
  onClick={(newLiked) => {
    setLiked(newLiked)
    setCount(newLiked ? count + 1 : count - 1)
  }}
/>
<LikeButton count={999} isLiked={true} disabled />`}
      >
        <LikeButton
          count={count1}
          isLiked={liked1}
          onClick={(newLiked: boolean) => {
            setLiked1(newLiked)
            setCount1(newLiked ? count1 + 1 : count1 - 1)
          }}
        />
        <LikeButton
          count={count2}
          isLiked={liked2}
          onClick={(newLiked: boolean) => {
            setLiked2(newLiked)
            setCount2(newLiked ? count2 + 1 : count2 - 1)
          }}
        />
        <LikeButton count={0} isLiked={false} />
        <LikeButton count={999} isLiked={true} disabled />
      </Showcase>
    </Section>
  )
}

function BadgeSection() {
  return (
    <Section title="Badge" description="다양한 색상과 효과를 지원하는 작은 라벨 컴포넌트">
      <Showcase
        title="색상"
        description="color prop"
        code={`<Badge color="grey">Grey</Badge>
<Badge color="red">Red</Badge>
<Badge color="blue">Blue</Badge>
<Badge color="purple">Purple</Badge>
<Badge color="green">Green</Badge>
<Badge color="yellow">Yellow</Badge>`}
      >
        <Badge color="grey">Grey</Badge>
        <Badge color="red">Red</Badge>
        <Badge color="blue">Blue</Badge>
        <Badge color="purple">Purple</Badge>
        <Badge color="green">Green</Badge>
        <Badge color="yellow">Yellow</Badge>
      </Showcase>

      <Showcase
        title="크기"
        description="size prop"
        code={`<Badge size="small">Small Badge</Badge>
<Badge size="medium">Medium Badge</Badge>`}
      >
        <Badge size="small">Small Badge</Badge>
        <Badge size="medium">Medium Badge</Badge>
      </Showcase>

      <Showcase
        title="효과"
        description="effect prop (adds shadow)"
        code={`<Badge effect="off">No Effect</Badge>
<Badge effect="on">With Effect</Badge>
<Badge color="purple" effect="on">
  Purple Effect
</Badge>`}
      >
        <Badge effect="off">No Effect</Badge>
        <Badge effect="on">With Effect</Badge>
        <Badge color="purple" effect="on">
          Purple Effect
        </Badge>
      </Showcase>
    </Section>
  )
}

function ChipSection() {
  const [showEdit, setShowEdit] = useState(true)

  return (
    <Section title="Chip" description="태그, 필터, 선택 등에 사용되는 컴팩트한 요소">
      <Showcase
        title="변형"
        description="variant prop"
        code={`<Chip variant="default">Default</Chip>
<Chip variant="selected">Selected</Chip>
<Chip variant="edit" onDelete={() => console.log('deleted')}>
  Edit (deletable)
</Chip>
<Chip variant="success">Success</Chip>`}
      >
        <Chip variant="default">Default</Chip>
        <Chip variant="selected">Selected</Chip>
        {showEdit && (
          <Chip variant="edit" onDelete={() => setShowEdit(false)}>
            Edit (deletable)
          </Chip>
        )}
        <Chip variant="success">Success</Chip>
      </Showcase>

      <Showcase
        title="사용 예시"
        code={`<Chip>React</Chip>
<Chip variant="selected">TypeScript</Chip>
<Chip>Vite</Chip>
<Chip variant="selected">TailwindCSS</Chip>`}
      >
        <Chip>React</Chip>
        <Chip variant="selected">TypeScript</Chip>
        <Chip>Vite</Chip>
        <Chip variant="selected">TailwindCSS</Chip>
      </Showcase>
    </Section>
  )
}

function UserChipSection() {
  const [selected1, setSelected1] = useState(false)
  const [selected2, setSelected2] = useState(true)

  return (
    <Section title="UserChip" description="아바타와 이름을 포함하는 사용자 표시 칩">
      <Showcase
        title="변형"
        description="selected and removable props"
        code={`const [selected, setSelected] = useState(false)

<UserChip
  name="김철수"
  imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  selected={selected}
  onClick={() => setSelected(!selected)}
/>`}
      >
        <UserChip
          name="김철수"
          imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          selected={selected1}
          onClick={() => setSelected1(!selected1)}
        />
        <UserChip
          name="이영희"
          imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
          selected={selected2}
          onClick={() => setSelected2(!selected2)}
        />
      </Showcase>

      <Showcase
        title="삭제 가능"
        description="removable and onRemove props"
        code={`<UserChip
  name="박민수"
  imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
  removable
  onRemove={() => console.log('removed')}
/>
<UserChip name="최지현" selected removable onRemove={() => console.log('removed')} />`}
      >
        <UserChip
          name="박민수"
          imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
          removable
          onRemove={() => alert('Remove clicked')}
        />
        <UserChip name="최지현" selected removable onRemove={() => alert('Remove clicked')} />
      </Showcase>

      <Showcase
        title="이미지 없이"
        code={`<UserChip name="홍길동" selected={false} />
<UserChip name="김영수" selected />`}
      >
        <UserChip name="홍길동" selected={false} />
        <UserChip name="김영수" selected />
      </Showcase>
    </Section>
  )
}

function AvatarSection() {
  return (
    <Section title="Avatar" description="변형 뱃지와 그룹화를 지원하는 사용자 아바타">
      <Showcase
        title="변형"
        description="variant prop"
        code={`<Avatar variant="member">
  <AvatarImage src="..." alt="Member" />
  <AvatarFallback>M</AvatarFallback>
</Avatar>
<Avatar variant="leader">
  <AvatarImage src="..." alt="Leader" />
  <AvatarFallback>L</AvatarFallback>
</Avatar>
<Avatar variant="host">
  <AvatarImage src="..." alt="Host" />
  <AvatarFallback>H</AvatarFallback>
</Avatar>`}
      >
        <Avatar variant="member">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Member" alt="Member" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <Avatar variant="leader">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Leader" alt="Leader" />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <Avatar variant="host">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Host" alt="Host" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
      </Showcase>

      <Showcase
        title="크기"
        description="size prop (badge size)"
        code={`<Avatar variant="leader" size="sm">
  <AvatarImage src="..." alt="Small" />
</Avatar>
<Avatar variant="leader" size="default">
  <AvatarImage src="..." alt="Default" />
</Avatar>`}
      >
        <Avatar variant="leader" size="sm">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Small" alt="Small" />
        </Avatar>
        <Avatar variant="leader" size="default">
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
            alt="Default"
          />
        </Avatar>
      </Showcase>

      <Showcase
        title="상태"
        code={`<Avatar disabled>
  <AvatarImage src="..." alt="Disabled" />
</Avatar>
<Avatar>
  <AvatarFallback>FB</AvatarFallback>
</Avatar>`}
      >
        <Avatar disabled>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Disabled"
            alt="Disabled"
          />
        </Avatar>
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      </Showcase>

      <Showcase
        title="아바타 그룹"
        description="AvatarGroup component"
        code={`<AvatarGroup>
  <Avatar>
    <AvatarImage src="..." alt="User 1" />
  </Avatar>
  <Avatar>
    <AvatarImage src="..." alt="User 2" />
  </Avatar>
  <Avatar>
    <AvatarImage src="..." alt="User 3" />
  </Avatar>
  <AvatarGroupCount
    items={[
      { id: '1', name: 'User 4', src: '...' },
      { id: '2', name: 'User 5' },
    ]}
  />
</AvatarGroup>`}
      >
        <AvatarGroup>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1" alt="User 1" />
          </Avatar>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2" alt="User 2" />
          </Avatar>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User3" alt="User 3" />
          </Avatar>
          <AvatarGroupCount
            items={[
              {
                id: '1',
                name: 'User 4',
                src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User4',
              },
              { id: '2', name: 'User 5' },
            ]}
          />
        </AvatarGroup>
      </Showcase>
    </Section>
  )
}

function CardSection() {
  return (
    <Section title="Card" description="테두리와 그림자가 있는 단순한 컨테이너">
      <Showcase
        title="기본 사용"
        code={`<Card>
  <div className="typo-body2">패딩과 테두리가 있는 기본 카드</div>
</Card>`}
      >
        <Card>
          <div className="typo-body2">패딩과 테두리가 있는 기본 카드</div>
        </Card>
      </Showcase>

      <Showcase
        title="커스텀 컨텐츠"
        code={`<Card className="w-80">
  <h3 className="typo-subtitle2 mb-small">카드 제목</h3>
  <p className="typo-body3 text-grey-600">
    커스텀 컨텐츠가 포함된 카드 컴포넌트입니다.
  </p>
</Card>`}
      >
        <Card className="w-80">
          <h3 className="typo-subtitle2 mb-small">카드 제목</h3>
          <p className="typo-body3 text-grey-600">
            커스텀 컨텐츠가 포함된 카드 컴포넌트입니다. 관련된 정보를 그룹화하기 위한 깔끔한
            컨테이너를 제공합니다.
          </p>
        </Card>
      </Showcase>
    </Section>
  )
}

function ContainerSection() {
  return (
    <Section title="Container" description="제목과 컨텐츠 영역이 구조화된 컨테이너">
      <Showcase
        title="기본 사용"
        description="Namespace pattern"
        code={`<Container>
  <Container.Title>컨테이너 제목</Container.Title>
  <Container.Content>
    <p>이것은 컨텐츠 영역입니다.</p>
  </Container.Content>
</Container>`}
      >
        <Container className="w-96">
          <Container.Title>컨테이너 제목</Container.Title>
          <Container.Content>
            <p className="typo-body3 text-grey-600">
              이것은 컨텐츠 영역입니다. Container 컴포넌트는 Title과 Content 서브컴포넌트를 사용하는
              네임스페이스 패턴을 사용합니다.
            </p>
          </Container.Content>
        </Container>
      </Showcase>

      <Showcase
        title="여러 섹션"
        code={`<Container>
  <Container.Title>설정</Container.Title>
  <Container.Content>
    <div className="space-y-small">
      <div className="flex items-center justify-between">
        <span>알림</span>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <span>자동 저장</span>
        <Switch />
      </div>
    </div>
  </Container.Content>
</Container>`}
      >
        <Container className="w-96">
          <Container.Title>설정</Container.Title>
          <Container.Content>
            <div className="space-y-small">
              <div className="flex items-center justify-between">
                <span className="typo-body3">알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="typo-body3">자동 저장</span>
                <Switch />
              </div>
            </div>
          </Container.Content>
        </Container>
      </Showcase>
    </Section>
  )
}

function InputSection() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('Error example')

  return (
    <Section title="Input" description="라벨, 에러, 도움말 텍스트를 지원하는 텍스트 입력">
      <Showcase
        title="기본"
        description="With label"
        code={`<Input label="사용자명" placeholder="사용자명을 입력하세요" />`}
      >
        <Input label="사용자명" placeholder="사용자명을 입력하세요" className="w-64" />
      </Showcase>

      <Showcase
        title="도움말 텍스트"
        description="helperText prop"
        code={`<Input
  label="이메일"
  placeholder="email@example.com"
  helperText="이메일은 절대 공유되지 않습니다"
/>`}
      >
        <Input
          label="이메일"
          placeholder="email@example.com"
          helperText="이메일은 절대 공유되지 않습니다"
          className="w-64"
        />
      </Showcase>

      <Showcase
        title="에러 상태"
        description="error and errorMessage props"
        code={`<Input
  label="비밀번호"
  type="password"
  error
  errorMessage="비밀번호는 최소 8자 이상이어야 합니다"
/>`}
      >
        <Input
          label="비밀번호"
          type="password"
          value={value2}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue2(e.target.value)}
          error
          errorMessage="비밀번호는 최소 8자 이상이어야 합니다"
          className="w-64"
        />
      </Showcase>

      <Showcase
        title="글자 수 카운터"
        description="maxLength prop (auto-shows counter)"
        code={`<Input
  label="자기소개"
  placeholder="자신에 대해 알려주세요"
  maxLength={50}
/>`}
      >
        <Input
          label="자기소개"
          placeholder="자신에 대해 알려주세요"
          value={value1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue1(e.target.value)}
          maxLength={50}
          className="w-64"
        />
      </Showcase>

      <Showcase
        title="상태"
        code={`<Input placeholder="기본" />
<Input placeholder="비활성화" disabled />`}
      >
        <Input placeholder="기본" className="w-64" />
        <Input placeholder="비활성화" disabled className="w-64" />
      </Showcase>
    </Section>
  )
}

function TextareaSection() {
  const [value, setValue] = useState('')

  return (
    <Section title="Textarea" description="커스텀 높이를 지원하는 여러 줄 텍스트 입력">
      <Showcase title="기본" code={`<Textarea placeholder="메시지를 입력하세요..." />`}>
        <Textarea placeholder="메시지를 입력하세요..." className="w-96" />
      </Showcase>

      <Showcase
        title="글자 수 카운터"
        description="maxLength prop"
        code={`<Textarea
  placeholder="최대 200자"
  maxLength={200}
/>`}
      >
        <Textarea
          placeholder="최대 200자"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
          maxLength={200}
          className="w-96"
        />
      </Showcase>

      <Showcase
        title="에러 상태"
        code={`<Textarea
  placeholder="필수 입력 항목"
  error
  errorMessage="이 항목은 필수입니다"
/>`}
      >
        <Textarea
          placeholder="필수 입력 항목"
          error
          errorMessage="이 항목은 필수입니다"
          className="w-96"
        />
      </Showcase>

      <Showcase
        title="커스텀 높이"
        description="height prop (default: 180px)"
        code={`<Textarea placeholder="커스텀 높이" height={120} />`}
      >
        <Textarea placeholder="커스텀 높이" height={120} className="w-96" />
      </Showcase>
    </Section>
  )
}

function SearchFieldSection() {
  const [value, setValue] = useState('')

  return (
    <Section title="SearchField" description="검색 아이콘 스타일링이 적용된 텍스트 입력">
      <Showcase title="기본 사용" code={`<SearchField placeholder="검색..." />`}>
        <SearchField
          placeholder="검색..."
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          className="w-64"
        />
      </Showcase>

      <Showcase
        title="값 포함"
        code={`<SearchField placeholder="컴포넌트 검색..." defaultValue="Button" />`}
      >
        <SearchField placeholder="컴포넌트 검색..." defaultValue="Button" className="w-64" />
      </Showcase>
    </Section>
  )
}

function CheckboxSection() {
  const [checked1, setChecked1] = useState<boolean | 'indeterminate'>(false)
  const [checked2, setChecked2] = useState<boolean | 'indeterminate'>(true)
  const [checked3, setChecked3] = useState<boolean | 'indeterminate'>('indeterminate')

  return (
    <Section title="Checkbox" description="불확정 상태를 지원하는 표준 체크박스">
      <Showcase
        title="상태"
        description="checked prop"
        code={`const [checked, setChecked] = useState(false)

<Checkbox checked={checked} onCheckedChange={setChecked} id="check1" />
<label htmlFor="check1">미선택</label>

// indeterminate state
<Checkbox checked="indeterminate" onCheckedChange={setChecked} id="check2" />`}
      >
        <div className="flex items-center gap-small">
          <Checkbox checked={checked1} onCheckedChange={setChecked1} id="check1" />
          <label htmlFor="check1" className="typo-body3">
            미선택
          </label>
        </div>
        <div className="flex items-center gap-small">
          <Checkbox checked={checked2} onCheckedChange={setChecked2} id="check2" />
          <label htmlFor="check2" className="typo-body3">
            선택됨
          </label>
        </div>
        <div className="flex items-center gap-small">
          <Checkbox checked={checked3} onCheckedChange={setChecked3} id="check3" />
          <label htmlFor="check3" className="typo-body3">
            불확정
          </label>
        </div>
      </Showcase>

      <Showcase
        title="비활성화"
        code={`<Checkbox disabled />
<Checkbox disabled checked />`}
      >
        <div className="flex items-center gap-small">
          <Checkbox disabled id="disabled1" />
          <label htmlFor="disabled1" className="typo-body3 text-grey-500">
            비활성화
          </label>
        </div>
        <div className="flex items-center gap-small">
          <Checkbox disabled checked id="disabled2" />
          <label htmlFor="disabled2" className="typo-body3 text-grey-500">
            비활성화 (선택됨)
          </label>
        </div>
      </Showcase>
    </Section>
  )
}

function NumberedCheckboxSection() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <Section title="NumberedCheckbox" description="선택 순서를 숫자로 표시하는 체크박스">
      <Showcase
        title="기본 사용"
        description="Shows sequential numbers based on selection order"
        code={`const [selected, setSelected] = useState<string[]>([])

<NumberedCheckboxGroup value={selected} onChange={setSelected}>
  <NumberedCheckbox id="option1">
    <label htmlFor="option1">옵션 1</label>
  </NumberedCheckbox>
  <NumberedCheckbox id="option2">
    <label htmlFor="option2">옵션 2</label>
  </NumberedCheckbox>
  <NumberedCheckbox id="option3">
    <label htmlFor="option3">옵션 3</label>
  </NumberedCheckbox>
</NumberedCheckboxGroup>`}
      >
        <NumberedCheckboxGroup value={selected} onChange={setSelected}>
          <div className="flex gap-medium">
            <NumberedCheckbox id="option1">
              <label htmlFor="option1" className="typo-body3">
                옵션 1
              </label>
            </NumberedCheckbox>
            <NumberedCheckbox id="option2">
              <label htmlFor="option2" className="typo-body3">
                옵션 2
              </label>
            </NumberedCheckbox>
            <NumberedCheckbox id="option3">
              <label htmlFor="option3" className="typo-body3">
                옵션 3
              </label>
            </NumberedCheckbox>
            <NumberedCheckbox id="option4">
              <label htmlFor="option4" className="typo-body3">
                옵션 4
              </label>
            </NumberedCheckbox>
          </div>
        </NumberedCheckboxGroup>
      </Showcase>

      <Showcase title="선택 순서 표시">
        <div className="typo-body3 text-grey-600">
          선택됨: {selected.length > 0 ? selected.join(', ') : '없음'}
        </div>
      </Showcase>
    </Section>
  )
}

function SwitchSection() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)

  return (
    <Section title="Switch" description="토글 스위치 컴포넌트">
      <Showcase
        title="상태"
        code={`const [checked, setChecked] = useState(false)

<Switch checked={checked} onCheckedChange={setChecked} id="switch1" />
<label htmlFor="switch1">꺼짐</label>`}
      >
        <div className="flex items-center gap-small">
          <Switch checked={checked1} onCheckedChange={setChecked1} id="switch1" />
          <label htmlFor="switch1" className="typo-body3">
            꺼짐
          </label>
        </div>
        <div className="flex items-center gap-small">
          <Switch checked={checked2} onCheckedChange={setChecked2} id="switch2" />
          <label htmlFor="switch2" className="typo-body3">
            켜짐
          </label>
        </div>
      </Showcase>

      <Showcase
        title="비활성화"
        code={`<Switch disabled />
<Switch disabled checked />`}
      >
        <div className="flex items-center gap-small">
          <Switch disabled id="switch-disabled1" />
          <label htmlFor="switch-disabled1" className="typo-body3 text-grey-500">
            비활성화 (꺼짐)
          </label>
        </div>
        <div className="flex items-center gap-small">
          <Switch disabled checked id="switch-disabled2" />
          <label htmlFor="switch-disabled2" className="typo-body3 text-grey-500">
            비활성화 (켜짐)
          </label>
        </div>
      </Showcase>
    </Section>
  )
}

function SelectSection() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('react')

  return (
    <Section title="Select" description="커스텀 스타일링이 적용된 드롭다운 선택 컴포넌트">
      <Showcase
        title="기본 사용"
        description="With label and placeholder"
        code={`<Select
  label="프레임워크"
  placeholder="프레임워크를 선택하세요"
  value={value}
  onValueChange={setValue}
>
  <Select.SelectItem value="react">React</Select.SelectItem>
  <Select.SelectItem value="vue">Vue</Select.SelectItem>
  <Select.SelectItem value="angular">Angular</Select.SelectItem>
</Select>`}
      >
        <Select
          label="프레임워크"
          placeholder="프레임워크를 선택하세요"
          value={value1}
          onValueChange={setValue1}
        >
          <Select.SelectItem value="react">React</Select.SelectItem>
          <Select.SelectItem value="vue">Vue</Select.SelectItem>
          <Select.SelectItem value="angular">Angular</Select.SelectItem>
          <Select.SelectItem value="svelte">Svelte</Select.SelectItem>
        </Select>
      </Showcase>

      <Showcase
        title="기본 값 포함"
        code={`<Select label="언어" value="react" onValueChange={setValue}>
  <Select.SelectItem value="javascript">JavaScript</Select.SelectItem>
  <Select.SelectItem value="typescript">TypeScript</Select.SelectItem>
</Select>`}
      >
        <Select label="언어" value={value2} onValueChange={setValue2}>
          <Select.SelectItem value="javascript">JavaScript</Select.SelectItem>
          <Select.SelectItem value="typescript">TypeScript</Select.SelectItem>
          <Select.SelectItem value="python">Python</Select.SelectItem>
          <Select.SelectItem value="react">React</Select.SelectItem>
        </Select>
      </Showcase>

      <Showcase
        title="비활성화 옵션 포함"
        code={`<Select label="상태" placeholder="상태를 선택하세요">
  <Select.SelectItem value="active">활성</Select.SelectItem>
  <Select.SelectItem value="disabled" disabled>
    비활성화된 옵션
  </Select.SelectItem>
</Select>`}
      >
        <Select label="상태" placeholder="상태를 선택하세요">
          <Select.SelectItem value="active">활성</Select.SelectItem>
          <Select.SelectItem value="pending">대기중</Select.SelectItem>
          <Select.SelectItem value="disabled" disabled>
            비활성화된 옵션
          </Select.SelectItem>
        </Select>
      </Showcase>
    </Section>
  )
}

function TopicTypeSelectSection() {
  const [singleValue, setSingleValue] = useState('')
  const [multiValue, setMultiValue] = useState<string[]>([])

  return (
    <Section
      title="TopicTypeSelect"
      description="단일/다중 선택 모드를 지원하는 주제 타입 전용 선택 컴포넌트"
    >
      <Showcase
        title="단일 선택"
        description="type='single' (default)"
        code={`<TopicTypeSelectGroup type="single" value={value} onChange={setValue}>
  <TopicTypeSelectItem value="tech">기술</TopicTypeSelectItem>
  <TopicTypeSelectItem value="design">디자인</TopicTypeSelectItem>
  <TopicTypeSelectItem value="business">비즈니스</TopicTypeSelectItem>
</TopicTypeSelectGroup>`}
      >
        <TopicTypeSelectGroup type="single" value={singleValue} onChange={setSingleValue}>
          <div className="flex gap-small">
            <TopicTypeSelectItem value="tech">기술</TopicTypeSelectItem>
            <TopicTypeSelectItem value="design">디자인</TopicTypeSelectItem>
            <TopicTypeSelectItem value="business">비즈니스</TopicTypeSelectItem>
            <TopicTypeSelectItem value="other">기타</TopicTypeSelectItem>
          </div>
        </TopicTypeSelectGroup>
      </Showcase>

      <Showcase
        title="다중 선택"
        description="type='multiple'"
        code={`<TopicTypeSelectGroup type="multiple" value={value} onChange={setValue}>
  <TopicTypeSelectItem value="react">React</TopicTypeSelectItem>
  <TopicTypeSelectItem value="vue">Vue</TopicTypeSelectItem>
  <TopicTypeSelectItem value="angular">Angular</TopicTypeSelectItem>
</TopicTypeSelectGroup>`}
      >
        <TopicTypeSelectGroup type="multiple" value={multiValue} onChange={setMultiValue}>
          <div className="flex flex-wrap gap-small">
            <TopicTypeSelectItem value="react">React</TopicTypeSelectItem>
            <TopicTypeSelectItem value="vue">Vue</TopicTypeSelectItem>
            <TopicTypeSelectItem value="angular">Angular</TopicTypeSelectItem>
            <TopicTypeSelectItem value="svelte">Svelte</TopicTypeSelectItem>
          </div>
        </TopicTypeSelectGroup>
      </Showcase>

      <Showcase
        title="최대 선택 수 제한"
        description="maxSelection prop (multiple mode)"
        code={`<TopicTypeSelectGroup
  type="multiple"
  value={value}
  onChange={setValue}
  maxSelection={2}
>
  <TopicTypeSelectItem value="frontend">프론트엔드</TopicTypeSelectItem>
  <TopicTypeSelectItem value="backend">백엔드</TopicTypeSelectItem>
</TopicTypeSelectGroup>`}
      >
        <TopicTypeSelectGroup
          type="multiple"
          value={multiValue}
          onChange={setMultiValue}
          maxSelection={2}
        >
          <div className="flex gap-small">
            <TopicTypeSelectItem value="frontend">프론트엔드</TopicTypeSelectItem>
            <TopicTypeSelectItem value="backend">백엔드</TopicTypeSelectItem>
            <TopicTypeSelectItem value="devops">DevOps</TopicTypeSelectItem>
            <TopicTypeSelectItem value="ai">AI/ML</TopicTypeSelectItem>
          </div>
        </TopicTypeSelectGroup>
        <div className="typo-caption1 text-grey-600">최대 2개까지 선택 가능</div>
      </Showcase>
    </Section>
  )
}

function DatePickerSection() {
  const [date1, setDate1] = useState<Date | null>(null)
  const [date2, setDate2] = useState<Date | null>(new Date())

  return (
    <Section title="DatePicker" description="캘린더 팝오버를 사용하는 날짜 선택 컴포넌트">
      <Showcase
        title="기본 사용"
        code={`const [date, setDate] = useState<Date | null>(null)

<DatePicker value={date} onChange={setDate} placeholder="날짜 선택" />`}
      >
        <DatePicker value={date1} onChange={setDate1} placeholder="날짜 선택" />
      </Showcase>

      <Showcase
        title="기본 값 포함"
        code={`const [date, setDate] = useState<Date | null>(new Date())

<DatePicker value={date} onChange={setDate} />`}
      >
        <DatePicker value={date2} onChange={setDate2} />
      </Showcase>

      <Showcase
        title="커스텀 플레이스홀더"
        code={`<DatePicker value={date} onChange={setDate} placeholder="생일을 선택하세요" />`}
      >
        <DatePicker value={date1} onChange={setDate1} placeholder="생일을 선택하세요" />
      </Showcase>
    </Section>
  )
}

function TabsSection() {
  return (
    <Section title="Tabs" description="다양한 크기 변형을 지원하는 탭 내비게이션">
      <Showcase
        title="작은 크기"
        description="size='small'"
        code={`<Tabs defaultValue="tab1">
  <TabsList size="small">
    <TabsTrigger value="tab1" size="small">탭 1</TabsTrigger>
    <TabsTrigger value="tab2" size="small">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <Card>탭 1의 컨텐츠</Card>
  </TabsContent>
  <TabsContent value="tab2">
    <Card>탭 2의 컨텐츠</Card>
  </TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="tab1" className="w-96">
          <TabsList size="small">
            <TabsTrigger value="tab1" size="small">
              탭 1
            </TabsTrigger>
            <TabsTrigger value="tab2" size="small">
              탭 2
            </TabsTrigger>
            <TabsTrigger value="tab3" size="small">
              탭 3
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <div className="typo-body3">탭 1의 컨텐츠</div>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card>
              <div className="typo-body3">탭 2의 컨텐츠</div>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card>
              <div className="typo-body3">탭 3의 컨텐츠</div>
            </Card>
          </TabsContent>
        </Tabs>
      </Showcase>

      <Showcase
        title="중간 크기"
        description="size='medium'"
        code={`<Tabs defaultValue="home">
  <TabsList size="medium">
    <TabsTrigger value="home" size="medium">홈</TabsTrigger>
    <TabsTrigger value="profile" size="medium" badge={<Badge>New</Badge>}>
      프로필
    </TabsTrigger>
  </TabsList>
  <TabsContent value="home">
    <Card>홈 컨텐츠</Card>
  </TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="home" className="w-96">
          <TabsList size="medium">
            <TabsTrigger value="home" size="medium">
              홈
            </TabsTrigger>
            <TabsTrigger value="profile" size="medium" badge={<Badge>New</Badge>}>
              프로필
            </TabsTrigger>
            <TabsTrigger value="settings" size="medium">
              설정
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <Card>
              <div className="typo-body3">홈 컨텐츠</div>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <div className="typo-body3">뱃지가 있는 프로필 컨텐츠</div>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <div className="typo-body3">설정 컨텐츠</div>
            </Card>
          </TabsContent>
        </Tabs>
      </Showcase>

      <Showcase
        title="큰 크기"
        description="size='large'"
        code={`<Tabs defaultValue="overview">
  <TabsList size="large">
    <TabsTrigger value="overview" size="large" badge={<Badge color="blue">5</Badge>}>
      개요
    </TabsTrigger>
    <TabsTrigger value="details" size="large">상세</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <Card>뱃지 카운트가 있는 개요</Card>
  </TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview" className="w-96">
          <TabsList size="large">
            <TabsTrigger value="overview" size="large" badge={<Badge color="blue">5</Badge>}>
              개요
            </TabsTrigger>
            <TabsTrigger value="details" size="large">
              상세
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <div className="typo-body3">뱃지 카운트가 있는 개요</div>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <div className="typo-body3">상세 정보</div>
            </Card>
          </TabsContent>
        </Tabs>
      </Showcase>
    </Section>
  )
}

function FilterDropdownSection() {
  const [selectedClub, setSelectedClub] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('react')

  return (
    <Section title="FilterDropdown" description="단일 선택 필터 컴포넌트 (토글 지원)">
      <Showcase
        title="기본 사용"
        description="단일 선택만 가능한 필터"
        code={`const [selected, setSelected] = useState('')

<FilterDropdown placeholder="독서모임" value={selected} onChange={setSelected}>
  <FilterDropdown.Option value="club1">독서클럽이름열두글자어때</FilterDropdown.Option>
  <FilterDropdown.Option value="club2">FCDE</FilterDropdown.Option>
  <FilterDropdown.Option value="club3">책읽기모임</FilterDropdown.Option>
</FilterDropdown>`}
      >
        <FilterDropdown placeholder="독서모임" value={selectedClub} onChange={setSelectedClub}>
          <FilterDropdown.Option value="club1">독서클럽이름열두글자어때</FilterDropdown.Option>
          <FilterDropdown.Option value="club2">FCDE</FilterDropdown.Option>
          <FilterDropdown.Option value="club3">책읽기모임</FilterDropdown.Option>
        </FilterDropdown>
        <div className="typo-caption1 text-grey-600">선택된 값: {selectedClub || '없음'}</div>
      </Showcase>

      <Showcase
        title="기본 값 포함"
        description="초기 선택 값이 있는 경우"
        code={`const [selected, setSelected] = useState('react')

<FilterDropdown placeholder="카테고리" value={selected} onChange={setSelected}>
  <FilterDropdown.Option value="react">React</FilterDropdown.Option>
  <FilterDropdown.Option value="vue">Vue</FilterDropdown.Option>
  <FilterDropdown.Option value="angular">Angular</FilterDropdown.Option>
</FilterDropdown>`}
      >
        <FilterDropdown
          placeholder="카테고리"
          value={selectedCategory}
          onChange={setSelectedCategory}
        >
          <FilterDropdown.Option value="react">React</FilterDropdown.Option>
          <FilterDropdown.Option value="vue">Vue</FilterDropdown.Option>
          <FilterDropdown.Option value="angular">Angular</FilterDropdown.Option>
        </FilterDropdown>
      </Showcase>

      <Showcase
        title="비활성화 상태"
        code={`<FilterDropdown placeholder="비활성화" disabled>
  <FilterDropdown.Option value="option1">옵션 1</FilterDropdown.Option>
</FilterDropdown>`}
      >
        <FilterDropdown placeholder="비활성화" disabled>
          <FilterDropdown.Option value="option1">옵션 1</FilterDropdown.Option>
        </FilterDropdown>
      </Showcase>

      <Showcase title="토글 기능">
        <div className="typo-caption1 text-grey-600">
          이미 선택된 옵션을 다시 클릭하면 선택이 해제됩니다
        </div>
      </Showcase>
    </Section>
  )
}

function ModalSection() {
  return (
    <Section title="Modal" description="고정 높이와 내부 스크롤을 지원하는 모달 컴포넌트">
      <Showcase
        title="기본 사용 (Normal)"
        description="variant='normal' (600px 너비), Footer 버튼 오른쪽 정렬"
        code={`<Modal>
  <ModalTrigger asChild>
    <Button>모달 열기</Button>
  </ModalTrigger>
  <ModalContent variant="normal">
    <ModalHeader>
      <ModalTitle>모달 제목</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <p>모달 내용이 들어갑니다.</p>
    </ModalBody>
    <ModalFooter>
      <Button>확인</Button>
    </ModalFooter>
  </ModalContent>
</Modal>`}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button>Normal 모달 열기</Button>
          </ModalTrigger>
          <ModalContent variant="normal">
            <ModalHeader>
              <ModalTitle>일반 모달</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-medium">
                <p className="typo-body2 text-grey-700">
                  이것은 기본 너비(600px)의 모달입니다. 높이는 625px로 고정되어 있으며, 내용이 넘칠
                  경우 Body 영역에서만 스크롤이 발생합니다.
                </p>
                <div className="space-y-small">
                  <Input label="이름" placeholder="이름을 입력하세요" />
                  <Input label="이메일" placeholder="이메일을 입력하세요" />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button>확인</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Showcase>

      <Showcase
        title="넓은 모달 (Wide)"
        description="variant='wide' (900px 너비)"
        code={`<Modal>
  <ModalTrigger asChild>
    <Button>Wide 모달 열기</Button>
  </ModalTrigger>
  <ModalContent variant="wide">
    <ModalHeader>
      <ModalTitle>넓은 모달</ModalTitle>
    </ModalHeader>
    <ModalBody>...</ModalBody>
    <ModalFooter>...</ModalFooter>
  </ModalContent>
</Modal>`}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button>Wide 모달 열기</Button>
          </ModalTrigger>
          <ModalContent variant="wide">
            <ModalHeader>
              <ModalTitle>넓은 모달</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-medium">
                <p className="typo-body2 text-grey-700">
                  이것은 넓은 너비(900px)의 모달입니다. 더 많은 콘텐츠를 표시하기에 적합합니다.
                </p>
                <div className="grid grid-cols-2 gap-medium">
                  <Input label="이름" placeholder="이름" />
                  <Input label="이메일" placeholder="이메일" />
                  <Input label="전화번호" placeholder="전화번호" />
                  <Input label="주소" placeholder="주소" />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="secondary">취소</Button>
              </ModalClose>
              <Button>저장</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Showcase>

      <Showcase
        title="Footer 전체 너비 버튼"
        description="variant='full' - 버튼 하나가 전체 너비 차지"
        code={`<ModalFooter variant="full">
  <Button className="w-full">확인</Button>
</ModalFooter>`}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">Full 버튼 모달</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>알림</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p className="typo-body2 text-grey-700">
                Footer에 전체 너비 버튼이 있는 모달입니다. 단일 액션만 필요한 경우에 사용합니다.
              </p>
            </ModalBody>
            <ModalFooter variant="full">
              <ModalClose asChild>
                <Button className="w-full">확인</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Showcase>

      <Showcase
        title="Footer 없음"
        description="ModalFooter를 생략하면 Footer가 표시되지 않습니다"
        code={`<ModalContent>
  <ModalHeader>
    <ModalTitle>알림</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <p>Footer가 없는 모달입니다.</p>
  </ModalBody>
</ModalContent>`}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">Footer 없는 모달</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>알림</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p className="typo-body2 text-grey-700">
                이 모달은 Footer가 없습니다. 단순한 정보 표시용으로 사용할 수 있습니다.
              </p>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Showcase>

      <Showcase
        title="스크롤 테스트"
        description="내용이 많을 경우 Body 영역에서만 스크롤 발생"
        code={`<ModalBody>
  {/* 긴 내용 - Header/Footer 고정, Body만 스크롤 */}
</ModalBody>`}
      >
        <Modal>
          <ModalTrigger asChild>
            <Button variant="secondary">스크롤 테스트</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>긴 내용의 모달</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-medium">
                {[...Array(15).keys()].map((i) => (
                  <Card key={i}>
                    <p className="typo-body2">
                      스크롤 테스트용 컨텐츠 #{i + 1}. Header와 Footer는 고정되고, Body 영역에서만
                      스크롤이 발생합니다.
                    </p>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter variant="full">
              <ModalClose asChild>
                <Button className="w-full">닫기</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Showcase>
    </Section>
  )
}

function PaginationSection() {
  const [page1, setPage1] = useState(0)
  const [page2, setPage2] = useState(0)
  const [page3, setPage3] = useState(0)

  return (
    <Section title="Pagination" description="페이지 번호와 이전/다음 버튼을 포함한 페이지네이션 컴포넌트">
      <Showcase
        title="기본 사용"
        description="5페이지 미만 (화살표 버튼 없음)"
        code={`const [currentPage, setCurrentPage] = useState(0)

<Pagination
  currentPage={currentPage}
  totalPages={4}
  onPageChange={setCurrentPage}
/>`}
      >
        <div className="w-full">
          <Pagination currentPage={page1} totalPages={4} onPageChange={setPage1} />
          <div className="typo-caption1 text-grey-600 mt-small text-center">
            현재 페이지: {page1 + 1} / 4
          </div>
        </div>
      </Showcase>

      <Showcase
        title="다중 페이지 그룹"
        description="5페이지 이상 (화살표 버튼 표시)"
        code={`const [currentPage, setCurrentPage] = useState(0)

<Pagination
  currentPage={currentPage}
  totalPages={12}
  onPageChange={setCurrentPage}
/>`}
      >
        <div className="w-full">
          <Pagination currentPage={page2} totalPages={12} onPageChange={setPage2} />
          <div className="typo-caption1 text-grey-600 mt-small text-center">
            현재 페이지: {page2 + 1} / 12
          </div>
        </div>
      </Showcase>

      <Showcase
        title="많은 페이지"
        description="페이지 그룹 네비게이션 테스트"
        code={`const [currentPage, setCurrentPage] = useState(0)

<Pagination
  currentPage={currentPage}
  totalPages={30}
  onPageChange={setCurrentPage}
  showPages={5}
/>`}
      >
        <div className="w-full">
          <Pagination
            currentPage={page3}
            totalPages={30}
            onPageChange={setPage3}
            showPages={5}
          />
          <div className="typo-caption1 text-grey-600 mt-small text-center">
            현재 페이지: {page3 + 1} / 30
          </div>
        </div>
      </Showcase>

      <Showcase title="기능 설명">
        <div className="typo-caption1 text-grey-600 space-y-tiny">
          <p>• 페이지 번호는 0부터 시작하지만 UI에는 1부터 표시됩니다</p>
          <p>• 5페이지 미만일 경우 모든 페이지 번호를 표시하고 화살표 버튼은 숨깁니다</p>
          <p>• 5페이지 이상일 경우 현재 그룹의 페이지만 표시하고 화살표로 그룹 이동</p>
          <p>• 페이지 변경 시 자동으로 페이지 상단으로 스크롤됩니다</p>
          <p>• showPages prop으로 한 번에 표시할 페이지 수를 조정할 수 있습니다</p>
        </div>
      </Showcase>
    </Section>
  )
}

function StarRatingFilterSection() {
  const [rating1, setRating1] = useState<StarRatingRange | null>(null)
  const [rating2, setRating2] = useState<StarRatingRange | null>({ min: 3, max: 5 })

  return (
    <Section title="StarRatingFilter" description="별점 범위 선택 필터 컴포넌트">
      <Showcase
        title="기본 사용"
        description="별점 범위를 선택할 수 있는 필터"
        code={`const [rating, setRating] = useState<StarRatingRange | null>(null)

<StarRatingFilter
  placeholder="별점"
  value={rating}
  onChange={setRating}
/>`}
      >
        <StarRatingFilter placeholder="별점" value={rating1} onChange={setRating1} />
        <div className="typo-caption1 text-grey-600">
          선택된 범위: {rating1 ? `${rating1.min} ~ ${rating1.max}` : '없음'}
        </div>
      </Showcase>

      <Showcase
        title="기본 값 포함"
        description="초기 별점 범위가 설정된 경우"
        code={`const [rating, setRating] = useState<StarRatingRange | null>({ min: 3, max: 5 })

<StarRatingFilter
  placeholder="별점"
  value={rating}
  onChange={setRating}
/>`}
      >
        <StarRatingFilter placeholder="별점" value={rating2} onChange={setRating2} />
        <div className="typo-caption1 text-grey-600">
          현재 범위: {rating2 ? `${rating2.min} ~ ${rating2.max}` : '없음'}
        </div>
      </Showcase>

      <Showcase title="비활성화 상태" code={`<StarRatingFilter placeholder="별점" disabled />`}>
        <StarRatingFilter placeholder="별점" disabled />
      </Showcase>

      <Showcase title="사용 방법">
        <div className="typo-caption1 text-grey-600 space-y-tiny">
          <p>• 단일 선택: 별 하나를 클릭하면 해당 별점만 선택됩니다</p>
          <p>• 범위 선택: 최솟값과 최댓값을 선택하여 범위를 지정합니다</p>
          <p>• 같은 별을 다시 클릭하면 선택이 해제됩니다</p>
          <p>• 적용 버튼을 눌러야 실제 값이 변경됩니다</p>
        </div>
      </Showcase>
    </Section>
  )
}

export default ComponentGuidePage
