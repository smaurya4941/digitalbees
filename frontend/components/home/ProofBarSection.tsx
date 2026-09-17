/**
 * Proof bar — card-style 4-stat strip matching Stitch spec Section 3.
 * Gold headline numbers on a light card with dividers.
 */
export default function ProofBarSection() {
  const stats = [
    { value: "6", label: "Global Regions" },
    { value: "7", label: "Specialist Practices" },
    { value: "500+", label: "Specialists Deployed" },
    { value: "98%", label: "Client Retention Rate" },
  ];

  return (
    <section className="bg-[#f8f9ff] py-6 border-b border-[#e7e8ee]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 md:p-6 rounded-lg bg-white border border-[#c4c6ce]/30 shadow-sm">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col pr-4 ${i < stats.length - 1 ? "border-r border-[#e7e8ee]" : ""}`}
            >
              <span className="text-[32px] leading-[40px] font-bold text-[#C6963A] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[16px] leading-[24px] text-[#44474d] mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}