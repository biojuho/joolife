"use server";

import { createClient } from "@/lib/supabase/server";

export type AutomationType = "news_collect" | "content_alert" | "schedule";

export interface Automation {
  id: string;
  name: string;
  type: AutomationType;
  config: Record<string, unknown>;
  schedule: string | null;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationLog {
  id: string;
  automation_id: string;
  status: "success" | "error" | "partial";
  result: Record<string, unknown>;
  items_count: number;
  executed_at: string;
}

export async function getAutomations(): Promise<Automation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("automations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Automation[]) || [];
}

export async function getAutomation(id: string): Promise<Automation | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("automations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data as Automation | null;
}

export async function createAutomation(input: {
  name: string;
  type: AutomationType;
  config: Record<string, unknown>;
  schedule?: string;
}): Promise<Automation | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("automations")
    .insert({
      user_id: user.id,
      name: input.name,
      type: input.type,
      config: input.config,
      schedule: input.schedule || null,
    })
    .select()
    .single();

  if (data) {
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "create_automation",
      entity_type: "automation",
      entity_id: data.id,
      metadata: { name: input.name, type: input.type },
    });
  }

  return data as Automation | null;
}

export async function updateAutomation(
  id: string,
  input: Partial<{
    name: string;
    config: Record<string, unknown>;
    schedule: string;
    is_active: boolean;
  }>
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("automations")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function toggleAutomation(
  id: string,
  is_active: boolean
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("automations")
    .update({ is_active })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function deleteAutomation(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("automations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "delete_automation",
    entity_type: "automation",
    entity_id: id,
  });
}

export async function getAutomationLogs(
  automationId: string,
  limit: number = 10
): Promise<AutomationLog[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // 먼저 자동화 소유자 확인
  const { data: automation } = await supabase
    .from("automations")
    .select("id")
    .eq("id", automationId)
    .eq("user_id", user.id)
    .single();

  if (!automation) return [];

  const { data } = await supabase
    .from("automation_logs")
    .select("*")
    .eq("automation_id", automationId)
    .order("executed_at", { ascending: false })
    .limit(limit);

  return (data as AutomationLog[]) || [];
}

export async function getAutomationStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { total: 0, active: 0, totalRuns: 0 };

  const [totalResult, activeResult] = await Promise.all([
    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  // 최근 로그 수
  const { data: automationIds } = await supabase
    .from("automations")
    .select("id")
    .eq("user_id", user.id);

  let totalRuns = 0;
  if (automationIds && automationIds.length > 0) {
    const { count } = await supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .in(
        "automation_id",
        automationIds.map((a) => a.id)
      );
    totalRuns = count || 0;
  }

  return {
    total: totalResult.count || 0,
    active: activeResult.count || 0,
    totalRuns,
  };
}
