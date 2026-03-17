import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Placeholder for more sections */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">強大的功能，簡約的體驗</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Wonder Mesh", desc: "內置服務網格，讓內網通信更安全可靠。" },
            { title: "多雲部署", desc: "支持 AWS, GCP, DigitalOcean 等多種雲端平台。" },
            { title: "自動擴展", desc: "根據流量自動調整資源，節省成本。" }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
