export default function Footer() {
  return (
    <div className="w-full flex items-center justify-center gap-10 mt-auto">
      <div className="flex-1 h-px bg-gray-200"></div>
      <p className="text-[10px] text-[rgba(0,0,0,0.5)] tracking-[1.25em]">
        {(() => {
          const d = new Date();
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}${m}${day}`;
        })()}
      </p>
      <div className="flex-1 h-px bg-gray-200"></div>
    </div>
  );
}
