import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

// Contact 페이지를 Project 페이지로 영구 리다이렉트
export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(`/${locale}/project`);
}
