export default function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-neutral-900 rounded-full animate-spin" />
        {/* <p className="text-sm text-gray-400 tracking-wide">Ładowanie…</p> */}
      </div>
    </div>
  );
}
