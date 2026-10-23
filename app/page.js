
import Link from "next/link";

const features = [
  {
    title: "Marketplace",
    description: "Sell fresh produce directly to customers.",
    emoji: "🛒",
    href: "/marketplace",
  },
  {
    title: "Barter System",
    description: "Exchange crops, seeds, and farming tools.",
    emoji: "🔄",
    href: "/barter",
  },
  {
    title: "Farm Rentals",
    description: "Rent tractors, machinery, and farmland.",
    emoji: "🚜",
    href: "/rentals",
  },
  {
    title: "Weather Updates",
    description: "Check weather before planning farm activities.",
    emoji: "🌤️",
    href: "/weather",
  },
  {
    title: "MSP & Mandi Prices",
    description: "Explore crop prices and MSP information.",
    emoji: "📈",
    href: "/prices",
  },
  {
    title: "Crop Advisor",
    description: "Get guidance for choosing suitable crops.",
    emoji: "🌱",
    href: "/crop-advisor",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-green-50">
      <section className="bg-green-800 text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🌾 Welcome to Kisan Setu
        </h1>

        <p className="text-lg mb-8">
          Empowering farmers through technology,
          trade, and community.
        </p>

        <Link
          href="/marketplace"
          className="bg-yellow-400 text-green-950 px-6 py-3 rounded-lg font-bold"
        >
          Explore Marketplace →
        </Link>
      </section>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-10">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition border border-green-100"
            >
              <div className="text-4xl mb-4">
                {feature.emoji}
              </div>

              <h3 className="text-xl font-bold text-green-800 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
