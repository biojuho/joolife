import { BottomTabBar } from "@/components/bottom-tab-bar";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
      {children}
      <BottomTabBar />
    </div>
  );
}
