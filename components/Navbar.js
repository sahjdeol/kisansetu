
import Link from "next/link";

const links = [
  ["/marketplace", "Marketplace"],
  ["/barter", "Barter"],
  ["/rentals", "Rentals"],
  ["/weather", "Weather"],
  ["/prices", "MSP & Prices"],
  ["/community", "Community"],
  ["/crop-advisor", "AI Advisor"],
];

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4">
      <div className="flex flex-wrap gap-5 items-center">
        <Link href="/" className="text-xl font-bold">
          🌾 Kisan Setu
        </Link>

        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
