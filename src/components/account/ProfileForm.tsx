'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface ProfileFormProps {
  locale: Locale;
  initialName: string;
  initialPhone: string;
  email: string;
}

const LABELS = {
  en: { name: 'Name', email: 'Email', phone: 'Phone', save: 'Save Changes', saved: 'Saved!', changePassword: 'Change Password', currentPassword: 'Current Password', newPassword: 'New Password', update: 'Update Password' },
  ko: { name: '이름', email: '이메일', phone: '연락처', save: '저장', saved: '저장되었습니다', changePassword: '비밀번호 변경', currentPassword: '현재 비밀번호', newPassword: '새 비밀번호', update: '비밀번호 변경' },
  zh: { name: '姓名', email: '邮箱', phone: '电话', save: '保存修改', saved: '已保存', changePassword: '修改密码', currentPassword: '当前密码', newPassword: '新密码', update: '更新密码' },
};

export function ProfileForm({ locale, initialName, initialPhone, email }: ProfileFormProps) {
  const t = LABELS[locale];
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [newPassword, setNewPassword] = useState('');
  const [savedField, setSavedField] = useState<'profile' | 'password' | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { name, phone } });
    setLoading(false);
    if (!error) {
      setSavedField('profile');
      setTimeout(() => setSavedField(null), 3000);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (!error) {
      setNewPassword('');
      setSavedField('password');
      setTimeout(() => setSavedField(null), 3000);
    }
  }

  return (
    <div className="space-y-12">
      {/* Basic info */}
      <form onSubmit={handleSaveProfile} className="space-y-5">
        <Field label={t.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-input"
          />
        </Field>
        <Field label={t.email}>
          <input
            type="email"
            value={email}
            disabled
            className="profile-input opacity-60 cursor-not-allowed"
          />
        </Field>
        <Field label={t.phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+82 010-0000-0000"
            className="profile-input"
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="bg-ink-primary text-bg-primary py-3.5 px-10 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green disabled:opacity-30"
        >
          {savedField === 'profile' ? `✓ ${t.saved}` : `${t.save} →`}
        </button>
      </form>

      {/* Password change */}
      <form onSubmit={handleChangePassword} className="space-y-5 pt-10 border-t border-line">
        <h2 className="text-serif text-2xl italic mb-5">{t.changePassword}</h2>
        <Field label={t.newPassword}>
          <input
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="profile-input"
          />
        </Field>
        <button
          type="submit"
          disabled={loading || !newPassword}
          className="bg-ink-primary text-bg-primary py-3.5 px-10 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green disabled:opacity-30"
        >
          {savedField === 'password' ? `✓ ${t.saved}` : `${t.update} →`}
        </button>
      </form>

      <style jsx global>{`
        .profile-input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--color-line);
          background: var(--color-bg-soft);
          outline: none;
          transition: border-color 0.2s;
        }
        .profile-input:focus {
          border-color: var(--color-ink-primary);
        }
      `}</style>
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
