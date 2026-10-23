export default function PricesPage() {
  const crops = [
    ["Wheat", 2425, 2510],
    ["Paddy", 2300, 2280],
    ["Maize", 2225, 2190],
    ["Mustard", 5950, 6100],
  ];

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        📈 MSP & Mandi Prices
      </h1>
      <p className="text-amber-800 mb-5">
        Demo prices only, not current official rates.
      </p>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left text-gray-800">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-4">Crop</th>
              <th className="p-4">MSP</th>
              <th className="p-4">Mandi Price</th>
            </tr>
          </thead>
          <tbody>
            {crops.map(([name, msp, mandi]) => (
              <tr key={name} className="border-b">
                <td className="p-4">{name}</td>
                <td className="p-4">₹{msp}</td>
                <td className="p-4">₹{mandi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
