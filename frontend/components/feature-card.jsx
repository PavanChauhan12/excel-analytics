export function FeatureCard({ feature }) {
  return (
    <div className="relative max-w-44 rounded-xl animate-spin-border shadow-[0_0_25px_rgba(0,255,255,0.4)] perspective-[1000px]">
      <div className="bg-[--neon-dark] rounded-xl backdrop-blur-xl p-4 py-6 flex flex-col justify-center items-center text-center 
        shadow-[inset_0_0_20px_rgba(0,255,255,0.4)] border border-[--neon-blue] 
        transform-gpu transition-transform duration-500 hover:scale-110 hover:-translate-z-10">
        <div className="mb-2">{feature.icon}</div>
        <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
        <p className="text-xs text-gray-300 mt-1">{feature.description}</p>
      </div>
    </div>
  );
}
