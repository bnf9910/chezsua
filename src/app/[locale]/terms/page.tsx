import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export const metadata = {
  title: '이용약관 · CHEZSUA',
  description: 'CHEZSUA 서비스 이용약관',
};

export default async function TermsPage({ params }: PageProps) {
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
        이용약관
      </h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-14">
        최종 수정일: 2026년 1월 1일
      </p>

      <div className="prose prose-stone max-w-none text-ink-secondary leading-relaxed space-y-6">
        <Section title="제1조 (목적)">
          <p>
            이 약관은 CHEZSUA(이하 &ldquo;회사&rdquo;)가 운영하는 웹사이트(chezsua.com, 이하 &ldquo;사이트&rdquo;)에서
            제공하는 꽃 상품 및 서비스(이하 &ldquo;서비스&rdquo;)를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>
        </Section>

        <Section title="제2조 (용어의 정의)">
          <ol className="list-decimal list-inside space-y-2">
            <li>&ldquo;사이트&rdquo;라 함은 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 운영하는 가상의 영업장을 의미합니다.</li>
            <li>&ldquo;이용자&rdquo;라 함은 사이트에 접속하여 이 약관에 따라 서비스를 제공받는 회원 및 비회원을 의미합니다.</li>
            <li>&ldquo;회원&rdquo;이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            <li>&ldquo;비회원&rdquo;이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
          </ol>
        </Section>

        <Section title="제3조 (약관의 게시와 개정)">
          <ol className="list-decimal list-inside space-y-2">
            <li>회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트 초기 서비스 화면에 게시합니다.</li>
            <li>회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
            <li>약관이 개정될 경우 회사는 개정 사유와 적용 일자를 명시하여 현행 약관과 함께 사이트 초기 화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
          </ol>
        </Section>

        <Section title="제4조 (회원가입)">
          <ol className="list-decimal list-inside space-y-2">
            <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
            <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
              <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="제5조 (상품 주문 및 결제)">
          <ol className="list-decimal list-inside space-y-2">
            <li>이용자는 사이트에서 상품을 선택하고 주문서를 작성하여 주문할 수 있습니다.</li>
            <li>회사는 다음 각 호의 결제 방법을 제공합니다:
              <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
                <li>신용카드 결제</li>
                <li>실시간 계좌이체</li>
                <li>카카오페이, 네이버페이 등 간편결제</li>
              </ul>
            </li>
            <li>주문 완료 후 회사는 이메일 또는 SMS를 통해 주문 확인을 알려드립니다.</li>
          </ol>
        </Section>

        <Section title="제6조 (배송)">
          <ol className="list-decimal list-inside space-y-2">
            <li>회사는 이용자가 주문한 상품을 약정한 배송일에 배송합니다.</li>
            <li>꽃 상품의 특성상 신선도 유지를 위해 당일 또는 익일 배송을 원칙으로 합니다.</li>
            <li>배송 지역은 서울 및 수도권을 기본으로 하며, 일부 지역은 별도 상담 후 배송 가능합니다.</li>
            <li>천재지변, 교통 사고 등 회사가 통제할 수 없는 사유로 배송이 지연될 수 있으며, 이 경우 즉시 이용자에게 통지합니다.</li>
          </ol>
        </Section>

        <Section title="제7조 (환불 및 교환)">
          <ol className="list-decimal list-inside space-y-2">
            <li>꽃 상품은 신선도가 중요한 상품으로, 배송 완료 후 단순 변심에 의한 환불은 불가합니다.</li>
            <li>다음의 경우 교환 또는 환불이 가능합니다:
              <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
                <li>주문한 상품과 다른 상품이 배송된 경우</li>
                <li>배송 중 상품이 심하게 손상된 경우</li>
                <li>주문한 색상, 사이즈와 현저히 다른 경우</li>
              </ul>
            </li>
            <li>환불은 결제 수단과 동일한 방법으로 처리되며, 영업일 기준 3-5일 소요됩니다.</li>
          </ol>
        </Section>

        <Section title="제8조 (이용자의 의무)">
          <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>신청 또는 변경 시 허위 내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사의 저작권 등 지적재산권에 대한 침해</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ul>
        </Section>

        <Section title="제9조 (개인정보보호)">
          <p>
            회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
            자세한 내용은{' '}
            <Link href={`/${locale}/privacy`} className="text-accent-green underline">
              개인정보 처리방침
            </Link>
            을 참고해주세요.
          </p>
        </Section>

        <Section title="제10조 (분쟁 해결)">
          <p>
            본 약관의 해석 및 회사와 이용자 간의 분쟁에 관하여는 대한민국 법령에 따르며, 분쟁이 발생한 경우 회사의 본사
            소재지를 관할하는 법원을 관할법원으로 합니다.
          </p>
        </Section>

        <Section title="부칙">
          <p>이 약관은 2026년 1월 1일부터 시행합니다.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pb-8 border-b border-line-soft last:border-0">
      <h2 className="text-serif text-2xl font-medium text-ink-primary mb-4">{title}</h2>
      <div className="text-sm leading-loose">{children}</div>
    </section>
  );
}
