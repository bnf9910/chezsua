'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

interface CheckoutFormProps {
  locale: Locale;
}

type Step = 1 | 2 | 3;
type PaymentMethod = 'card' | 'naverpay' | 'kakaopay' | 'paypal' | 'alipay' | 'transfer';
type Fulfillment = 'delivery' | 'pickup';

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: '신용카드 / Credit Card' },
  { id: 'naverpay', label: '네이버페이 / Naver Pay' },
  { id: 'kakaopay', label: '카카오페이 / Kakao Pay' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'alipay', label: 'Alipay 支付宝' },
  { id: 'transfer', label: '무통장 입금 / Bank Transfer' },
];

const OCCASIONS = [
  { value: '', label: '— 선택 —' },
  { value: 'birthday', label: '생일 / Birthday' },
  { value: 'anniversary', label: '기념일 / Anniversary' },
  { value: 'wedding', label: '결혼 / Wedding' },
  { value: 'graduation', label: '졸업 / Graduation' },
  { value: 'thank-you', label: '감사 / Thank You' },
  { value: 'just-because', label: '그냥 / Just Because' },
];

export function CheckoutForm({ locale }: CheckoutFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fulfillment: 'delivery' as Fulfillment,
    phone: '',
    deliveryDate: '',
    occasion: '',
    cardMessage: '',
    orderNotes: '',
    postcode: '',
    address: '',
    addressDetail: '',
    paymentMethod: 'card' as PaymentMethod,
  });

  function nextStep() {
    if (step === 1) {
      // 픽업이면 주소 단계 스킵
      setStep(formData.fulfillment === 'pickup' ? 3 : 2);
    } else if (step === 2) {
      setStep(3);
    }
  }

  function prevStep() {
    if (step === 3 && formData.fulfillment === 'pickup') setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  }

  async function handleSubmitOrder() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });
      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message || '결제 연동 준비 중 (포트원 v2 SDK).');
      }
    } catch (err) {
      console.error(err);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[800px] mx-auto px-12 py-16 max-md:px-7 max-md:py-10">
        {/* Progress */}
        <div className="flex justify-between items-center mb-12 text-mono text-[11px] tracking-[0.2em] uppercase">
          <StepIndicator step={1} current={step} label="수령인" />
          <span className="flex-1 mx-3 h-px bg-line" />
          <StepIndicator step={2} current={step} label="배송지" disabled={formData.fulfillment === 'pickup'} />
          <span className="flex-1 mx-3 h-px bg-line" />
          <StepIndicator step={3} current={step} label="결제" />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-7">
            <h2 className="text-serif text-4xl font-light italic mb-8">수령인 정보</h2>

            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              <Field label="Recipient's first name *">
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="checkout-input"
                />
              </Field>
              <Field label="Recipient's last name *">
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="checkout-input"
                />
              </Field>
            </div>

            <Field label="How to get your arrangements">
              <div className="grid grid-cols-2 gap-3">
                <RadioBox
                  checked={formData.fulfillment === 'delivery'}
                  onClick={() => setFormData({ ...formData, fulfillment: 'delivery' })}
                  label="Delivery"
                />
                <RadioBox
                  checked={formData.fulfillment === 'pickup'}
                  onClick={() => setFormData({ ...formData, fulfillment: 'pickup' })}
                  label="Pick Up"
                />
              </div>
            </Field>

            <Field label="Phone *">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="checkout-input"
              />
            </Field>

            <Field label="Date *">
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="checkout-input"
              />
              <p className="text-mono text-[10px] tracking-[0.1em] text-ink-muted mt-2">
                For delivery / pick up today, order within next hours
              </p>
            </Field>

            <Field label="Occasion (optional)">
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="checkout-input"
              >
                {OCCASIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Card Message (optional)">
              <textarea
                value={formData.cardMessage}
                onChange={(e) => setFormData({ ...formData, cardMessage: e.target.value })}
                className="checkout-input min-h-[80px]"
                rows={3}
              />
            </Field>

            <Field label="Order notes (optional)">
              <textarea
                value={formData.orderNotes}
                onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                placeholder="예: 오후 3시 픽업, 도착 시간 알려주세요"
                className="checkout-input min-h-[80px]"
                rows={3}
              />
            </Field>

            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.firstName || !formData.lastName || !formData.phone || !formData.deliveryDate}
              className="w-full bg-ink-primary text-bg-primary py-4 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors mt-8 disabled:opacity-30"
            >
              다음 단계 →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-7">
            <h2 className="text-serif text-4xl font-light italic mb-8">배송 주소</h2>

            <Field label="우편번호">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  className="checkout-input flex-1"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => alert('다음(카카오) 우편번호 API 연동 예정')}
                  className="px-6 py-3 border border-ink-primary text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-ink-primary hover:text-bg-primary transition-colors whitespace-nowrap"
                >
                  주소 검색
                </button>
              </div>
            </Field>

            <Field label="주소">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="checkout-input"
                readOnly
              />
            </Field>

            <Field label="상세 주소">
              <input
                type="text"
                value={formData.addressDetail}
                onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                className="checkout-input"
              />
            </Field>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-4 border border-ink-primary text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-ink-primary hover:text-bg-primary transition-colors"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-ink-primary text-bg-primary py-4 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors"
              >
                결제로 이동 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-7">
            <h2 className="text-serif text-4xl font-light italic mb-8">결제 방법</h2>
            <div className="grid gap-3">
              {PAYMENT_METHODS.map((method) => (
                <RadioBox
                  key={method.id}
                  checked={formData.paymentMethod === method.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  label={method.label}
                />
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-4 border border-ink-primary text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-ink-primary hover:text-bg-primary transition-colors"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="flex-1 bg-ink-primary text-bg-primary py-4 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors disabled:opacity-30"
              >
                {submitting ? '처리 중...' : '결제하기 →'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .checkout-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--color-line);
          background: var(--color-bg-soft);
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--color-ink-primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .checkout-input:focus {
          border-color: var(--color-ink-primary);
        }
      `}</style>
    </div>
  );
}

function StepIndicator({ step, current, label, disabled }: { step: number; current: number; label: string; disabled?: boolean }) {
  const active = step <= current && !disabled;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono ${
        active ? 'bg-ink-primary text-bg-primary' : 'border border-line text-ink-muted'
      } ${disabled ? 'opacity-40' : ''}`}>
        {step}
      </div>
      <span className={`${active ? 'text-ink-primary' : 'text-ink-muted'} ${disabled ? 'opacity-40' : ''}`}>
        {label}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function RadioBox({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 border text-left text-mono text-[11px] tracking-[0.15em] uppercase transition-all ${
        checked
          ? 'border-ink-primary bg-ink-primary text-bg-primary'
          : 'border-line text-ink-secondary hover:border-ink-primary'
      }`}
    >
      {label}
    </button>
  );
}
