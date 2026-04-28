import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#080808] min-h-screen flex flex-col items-center justify-center text-white px-4">
      <p className="text-[#888888] text-sm uppercase tracking-widest mb-4">
        Error 404
      </p>
      <h1 className="text-6xl md:text-8xl font-bold mb-4">Page Not Found</h1>
      <p className="text-[#888888] text-lg mb-10 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-[#e0e0e0] transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
