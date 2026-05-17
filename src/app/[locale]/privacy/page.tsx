import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const metadata = {
  title: '개인정보 처리방침 · CHEZSUA',
  description: 'CHEZSUA 개인정보 처리방침',
};

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-32 pb-20 max-w-[800px] mx-auto px-12 max-md:px-7">
      <Link
        href={`/${locale}`}
        className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary mb-3 inline-block"
      >
        ← 홈으로
      </Link>

      <h1 className="text-serif text-5xl font-light italic mb-3 max-md:text-4xl">
        개인정보 처리방침
      </h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-14">
        최종 수정일: 2026년 1월 1일
      </p>

      <div className="space-y-6">
        <Section title="1. 개인정보의 수집 및 이용 목적">
          <p>
            CHEZSUA(이하 &ldquo;회사&rdquo;)는 다음의 목적을 위하여 개인정보를 수집합니다. 처리하고 있는 개인정보는
            다음의 목적 이외의 용도로는 이용되지 않습니다.
          </p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li>회원 가입 및 관리</li>
            <li>상품 주문 및 결제 처리</li>
            <li>상품 배송 및 배송 안내</li>
            <li>고객 문의 응대 및 서비스 개선</li>
            <li>마케팅 정보 제공 (선택 동의 시)</li>
          </ul>
        </Section>

        <Section title="2. 수집하는 개인정보 항목">
          <p><strong className="text-ink-primary">필수항목</strong></p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>회원가입 시: 이메일, 비밀번호, 이름</li>
            <li>주문 시: 받는 분 이름, 전화번호, 배송지 주소</li>
            <li>결제 시: 결제 정보 (PG사 통해 처리, 회사에 직접 저장하지 않음)</li>
          </ul>
          <p className="mt-4"><strong className="text-ink-primary">선택항목</strong></p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>전화번호 (회원가입 시)</li>
            <li>마케팅 정보 수신 동의</li>
          </ul>
        </Section>

        <Section title="3. 개인정보의 보유 및 이용기간">
          <p>회사는 법령에 따른 보존 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보존 기간 내에서 개인정보를 처리·보유합니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li>회원 정보: 회원 탈퇴 시까지</li>
            <li>주문 및 결제 기록: 5년 (전자상거래법)</li>
            <li>대금 결제 및 재화 등의 공급 기록: 5년 (전자상거래법)</li>
            <li>소비자 불만 및 분쟁 처리 기록: 3년 (전자상거래법)</li>
            <li>접속 기록 보존: 3개월 (통신비밀보호법)</li>
          </ul>
        </Section>

        <Section title="4. 개인정보의 제3자 제공">
          <p>회사는 정보주체의 개인정보를 다음의 경우에 한하여 제3자에게 제공합니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li><strong>배송업체</strong>: 상품 배송 (성명, 주소, 연락처)</li>
            <li><strong>결제대행사 (PortOne)</strong>: 결제 처리</li>
            <li><strong>법적 요구</strong>: 법률 또는 법적 절차에 따라 요구되는 경우</li>
          </ul>
        </Section>

        <Section title="5. 개인정보 처리의 위탁">
          <p>회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리 업무를 외부 업체에 위탁하고 있습니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li><strong>Supabase Inc.</strong> — 회원 데이터베이스 운영 및 인증</li>
            <li><strong>Vercel Inc.</strong> — 웹사이트 호스팅</li>
            <li><strong>Resend</strong> — 이메일 발송</li>
            <li><strong>PortOne (포트원)</strong> — 결제 처리</li>
          </ul>
        </Section>

        <Section title="6. 정보주체의 권리">
          <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li>개인정보 열람 요구</li>
            <li>오류가 있는 경우 정정 요구</li>
            <li>삭제 요구 (단, 법령에서 보유를 명시한 경우 제외)</li>
            <li>처리 정지 요구</li>
          </ul>
          <p className="mt-4">
            권리 행사는 회사에 대해 이메일(chezsuaflower@gmail.com)을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
          </p>
        </Section>

        <Section title="7. 개인정보의 안전성 확보 조치">
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li>관리적 조치: 내부관리계획 수립·시행</li>
            <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
            <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
          </ul>
        </Section>

        <Section title="8. 개인정보 자동 수집 장치 (쿠키)">
          <p>회사는 이용자의 편의 제공을 위해 쿠키(cookie)를 사용합니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li>쿠키 사용 목적: 로그인 유지, 사이트 이용 분석</li>
            <li>쿠키 설치 거부: 브라우저 설정에서 쿠키 차단 가능 (단, 일부 서비스 이용에 제한 발생)</li>
          </ul>
        </Section>

        <Section title="9. 개인정보 보호책임자">
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지는 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul className="list-disc list-inside ml-5 mt-3 space-y-1">
            <li><strong>이름</strong>: CHEZSUA 운영자</li>
            <li><strong>이메일</strong>: chezsuaflower@gmail.com</li>
          </ul>
        </Section>

        <Section title="10. 개인정보 처리방침 변경">
          <p>
            이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는
            경우에는 변경사항의 시행 7일 전부터 사이트를 통해 공지할 것입니다.
          </p>
        </Section>

        <Section title="시행일">
          <p>이 개인정보 처리방침은 2026년 1월 1일부터 적용됩니다.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pb-8 border-b border-line-soft last:border-0">
      <h2 className="text-serif text-2xl font-medium text-ink-primary mb-4">{title}</h2>
      <div className="text-sm text-ink-secondary leading-loose">{children}</div>
    </section>
  );
}
