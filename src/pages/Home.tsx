import { useNavigate } from "react-router-dom";
import PageLayout from "../Components/PageLayout";

const categories = [
  {
    id: "money",
    icon: "💰",
    title: "Money Planning",
    items: [
      { label: "🛡️ วางแผนเงินสำรองฉุกเฉิน", path: "/emergency" },
      { label: "🌅 วางแผนเงินเพื่อการเกษียณ", path: "/retirement" },
    ],
  },
  {
    id: "board",
    icon: "📋",
    title: "เด็กนัดบอร์ด",
    items: [{ label: "🕵️ Undercover", path: "/undercover" }],
  },
  {
    id: "dev",
    icon: "🔧",
    title: "Dev Workshop",
    items: [{ label: "🔍 Search", path: "/search" }],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showFooter>
      {/* Header */}
      <header className="pt-14 pb-8 text-center px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-4 text-3xl">
          🌿
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-1">
          Faiichannn
        </h1>
        <p className="text-green-200 text-sm">วางแผนเพื่อชีวิตที่ดีขึ้น</p>
      </header>

      {/* Cards */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/25 flex flex-col gap-4"
            >
              {/* Card Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                  {cat.icon}
                </div>
                <h2 className="text-white font-bold text-base">{cat.title}</h2>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20" />

              {/* Items */}
              <div className="flex flex-col gap-3">
                {cat.items.length > 0 ? (
                  cat.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full py-3 px-4 bg-white/90 hover:bg-white text-green-900 rounded-xl text-sm font-medium text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <div className="py-3 px-4 rounded-xl border border-dashed border-white/30 text-white/50 text-sm text-center">
                    Coming soon...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

    </PageLayout>
  );
};

export default Home;
