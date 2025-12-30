import { use } from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); 

  if (!id) {
    return <h1>Invalid paste ID</h1>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  return fetch(`${baseUrl}/api/pastes/${id}`, { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) {
        return (
          <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-red-600">Paste not found</h1>
          </main>
        );
      }

      const data: PasteResponse = await res.json();

      return (
        <main className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-semibold text-green-700 mb-4">
              📄 DropText
            </h1>

            <pre className="bg-green-50 border border-green-200 rounded-lg p-4 font-mono whitespace-pre-wrap break-words">
              {data.content}
            </pre>
          </div>
        </main>
      );
    });
}
