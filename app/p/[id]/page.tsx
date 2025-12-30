type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export const runtime = "nodejs";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(`/api/pastes/${id}`, {
    cache: "no-store",
  });


  // 🔒 Defensive guard
  if (!res.ok) {
    return (
      <main className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            404 – Paste not found
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            This paste may have expired or reached its view limit.
          </p>
        </div>
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

        <pre className="bg-green-50 border border-green-200 rounded-lg p-4 
                        text-gray-800 text-sm leading-relaxed 
                        whitespace-pre-wrap break-words font-mono">
          {data.content}
        </pre>

        <div className="mt-4 flex flex-col gap-1 text-sm text-gray-700">
          {data.remaining_views !== null && (
            <p>
              👁️ Remaining views:{" "}
              <span className="font-medium text-green-700">
                {data.remaining_views}
              </span>
            </p>
          )}

          {data.expires_at && (
            <p>
              ⏳ Expires at:{" "}
              <span className="font-medium text-green-700">
                {new Date(data.expires_at).toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
