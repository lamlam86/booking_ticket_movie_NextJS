export default function BenefitsStrip() {
    const items = [
        { icon: "/assets/images/ct-1.svg", title: "Đặt vé nhanh", sub: "Không xếp hàng" },
        { icon: "/assets/images/ct-2.svg", title: "Ưu đãi thành viên", sub: "Tích điểm – quà tặng" },
        { icon: "/assets/images/ct-3.svg", title: "Hệ thống rạp", sub: "Phủ rộng tiện lợi" },
    ];
    return (
        <section className="benefits">
            <div className="benefits__inner">
                {items.map((it, i) => (
                    <div key={i} className="benefit">
                        <img src={it.icon} alt={it.title} />
                        <div>
                            <h4>{it.title}</h4>
                            <p>{it.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
