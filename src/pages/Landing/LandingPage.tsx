import { useNavigate } from 'react-router-dom'

import LandingImage from '@/shared/assets/images/landing.png'
import { ROUTES } from '@/shared/constants'
export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="relative">
      <img src={LandingImage} alt="독크독크 소개 이미지" aria-hidden="true" />
      <button
        className="absolute top-[8%] left-[45%] w-[10%] h-[1.5%] text-[0px] cursor-pointer"
        onClick={() => navigate(ROUTES.LOGIN)}
      >
        바로 시작하기
      </button>
      <button
        className="absolute bottom-[9.8%] left-[15%] w-[10%] h-[1.5%] text-[0px] cursor-pointer"
        onClick={() => navigate(ROUTES.LOGIN)}
      >
        바로 시작하기
      </button>
      <section className="sr-only">
        <h2>대화로 넓히고 기록으로 깊어지는 독서생활</h2>
        <p>독크독크</p>
        <p>
          독서모임에서 나눈 이야기, 그날의 감정과 관점 변화까지 책 한 권 안에 차곡차곡 남겨보세요.
        </p>
      </section>

      <section className="sr-only">
        <section>
          <h2>독서모임이 끝나면, 이런 경험 없으셨나요?</h2>
          <ul>
            <li>“모임에서 나눈 대화가 시간이 지나면 잘 떠오르지 않지 않아요”</li>
            <li>“기록을 남기고 싶어도, 어떻게 정리해야 할지 막막해 결국 기록을 미루게 돼요”</li>
            <li>“이 책을 어떻게 읽었는지 한 번에 돌아볼 수 없어요”</li>
          </ul>
        </section>

        <section>
          <h2>독크독크는 흩어지던 독서모임의 대화와 생각을 책 중심의 기록으로 연결합니다</h2>

          <dl>
            <dt>모든 기록의 중심은, ‘책 한 권’입니다</dt>
            <dd>
              독서모임 전 생각, 모임에서의 대화, 모임 후의 변화까지 모두 한 권의 책 안에 쌓입니다.
            </dd>
          </dl>

          <dl>
            <dt>생각이 자연스럽게 정리되도록 돕습니다</dt>
            <dd>
              질문, 주제, 관점에 따라 생각을 적을 수 있는 구조를 제공해 기록의 부담을 줄입니다.
            </dd>
          </dl>

          <dl>
            <dt>한 번의 모임으로 끝나지 않는 독서 경험</dt>
            <dd>모임에서 나눈 이야기와 그로 인해 바뀐 나의 생각이 다음 독서로 이어집니다.</dd>
          </dl>
        </section>

        <section>
          <h2>독서모임의 대화와 생각을 기록으로 이어주는 핵심 기능</h2>

          <dl>
            <dt>모임 전 기록 : 대화를 준비하는 기록</dt>
            <dd>
              모임 전에 주제를 정하고, 각자의 생각을 미리 정리해 둡니다. 모임에서 “무슨 얘기를 할지”
              고민하는 대신, 이미 준비된 생각 위에서 대화가 시작됩니다.
            </dd>
            <dd>주제 제안 & 반응으로 대화 방향을 함께 결정</dd>
            <dd>사전 의견 템플릿으로 생각을 미리 정리하며 기록</dd>
            <dd>모임 중 ‘기록 대신 대화’에만 집중</dd>
          </dl>

          <dl>
            <dt>모임 후 기록 : 대화의 순간을 남기는 기록</dt>
            <dd>
              모임에서 나눈 이야기를 AI가 대신 정리해 기록합니다. 대화하는 순간에는 온전히 대화에
              집중하고, 흐름과 맥락이 살아 있는 기록을 다시 꺼내볼 수 있습니다.
            </dd>
            <dd>주요 쟁점과 관점 차이 자동 정리</dd>
            <dd>반복해서 언급된 생각과 흐름 중심 요약</dd>
            <dd>공동 기록 + 개인 회고 자연스럽게 연결</dd>
          </dl>

          <dl>
            <dt>내 책장 : 책 한 권 안에 모든 독서 경험</dt>
            <dd>
              책 한 권 안에 모임 기록과 개인 기록을 모두 담습니다. 독서 경험이 분산되지 않고, 하나의
              흐름으로 이어집니다.
            </dd>
            <dd>개인 메모, 발췌, 회고 기록 통합</dd>
            <dd>독서모임을 통해 바뀐 생각의 흐름 확인</dd>
            <dd>“책을 읽었다”가 아닌 “책이 나를 어떻게 바꿨는지”가 남는 구조</dd>
          </dl>
        </section>

        <section>
          <h2>책 한 권을 둘러싼 시간과 생각, 하나의 흐름으로 남겨보세요</h2>
        </section>
      </section>

      <footer className="sr-only">
        <p>© 독크독크. All rights reserved.</p>
        <dl>
          <dt>서비스명</dt>
          <dd>독크독크</dd>
          <dt>팀</dt>
          <dd>FCDE</dd>
          <dt>개발</dt>
          <dd>권우희 경서영 김윤영 오주현 양재웅 조건희 배하은 양명규 최영애</dd>
          <dt>디자인</dt>
          <dd>김수아 김주연 조민지</dd>
        </dl>
      </footer>
    </div>
  )
}
