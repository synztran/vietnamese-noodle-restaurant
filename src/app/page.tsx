// Home — customer-facing landing page
export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Top Navigation ── */}
      <header className="fixed top-0 w-full z-50 bg-stone-50/80 silk-blur shadow-sm shadow-red-900/5 safe-top">
        <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-headline italic text-primary text-xl">
            Hủ Tiếu Ngọc Mai
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-stone-500 cursor-pointer">
            search
          </span>
          <span className="material-symbols-outlined text-stone-500 cursor-pointer">
            shopping_bag
          </span>
        </div>
        </div>
      </header>

      <main className="pb-28" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
        {/* ── Hero ── */}
        <section className="relative w-full h-[580px] overflow-hidden">
          <div className="absolute inset-0 lacquer-gradient opacity-90" />
          <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGZSiSgYIQAljXDGXDQ6_gc732CpTCcuzVbuMHZtM3b0h-BJlKd73uJcxX0eMskJkDLUXJrZX7dC07OEQ2NblCzqUhxR3Vhit3JZ21w7UGSohV5aHP2Pd16qjBpVeYCtU-zWt4iwYuKw0MNdriUNTqrfHkMRA5LQh0kiYUByOfyy5OiT8olLyKAiY7feGhH3bbKGpANI5DSazmrPYmVVI0_J2F4n99w26ml1v_hv3IIrdLfx7ppHabPEkpNH632eJVhPSpgHBltbdA')] bg-cover bg-center mix-blend-overlay opacity-30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="text-secondary-fixed-dim font-label uppercase tracking-[0.2em] text-xs mb-4">
              Bến Tre Từ Năm 2015
            </span>
            <h2 className="font-headline text-5xl text-on-primary font-bold tracking-tight mb-6 leading-tight">
              Giữ Gìn
              <br />
              Hương Vị
            </h2>
            <a
              href="#signature"
              className="bg-primary hover:opacity-90 transition-opacity px-8 py-3 rounded-xl text-on-primary font-medium flex items-center gap-2"
            >
              <span>Khám Phá Truyền Thống</span>
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-on-primary/60 text-[10px] uppercase tracking-widest font-bold">
              Cuộn để khám phá
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-on-primary/60 to-transparent" />
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section className="relative -mt-12 z-10 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 bg-surface-container-lowest/80 silk-blur p-3 rounded-2xl shadow-xl shadow-black/5">
            {[
              { icon: "history_edu", label: "Lịch sử", href: "#" },
              { icon: "restaurant", label: "Đặc sản", href: "#signature" },
              { icon: "stars", label: "Đánh giá", href: "#reviews" },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center justify-center py-4 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <span className="material-symbols-outlined text-secondary mb-1 group-hover:scale-110 transition-transform">
                  {icon}
                </span>
                <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Signature Flavors ── */}
        <section id="signature" className="mt-20 px-6 max-w-7xl mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div className="max-w-lg">
              <h3 className="font-headline text-3xl text-primary font-bold mb-2">
                Hương Vị Đặc Trưng
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Mỗi tô là một trang trong kho lưu trữ ẩm thực Bến Tre,
                chế biến với sự kiên nhẫn của nhiều thế hệ.
              </p>
            </div>
            <button className="text-secondary font-bold font-label text-xs uppercase tracking-widest flex items-center gap-1 group shrink-0">
              Xem thêm{" "}
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Feature */}
            <div className="md:col-span-7 relative group overflow-hidden rounded-3xl h-96">
              <div className="absolute inset-0 lacquer-gradient opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase px-2 py-1 rounded mb-3 inline-block tracking-tighter">
                  Nguyên bản
                </span>
                <h4 className="text-on-primary font-headline text-3xl font-bold mb-2">
                  Hủ Tiếu Nam Vang Classic
                </h4>
                <p className="text-on-primary/80 text-sm max-w-sm mb-4">
                  Khô hoặc nước lèo, công thức gốc được gìn giữ suốt bảy thập kỷ.
                </p>
                <button className="text-on-primary flex items-center gap-2 group/btn">
                  <span className="font-label text-xs font-bold uppercase tracking-widest">
                    Khám phá thêm
                  </span>
                  <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                    east
                  </span>
                </button>
              </div>
            </div>

            {/* Secondary stack */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {[
                { title: "Hủ Tiếu Hải Sản Bến Tre", price: "120.000đ" },
                { title: "Hủ Tiếu Khô Truyền Thống", price: "95.000đ" },
              ].map(({ title, price }) => (
                <div
                  key={title}
                  className="flex-1 relative group overflow-hidden rounded-xl bg-surface-container-low h-40"
                >
                  <div className="flex h-full">
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                      <h4 className="font-headline text-xl text-primary font-bold mb-2">
                        {title}
                      </h4>
                      <span className="text-secondary font-bold text-sm">
                        {price}
                      </span>
                    </div>
                    <div className="w-1/2 lacquer-gradient opacity-40 rounded-r-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section id="reviews" className="mt-32 px-6 py-20 bg-stone-100/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-secondary-container">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star_half
                  </span>
                </div>
                <span className="font-bold text-on-surface">4.8/5.0</span>
              </div>
              <h3 className="font-headline text-4xl text-primary font-bold mb-6">
                Được Tin Yêu Bởi Người Dân Bến Tre
              </h3>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed italic">
                &ldquo;The only place where the broth truly tastes like my
                grandmother&apos;s kitchen. A living piece of our history.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Minh Hoang</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">
                    Nhà nghiên cứu lịch sử địa phương
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm text-center">
                <p className="text-4xl font-headline font-bold text-primary mb-2">
                  12k+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Tô/Tháng
                </p>
              </div>
              <div className="lacquer-gradient p-8 rounded-2xl shadow-sm text-center text-on-primary">
                <p className="text-4xl font-headline font-bold mb-2">4.9</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Đánh giá Google
                </p>
              </div>
              <div className="bg-secondary p-8 rounded-2xl shadow-sm text-center text-on-secondary col-span-2">
                <p className="text-xl font-headline font-bold mb-2">
                  Kinh doanh từ 2015
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Nhiều thế hệ gìn giữ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Visit the Archive ── */}
        <section className="mt-32 px-6 max-w-7xl mx-auto mb-12">
          <div className="rounded-3xl overflow-hidden bg-stone-900 flex flex-col md:flex-row min-h-[400px]">
            <div className="flex-1 p-12 flex flex-col justify-center">
              <h3 className="font-headline text-3xl text-secondary-fixed-dim font-bold mb-6">
                Ghé Thăm Quán
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">
                    location_on
                  </span>
                  <div>
                    <p className="text-stone-100 font-bold mb-1">
                      128 Ben Tre Riverfront
                    </p>
                    <p className="text-stone-400 text-sm">
                      Phường 4, TP. Bến Tre, Việt Nam
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">
                    schedule
                  </span>
                  <div>
                    <p className="text-stone-100 font-bold mb-1">
                      Giờ Mở Cửa
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 text-sm text-stone-400">
                      <span>Thứ 2 – Thứ 6</span>
                      <span>06:00 – 21:00</span>
                      <span>Thứ 7 – Chủ nhật</span>
                      <span>05:30 – 22:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-10 bg-secondary hover:opacity-90 transition-opacity px-8 py-4 rounded-xl text-on-secondary font-bold uppercase tracking-widest text-xs w-fit">
                Xem Đường Đi
              </button>
            </div>
            <div className="flex-1 relative min-h-[300px] bg-stone-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-stone-500 text-6xl">
                map
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-stone-50/90 silk-blur border-t border-stone-200/30 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-50 rounded-t-3xl">
        {[
          { icon: "dashboard", label: "Trang chủ", href: "/", active: true },
          { icon: "restaurant_menu", label: "Đặt hàng", href: "/staff/orders", active: false },
          { icon: "history", label: "Lịch sử", href: "/staff/history", active: false },
          { icon: "settings", label: "Cài đặt", href: "/login", active: false },
        ].map(({ icon, label, href, active }) => (
          <a
            key={label}
            href={href}
            className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-300 ease-out ${
              active ? "text-secondary" : "text-stone-500 opacity-60 hover:text-secondary"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="font-label uppercase tracking-widest text-[10px] font-bold">
              {label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
