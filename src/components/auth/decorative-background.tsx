export function DecorativeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* soft color washes */}
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-lavender blur-3xl opacity-70" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-baby-blue blur-3xl opacity-60" />
      <div className="absolute bottom-[-6rem] left-1/4 h-72 w-72 rounded-full bg-blush blur-3xl opacity-70" />

      {/* gingham ribbon strip */}
      <div className="gingham-bg absolute top-0 left-0 h-3 w-full opacity-80" />

      {/* floating stickers */}
      <span className="animate-float-slow absolute top-[12%] left-[8%] text-4xl select-none">
        🌸
      </span>
      <span className="animate-float-slower absolute top-[22%] right-[10%] text-3xl select-none">
        ☁️
      </span>
      <span className="animate-float-slow absolute bottom-[18%] left-[12%] text-3xl select-none">
        🎀
      </span>
      <span className="animate-twinkle absolute top-[8%] right-[28%] text-2xl select-none">
        ✨
      </span>
      <span className="animate-float-slower absolute bottom-[10%] right-[16%] text-4xl select-none">
        🐇
      </span>
      <span className="animate-float-slow absolute bottom-[32%] right-[6%] text-2xl select-none">
        🍵
      </span>
      <span className="animate-twinkle absolute top-[45%] left-[5%] text-xl select-none">
        ⭐
      </span>
    </div>
  );
}
