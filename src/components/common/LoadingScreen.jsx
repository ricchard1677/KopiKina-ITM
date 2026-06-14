export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-5 overflow-hidden shadow-lg shadow-brand-200">
          <img
            src="/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-02.png"
            alt="KopiKina"
            className="w-14 h-14 object-contain"
          />
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-600 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
