import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            슬로에이징 코치
          </h1>
          <p className="text-sm text-text-light mt-1">
            12주 저속노화 프로그램
          </p>
        </Link>
        {children}
      </div>
    </div>
  );
}
