import { ChevronLeft, MapPin } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Button,
  TextButton,
} from '@/shared/ui'

export default function MeetingDetailPage() {
  return (
    <>
      {/* 공통컴포넌트로 교체 예정 */}
      <div className="sticky top-0 bg-white -mt-xlarge">
        <p className="flex typo-body3 text-grey-600 gap-xtiny py-medium">
          <ChevronLeft size={16} /> 책책책 책을 읽읍시다
        </p>
      </div>
      {/* 공통컴포넌트로 교체 예정 */}

      <div className="flex justify-between gap-[36px]">
        <div className="w-[300px] flex-none flex flex-col gap-base">
          <div className="flex items-start border-b gap-small border-b-grey-300 pb-[10px]">
            <h3 className="text-black typo-heading3">약속명</h3>
            <Badge size="small" color="yellow">
              약속 전
            </Badge>
          </div>

          <div className="flex flex-col gap-medium">
            <dl className="flex gap-base">
              <dt className="text-grey-600 typo-caption1 w-[68px]">도서</dt>
              <dd className="flex flex-col gap-xtiny">
                <p className="text-black typo-body3">{'책 제목'}</p>
                <p className="text-grey-700 typo-caption1">{'저자'}</p>
                <div className="w-[120px]">
                  <img
                    src="https://img1.daumcdn.net/thumb/R1280x0.fwebp/?fname=http://t1.daumcdn.net/brunch/service/user/7H8p/image/MsFtcopMcsD1h86nbkxGzcjv0mo.JPG"
                    alt=""
                  />
                </div>
              </dd>
            </dl>

            <dl className="flex gap-base">
              <dt className="text-grey-600 w-[68px]">참가인원</dt>
              <dd className="flex flex-col text-black typo-body3 gap-small">
                <p>
                  {'8'} <span className="typo-cation2 text-grey-600">/{'12'}</span>
                </p>

                <div className="flex items-center gap-small">
                  <p>약속장</p>
                  <Avatar variant="host">
                    <AvatarImage
                      src={
                        'https://img1.daumcdn.net/thumb/R1280x0.fwebp/?fname=https://t1.daumcdn.net/brunch/service/user/cd1i/image/hn09hzI1Fp-5U4XN5wf5epvmkH0'
                      }
                      alt="약속장"
                    />
                    <AvatarFallback>장</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex items-center gap-small">
                  <p>멤버</p>
                  <AvatarGroup>
                    <Avatar>
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1"
                        alt="User 1"
                      />
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2"
                        alt="User 2"
                      />
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=User3"
                        alt="User 3"
                      />
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=User6"
                        alt="User 6"
                      />
                    </Avatar>
                    <AvatarGroupCount
                      items={[
                        {
                          id: '1',
                          name: 'User 4',
                          src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User4',
                        },
                        {
                          id: '2',
                          name: 'User 5',
                          src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User5',
                        },
                      ]}
                      preview={{
                        name: 'User 5',
                        src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User5',
                      }}
                    >
                      +3
                    </AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </dd>
            </dl>

            <dl className="flex gap-base">
              <dt className="text-grey-600 typo-caption1 w-[68px]">날짜 및 시간</dt>
              <dd className="text-black typo-body3">
                <p>{'2026.01.15(목) 16:00'}</p>
                <p>~ {'2026.01.15(목) 19:30'}</p>
              </dd>
            </dl>

            <dl className="flex gap-base">
              <dt className="text-grey-600 typo-caption1 w-[68px]">장소</dt>
              <dd>
                <TextButton
                  size="medium"
                  icon={MapPin}
                  className="text-black typo-body3 [&_svg]:text-grey-600"
                >
                  {'약속 장소'}
                </TextButton>
              </dd>
            </dl>
          </div>

          <div>
            {/* 모임장, 약속장 버튼 */}
            <Button size="medium" className="w-full">
              수정하기
            </Button>
            <p className="text-grey-700 typo-body6 pt-tiny">
              * 약속 24시간 전까지만 약속 정보를 수정할 수 있어요
            </p>

            <Button size="medium" className="w-full" disabled>
              수정 가능 시간이 지났어요
            </Button>
            {/* 모임장, 약속장 버튼 */}

            {/* 모임원 버튼 */}
            <Button size="medium" className="w-full">
              참가 신청하기
            </Button>

            <Button size="medium" className="w-full" variant="secondary">
              참가 취소하기
            </Button>

            <p className="text-grey-700 typo-body6 pt-tiny">
              * 약속 24시간 전까지만 참가 신청 및 취소가 가능해요
            </p>

            <Button size="medium" className="w-full" disabled>
              취소 가능 시간이 지났 어요
            </Button>
            <Button size="medium" className="w-full" disabled>
              모집이 마감된 약속이에요
            </Button>
            <Button size="medium" className="w-full" disabled>
              약속 신청이 거절됐어요
            </Button>
            {/* 모임원 버튼 */}

            {/* 약속 끝났을때 버튼 */}
            <Button size="medium" className="w-full" disabled>
              약속이 끝났어요
            </Button>
            {/* 약속 끝났을때 버튼 */}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-black typo-heading3">주제</p>
        </div>
      </div>
    </>
  )
}
