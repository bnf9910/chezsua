'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  marketing_agreed: boolean;
  role: string;
  created_at?: string;
}

interface Order {
  id: string;
  total?: number;
  status?: string;
  created_at: string;
}

interface Props {
  locale: Locale;
  user: User;
  orders: Order[];
}

type Tab = 'profile' | 'orders';

export function AccountClient({ locale, user, orders }: Props) {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        {user.role === 'admin' && (
          <div className="mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink-primary text-bg-primary text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-accent-green transition-colors"
            >
              관리자 대시보드 →
            </Link>
          </div>
        )}

        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
          My Account
        </div>
        <h1 className="text-serif text-5xl font-light italic max-md:text-4xl">
          안녕하세요, {user.name || '회원'}님
        </h1>
        <p className="text-sm text-ink-muted mt-2">{user.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-10 border-b border-line">
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
          내 정보
        </TabButton>
        <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
          주문 내역 {orders.length > 0 && `(${orders.length})`}
        </TabButton>
      </div>

      {/* Profile Tab - 보기 전용 */}
      {tab === 'profile' && (
        <div className="max-w-2xl">
          <div className="bg-bg-soft border border-line p-8 max-md:p-6">
            <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6 pb-3 border-b border-line">
              회원 정보
            </h2>

            <div className="space-y-5">
              <InfoRow label="이름" value={user.name || '—'} />
              <InfoRow label="이메일" value={user.email} />
              <InfoRow label="전화번호" value={user.phone || '—'} />
              <InfoRow
                label="마케팅 수신"
                value={user.marketing_agreed ? '동의' : '미동의'}
              />
              {user.created_at && (
                <InfoRow
                  label="가입일"
                  value={new Date(user.created_at).toLocaleDateString('ko-KR')}
                />
              )}
            </div>
          </div>

          {/* 안내 + 로그아웃 */}
          <div className="mt-8 pt-6 border-t border-line flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-4">
            <p className="text-sm text-ink-muted">
              정보 변경이 필요하시면 chezsuaflower@gmail.com으로 연락주세요.
            </p>
            <Link
              href={`/${locale}/auth/signout`}
              className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary hover:text-ink-primary border-b border-ink-secondary pb-0.5 whitespace-nowrap"
            >
              로그아웃 →
            </Link>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-bg-soft border border-line">
              <div className="text-serif text-xl text-ink-secondary mb-4 italic">
                주문 내역이 없습니다
              </div>
              <Link
                href={`/${locale}/shop`}
                className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green border-b border-accent-green pb-1 hover:text-ink-primary hover:border-ink-primary transition-colors"
              >
                쇼핑하러 가기 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-bg-soft border border-line flex justify-between items-center"
                >
                  <div>
                    <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1">
                      주문번호 #{order.id.substring(0, 8)}
                    </div>
                    <div className="text-sm text-ink-primary">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-serif text-lg text-ink-primary">
                      ₩{order.total?.toLocaleString() || '0'}
                    </div>
                    <div className="text-mono text-[10px] tracking-[0.15em] uppercase text-accent-green">
                      {order.status || 'pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-3 text-mono text-[11px] tracking-[0.25em] uppercase transition-colors border-b-2 ${
        active
          ? 'text-ink-primary border-ink-primary'
          : 'text-ink-muted border-transparent hover:text-ink-secondary'
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-1">
      <div className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-muted">
        {label}
      </div>
      <div className="text-base text-ink-primary text-right max-md:text-left">
        {value}
      </div>
    </div>
  );
}
