export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          App Router Works!
        </h1>
        <p className="text-gray-600">
          This page is served by Next.js 13 App Router with Tailwind CSS.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <div className="h-4 w-4 rounded-full bg-pink-500"></div>
        </div>
      </div>
    </div>
  );
}
