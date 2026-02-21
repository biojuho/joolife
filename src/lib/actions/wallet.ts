"use server";

import { createClient } from "@/lib/supabase/server";

export interface WalletConnection {
  id: string;
  wallet_address: string;
  chain_id: number;
  wallet_type: string | null;
  is_primary: boolean;
  connected_at: string;
  last_verified_at: string | null;
}

export async function getWallets(): Promise<WalletConnection[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("wallet_connections")
    .select("*")
    .eq("user_id", user.id)
    .order("connected_at", { ascending: false });

  return (data as WalletConnection[]) || [];
}

export async function connectWallet(input: {
  wallet_address: string;
  chain_id: number;
  wallet_type: string;
}): Promise<WalletConnection | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 이미 연결된 지갑인지 확인
  const { data: existing } = await supabase
    .from("wallet_connections")
    .select("id")
    .eq("user_id", user.id)
    .eq("wallet_address", input.wallet_address.toLowerCase())
    .eq("chain_id", input.chain_id)
    .single();

  if (existing) return null;

  // 첫 지갑이면 primary로 설정
  const { count } = await supabase
    .from("wallet_connections")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data } = await supabase
    .from("wallet_connections")
    .insert({
      user_id: user.id,
      wallet_address: input.wallet_address.toLowerCase(),
      chain_id: input.chain_id,
      wallet_type: input.wallet_type,
      is_primary: (count || 0) === 0,
      last_verified_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (data) {
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "connect_wallet",
      entity_type: "wallet",
      entity_id: data.id,
      metadata: {
        chain_id: input.chain_id,
        wallet_type: input.wallet_type,
      },
    });
  }

  return data as WalletConnection | null;
}

export async function disconnectWallet(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: wallet } = await supabase
    .from("wallet_connections")
    .select("is_primary")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  await supabase
    .from("wallet_connections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  // primary 지갑을 삭제했으면 다른 지갑을 primary로
  if (wallet?.is_primary) {
    const { data: remaining } = await supabase
      .from("wallet_connections")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase
        .from("wallet_connections")
        .update({ is_primary: true })
        .eq("id", remaining[0].id);
    }
  }

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "disconnect_wallet",
    entity_type: "wallet",
    entity_id: id,
  });
}

export async function setPrimaryWallet(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // 모든 지갑 primary false
  await supabase
    .from("wallet_connections")
    .update({ is_primary: false })
    .eq("user_id", user.id);

  // 선택한 지갑만 primary true
  await supabase
    .from("wallet_connections")
    .update({ is_primary: true })
    .eq("id", id)
    .eq("user_id", user.id);
}
