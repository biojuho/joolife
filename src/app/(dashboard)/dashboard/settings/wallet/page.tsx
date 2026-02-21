"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ChevronLeft,
  Plus,
  Trash2,
  Star,
  StarOff,
  Copy,
  Check,
  ExternalLink,
  Shield,
} from "lucide-react";
import {
  getWallets,
  connectWallet,
  disconnectWallet,
  setPrimaryWallet,
  type WalletConnection,
} from "@/lib/actions/wallet";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  56: "BNB Chain",
  42161: "Arbitrum",
  10: "Optimism",
  8453: "Base",
  43114: "Avalanche",
};

function getChainName(chainId: number): string {
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

const SUPPORTED_CHAINS = [
  { id: 1, name: "Ethereum", color: "#627EEA" },
  { id: 137, name: "Polygon", color: "#8247E5" },
  { id: 56, name: "BNB Chain", color: "#F0B90B" },
  { id: 42161, name: "Arbitrum", color: "#28A0F0" },
  { id: 10, name: "Optimism", color: "#FF0420" },
  { id: 8453, name: "Base", color: "#0052FF" },
];

const WALLET_TYPES = [
  { id: "metamask", name: "MetaMask", icon: "🦊" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🔵" },
  { id: "other", name: "기타", icon: "💼" },
];

export default function WalletSettingsPage() {
  const [wallets, setWallets] = useState<WalletConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Connect form state
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(1);
  const [walletType, setWalletType] = useState("metamask");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const data = await getWallets();
      setWallets(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleConnect = async () => {
    setError("");

    // 기본 주소 유효성 검사
    if (!address.trim()) {
      setError("지갑 주소를 입력하세요.");
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      setError("유효한 이더리움 주소 형식이 아닙니다. (0x...)");
      return;
    }

    setConnecting(true);
    try {
      const result = await connectWallet({
        wallet_address: address.trim(),
        chain_id: chainId,
        wallet_type: walletType,
      });

      if (result) {
        setShowConnect(false);
        setAddress("");
        await fetchWallets();
      } else {
        setError("이미 연결된 지갑이거나 연결에 실패했습니다.");
      }
    } catch {
      setError("지갑 연결에 실패했습니다.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("이 지갑 연결을 해제하시겠습니까?")) return;
    await disconnectWallet(id);
    await fetchWallets();
  };

  const handleSetPrimary = async (id: string) => {
    await setPrimaryWallet(id);
    setWallets((prev) =>
      prev.map((w) => ({ ...w, is_primary: w.id === id }))
    );
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <a
          href="/dashboard/settings"
          className="p-2 rounded-xl hover:bg-gray-100 text-[#6B6B66] transition-colors"
        >
          <ChevronLeft size={20} />
        </a>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Web3 지갑</h1>
          <p className="text-[#6B6B66] mt-0.5 text-sm">
            블록체인 지갑을 연결하여 Web3 기능을 활용하세요
          </p>
        </div>
        <button
          onClick={() => setShowConnect(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} />
          지갑 연결
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-[#1A1A1A]">
              안전한 지갑 연결
            </p>
            <p className="text-xs text-[#6B6B66] mt-0.5 leading-relaxed">
              JooLife는 읽기 전용으로 지갑을 연결합니다. 자산 접근 권한이나
              트랜잭션 서명을 요청하지 않습니다. 향후 NFT 기반 콘텐츠 인증,
              토큰 리워드 등의 Web3 기능이 추가될 예정입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Form */}
      {showConnect && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A] text-sm">
              새 지갑 연결
            </h2>
            <button
              onClick={() => {
                setShowConnect(false);
                setError("");
              }}
              className="text-[#A3A39E] hover:text-[#6B6B66] text-sm"
            >
              취소
            </button>
          </div>

          {/* Wallet Type */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              지갑 유형
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WALLET_TYPES.map((wt) => (
                <button
                  key={wt.id}
                  onClick={() => setWalletType(wt.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    walletType === wt.id
                      ? "border-accent bg-accent-bg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{wt.icon}</span>
                  <p className="text-xs font-medium mt-1 text-[#1A1A1A]">
                    {wt.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              지갑 주소
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
            />
          </div>

          {/* Chain */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              네트워크
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setChainId(chain.id)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    chainId === chain.id
                      ? "border-accent bg-accent-bg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: chain.color }}
                  />
                  <p className="text-[10px] font-medium text-[#1A1A1A]">
                    {chain.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {connecting ? "연결 중..." : "지갑 연결하기"}
          </button>
        </div>
      )}

      {/* Wallet List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : wallets.length === 0 && !showConnect ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
            <Wallet size={32} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            연결된 지갑이 없습니다
          </h3>
          <p className="text-[#6B6B66] text-sm max-w-sm mb-6">
            Web3 지갑을 연결하면 블록체인 기반 콘텐츠 인증, 토큰 리워드 등의
            기능을 이용할 수 있습니다.
          </p>
          <button
            onClick={() => setShowConnect(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            <Plus size={16} />첫 지갑 연결하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const chain = SUPPORTED_CHAINS.find(
              (c) => c.id === wallet.chain_id
            );
            const wType = WALLET_TYPES.find(
              (w) => w.id === wallet.wallet_type
            );
            return (
              <div
                key={wallet.id}
                className="bg-white rounded-2xl border border-gray-200/60 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">
                    {wType?.icon || "💼"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#1A1A1A]">
                        {wType?.name || wallet.wallet_type || "지갑"}
                      </span>
                      {wallet.is_primary && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                          ⭐ 기본 지갑
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs text-[#6B6B66] font-mono">
                        {shortenAddress(wallet.wallet_address)}
                      </code>
                      <button
                        onClick={() =>
                          handleCopy(wallet.wallet_address, wallet.id)
                        }
                        className="p-1 rounded hover:bg-gray-100 text-[#A3A39E] transition-colors"
                      >
                        {copiedId === wallet.id ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/address/${wallet.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-gray-100 text-[#A3A39E] transition-colors"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#A3A39E]">
                      <span className="flex items-center gap-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: chain?.color || "#999",
                          }}
                        />
                        {getChainName(wallet.chain_id)}
                      </span>
                      <span>
                        연결: {new Date(wallet.connected_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!wallet.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(wallet.id)}
                        className="p-2 rounded-lg hover:bg-yellow-50 text-[#A3A39E] hover:text-yellow-600 transition-colors"
                        title="기본 지갑으로 설정"
                      >
                        <StarOff size={16} />
                      </button>
                    )}
                    {wallet.is_primary && (
                      <span className="p-2 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                      </span>
                    )}
                    <button
                      onClick={() => handleDisconnect(wallet.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-[#A3A39E] hover:text-red-600 transition-colors"
                      title="연결 해제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-sm text-[#1A1A1A] mb-4">
          예정된 Web3 기능
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              title: "NFT 콘텐츠 인증",
              desc: "저장한 콘텐츠를 NFT로 민팅",
              emoji: "🎨",
              status: "개발 예정",
            },
            {
              title: "토큰 리워드",
              desc: "활동에 따른 JOO 토큰 적립",
              emoji: "🪙",
              status: "기획 중",
            },
            {
              title: "DAO 거버넌스",
              desc: "커뮤니티 의사결정 참여",
              emoji: "🏛️",
              status: "기획 중",
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-gray-50">
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-sm font-medium text-[#1A1A1A] mt-2">
                {item.title}
              </p>
              <p className="text-[11px] text-[#A3A39E] mt-0.5">{item.desc}</p>
              <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 text-[#6B6B66]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
