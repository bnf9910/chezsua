'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  marketing_agreed: boolean;
  role: string;
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
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
    marketing_agreed: user.marketing_agreed,
  });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
          marketing_agreed: profile.marketing_agreed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        alert('저장 실패: ' + error.message);
      } else {
        setSavedMessage('✓ 저장되었습니다');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch (err) {
      alert('저장 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        {user.role === 'admin' && (
          <div className="mb-6 inline-block">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink-primary text-bg-primary text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent-green transition-colors"
            >
              관리자 대시보드 →
            </Link>
          </div>
        )}

        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
          My Account
        </div>
        <h1 className="text-serif text-5xl font-light italic max-md:text-4xl">
          안녕하세요, {profile.name || '회원'}님
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

      {/* Profile Tab */}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="max-w-2xl">
          <div className="space-y-6">
            <Field label="이름">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="form-input"
              />
            </Field>

            <Field label="이메일" hint="이메일은 변경할 수 없습니다">
              <input
                type="email"
                value={user.email}
                disabled
                className="form-input bg-bg-soft text-ink-muted cursor-not-allowed"
              />
            </Field>

            <Field label="전화번호">
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="010-1234-5678"
                className="form-input"
              />
            </Field>

            <div className="pt-4 border-t border-line">
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.marketing_agreed}
                  onChange={(e) => setProfile({ ...profile, marketing_agreed: e.target.checked })}
                  className="mt-1 cursor-pointer"
                />
                <span>마케팅 정보 수신에 동의합니다</span>
              </label>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between">
            <div>
              {savedMessage && (
                <div className="text-mono text-[11px] tracking-[0.2em] uppercase text-accent-green">
                  {savedMessage}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>

          {/* 로그아웃 */}
          <div className="mt-10 pt-6 border-t border-line">
            <Link
              href={`/${locale}/auth/signout`}
              className="text-sm text-ink-secondary hover:text-ink-primary border-b border-ink-secondary pb-0.5"
            >
              로그아웃 →
            </Link>
          </div>
        </form>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-bg-soft">
              <div className="text-serif text-xl text-ink-secondary mb-4">
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

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 12px 14px;
          background: white;
          border: 1px solid #D2DCCE;
          font-size: 15px;
          font-family: inherit;
          color: #1A1F1B;
        }
        .form-input:focus {
          outline: none;
          border-color: #2D3F2E;
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, children }: {
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-mono text-[10px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}
