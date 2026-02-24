import { GNB } from '@/components/layout/GNB';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <GNB />
      <main className="pt-14">{children}</main>
      <Footer />
    </div>
  );
}
