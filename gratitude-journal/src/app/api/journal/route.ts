import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 엔트리 목록 조회
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error, count } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .neq("user_answer", "")
    .order("entry_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data, total: count });
}

// 엔트리 삭제
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // total_entries 감소
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_entries")
    .eq("id", user.id)
    .single();

  if (profile && profile.total_entries > 0) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        total_entries: profile.total_entries - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to decrement total_entries:", updateError);
    }
  }

  return NextResponse.json({ success: true });
}
