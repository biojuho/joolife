import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, tags, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Upsert subscriber (on conflict email, update status to active)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          status: 'active',
          tags: Array.isArray(tags) ? tags : [],
          source: source || 'website',
          subscribed_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      );

    if (error) {
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json(
        { error: '구독 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: '구독이 완료되었습니다.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
