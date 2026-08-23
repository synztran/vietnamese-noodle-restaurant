import Image from "next/image";
import Link from "next/link";

// Home — customer-facing landing page
export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Top Navigation ── */}
      <header className="fixed top-0 w-full z-50 bg-stone-50/80 silk-blur shadow-sm shadow-red-900/5 safe-top">
        <div className="h-16 flex items-center justify-evenly px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-primary text-2xl">
              Hủ Tiếu
            </h1>
          </div>
          <div className="relative w-16 h-16">
            <Image src="/logo-header-remove.png" alt="Logo" layout="fill" objectFit="cover" />
          </div>
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-primary text-2xl">
              Ngọc Mai
            </h1>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
        {/* ── Hero ── */}
        <section className="relative w-full h-[580px] overflow-hidden">
          {/* <div className="absolute inset-0 lacquer-gradient opacity-90" /> */}
          <div className="absolute inset-0 bg-[url('/head-banner.png')] bg-cover bg-center" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="text-secondary-fixed-dim font-label uppercase tracking-[0.2em] text-sm mb-4">
              Bến Tre Từ Năm 2015
            </span>
            <h2 className="font-headline text-5xl text-on-primary font-bold tracking-tight mb-6 leading-tight" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,1)" }}>
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
          <div className="max-w-4xl mx-auto grid grid-cols-4 gap-3 bg-surface-container-lowest/80 silk-blur p-3 rounded-2xl shadow-xl shadow-black/5">
            {[
              { icon: "history_edu", label: "Lịch sử", href: "#" },
              { icon: "restaurant", label: "Đặc sản", href: "#signature" },
              { icon: "menu_book", label: "Thực đơn", href: "#menu" },
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
          <div className="mb-8 flex items-end justify-between">
            <div className="max-w-lg">
              <h3 className="font-headline text-3xl text-primary font-bold mb-2">
                Hương Vị Đặc Trưng
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Mỗi tô là một trang trong kho lưu trữ ẩm thực Bến Tre,
                chế biến với sự kiên nhẫn của nhiều thế hệ.
              </p>
            </div>
            {/* <button className="text-secondary font-bold font-label text-xs uppercase tracking-widest flex items-center gap-1 group shrink-0">
              Xem thêm{" "}
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Feature */}
            <div className="md:col-span-7 relative group overflow-hidden rounded-3xl h-96">
              <div className="absolute inset-0 bg-[url('/high_light/hutieu.png')] bg-contain bg-no-repeat bg-center mx-2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="bg-white/15 silk-blur border border-white/30 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-3 inline-block tracking-widest">
                  Nguyên bản
                </span>
                <h4
                  className="text-white font-headline text-3xl font-bold mb-2 leading-tight"
                  style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,1)" }}
                >
                  Hủ Tiếu Xương Ống
                </h4>
                <p
                  className="text-white/80 text-sm max-w-sm mb-4"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
                >
                  Khô hoặc nước lèo, công thức gốc được gìn giữ suốt nhiều năm.
                </p>
                {/* <button className="text-on-primary flex items-center gap-2 group/btn">
                  <span className="font-label text-xs font-bold uppercase tracking-widest">
                    Khám phá thêm
                  </span>
                  <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                    east
                  </span>
                </button> */}
              </div>
            </div>

            {/* Secondary stack */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {[
                { title: "Hủ Tiếu Hải Sản", price: "40.000đ", image: "/high_light/hu_tieu_hai_san.png" },
                { title: "Sủi cảo gia truyền", price: "30.000đ", image: "/high_light/sui_cao.jpg" },
              ].map(({ title, price, image }) => (
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
                    <div className="w-1/2 rounded-r-xl bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Menu ── */}
        <section id="menu" className="mt-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-label uppercase tracking-[0.2em] text-xs mb-3 block">Từ gian bếp</span>
            <h3 className="font-headline text-4xl text-primary font-bold">Thực Đơn</h3>
            <div className="w-12 h-0.5 bg-secondary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Noodle Bases */}
            <div>
              <h4 className="font-headline text-2xl text-primary font-bold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">ramen_dining</span>
                Các loại sợi
              </h4>
              <div className="space-y-6">
                {[
                  { name: "Hủ Tiếu", desc: "Sợi gạo dai truyền thống", price: "45k", img: "/high_light/hutieu.png" },
                  { name: "Bánh Canh", desc: "Sợi bột lọc mềm mịn", price: "35k", img: "/high_light/soi_banh_canh.jpg" },
                  { name: "Mì Gói", desc: "Mì gói đậm đà hương vị", price: "35k", img: "/high_light/mi_an_lien.jpg" },
                  { name: "Mì Bột", desc: "Mì bột được làm thủ công bởi thợ lâu năm", price: "40k", img: "/high_light/mi_bot.jpg" },
                ].map(({ name, desc, price, img }) => (
                  <div key={name} className="flex items-center gap-6 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container-low">
                      {img ? (
                        <div className="w-full h-full bg-cover bg-center " style={{ backgroundImage: `url(${img})` }} />
                      ) : (
                        <div className="w-full h-full lacquer-gradient opacity-20" />
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center border-b border-stone-100 pb-4">
                      <div>
                        <p className="font-headline text-lg text-on-surface font-bold">{name}</p>
                        <p className="text-xs text-on-surface-variant italic">{desc}</p>
                      </div>
                      <span className="font-bold text-secondary font-label shrink-0 ml-4">{price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Toppings */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200/50">
              <h4 className="font-headline text-2xl text-primary font-bold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">add_circle</span>
                Món ăn kèm
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Gà (Chicken)", price: "+15k" },
                  { label: "Xương Ống Heo (Pork Bone)", price: "+15k" },
                  { label: "Hoành Thánh (Wonton)", price: "+10k" },
                  { label: "Trứng Cút (Quail Eggs)", price: "+5k" },
                  { label: "Hải Sản (Seafood)", price: "+25k" },
                ].map(({ label, price }) => (
                  <div key={label} className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary/60 shrink-0" />
                      <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{label}</span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-stone-300 mx-4" />
                    {/* <span className="font-bold text-secondary font-label shrink-0">{price}</span> */}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-stone-200">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest text-center">
                  Tùy chỉnh tô theo ý bạn muốn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section id="reviews" className="mt-16 px-6 py-20 bg-stone-100/50">
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
                    star
                  </span>
                </div>
                <span className="font-bold text-on-surface">5.0/5.0</span>
              </div>
              <h3 className="font-headline text-4xl text-primary font-bold mb-6">
                Được Tin Yêu Bởi Người Dân Bến Tre
              </h3>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed italic">
                &ldquo;Đồ ăn ngon nêm nếm vừa phải. Nói chung rất là xuất sắc. Chắc chắn sẽ ghé lại.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Hoàng Minh</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">
                    Khách hàng thân thiết từ 2016
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm text-center">
                <p className="text-4xl font-headline font-bold text-primary mb-2">
                  100%
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Hài lòng từ khách hàng
                </p>
              </div>
              <div className="lacquer-gradient p-8 rounded-2xl shadow-sm text-center text-on-primary">
                <p className="text-4xl font-headline font-bold mb-2">5.0</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Đánh giá Google
                </p>
              </div>
              <div className="bg-secondary p-8 rounded-2xl shadow-sm text-center text-on-secondary col-span-2">
                <p className="text-xl font-headline font-bold mb-2">
                  Khởi đầu từ 2015
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Nhiều thế hệ gìn giữ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Visit the Archive ── */}
        <section className="mt-32 px-6 max-w-7xl mx-auto mb-6">
          <div className="rounded-3xl overflow-hidden bg-stone-900 flex flex-col md:flex-row min-h-[400px]">
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h3 className="font-headline text-3xl text-secondary-fixed-dim font-bold mb-6">
                Ghé Thưởng Thức
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">
                    location_on
                  </span>
                  <div>
                    <p className="text-stone-100 font-bold mb-1">
                      Hẻm 56a2 Đồng Khởi
                    </p>
                    <p className="text-stone-400 text-sm">
                      Phường Phú Tân, TP. Bến Tre, Vĩnh Long, Việt Nam
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
                      <span>06:00 – 12:00</span>
                      <span>Thứ 7 – Chủ nhật</span>
                      <span>06:00 – 11:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="https://maps.app.goo.gl/jan7ifeKuPLhuKbt5" target="_blank" className="mt-10 bg-secondary hover:opacity-90 transition-opacity px-8 py-4 rounded-xl text-on-secondary font-bold uppercase tracking-widest text-xs w-fit">
                Xem Đường Đi
              </Link>
            </div>
            <div className="flex-1 relative min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4876.8895488354165!2d106.36146261147226!3d10.257595789818993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aa99b5b85ee29%3A0x655909c19d6b7740!2zSOG7pyBUaeG6v3UgTmfhu41jIE1haQ!5e1!3m2!1sen!2s!4v1774776512226!5m2!1sen!2s"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hủ Tiếu Ngọc Mai — Google Maps"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full px-6 py-4 bg-stone-900 text-center space-y-2">
        <p className="text-stone-600 text-[10px] uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} Hủ Tiếu Ngọc Mai. Bảo lưu mọi quyền.
        </p>
      </footer>
    </div>
  );
}
