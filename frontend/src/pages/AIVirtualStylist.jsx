import React, { useMemo, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const RECOMMENDATION_HISTORY_KEY = "recommendationHistory";

const AIVirtualStylist = () => {
  const { token, navigate } = useContext(ShopContext);

  const [genderStyle, setGenderStyle] = useState("Women");
  const [occasion, setOccasion] = useState("Casual");
  const [color, setColor] = useState("Neutral");
  const [budget, setBudget] = useState("Medium");
  const [results, setResults] = useState([]);

  // ✅ Optional: block guests
  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to use AI Stylist");
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Prototype recommendation list (replace later with backend AI)
  const dummyCatalog = useMemo(
    () => [
      { id: "101", name: "Oversized Hoodie", tag: "Casual • Neutral" },
      { id: "102", name: "Classic Blazer", tag: "Formal • Neutral" },
      { id: "103", name: "Summer Dress", tag: "Casual • Bright" },
      { id: "104", name: "Denim Jacket", tag: "Street • Neutral" },
      { id: "105", name: "Black Jeans", tag: "Casual • Dark" },
      { id: "106", name: "White Sneakers", tag: "Casual • Neutral" },
    ],
    []
  );

  const saveRecommendationHistory = (picked) => {
    const history = JSON.parse(
      localStorage.getItem(RECOMMENDATION_HISTORY_KEY) || "[]"
    );

    history.unshift({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      preferencesText: `${genderStyle}, ${occasion}, ${color}, ${budget}`,
      items: picked.map((p) => ({ id: p.id, name: p.name, tag: p.tag })),
    });

    localStorage.setItem(RECOMMENDATION_HISTORY_KEY, JSON.stringify(history));
  };

  const generateRecommendations = async () => {
    toast.info("Generating recommendations (prototype)...");

    // ✅ Prototype logic
    const picked = [...dummyCatalog].sort(() => 0.5 - Math.random()).slice(0, 4);

    setResults(picked);
    saveRecommendationHistory(picked);

    setTimeout(() => {
      toast.success("Recommendations ready!");
    }, 400);
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold mb-2">AI Virtual Stylist</h1>
      <p className="text-gray-600 mb-8">
        Get outfit recommendations based on your preferences. (Prototype)
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Quiz */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Style Quiz</h2>

          <label className="block text-sm font-medium mb-2">Style Category</label>
          <select
            value={genderStyle}
            onChange={(e) => setGenderStyle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-4"
          >
            <option>Women</option>
            <option>Men</option>
            <option>Unisex</option>
          </select>

          <label className="block text-sm font-medium mb-2">Occasion</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-4"
          >
            <option>Casual</option>
            <option>Formal</option>
            <option>Street</option>
            <option>Business</option>
            <option>Party</option>
          </select>

          <label className="block text-sm font-medium mb-2">Preferred Colors</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-4"
          >
            <option>Neutral</option>
            <option>Bright</option>
            <option>Dark</option>
            <option>Pastel</option>
          </select>

          <label className="block text-sm font-medium mb-2">Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-6"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={generateRecommendations}
            className="bg-black text-white px-5 py-2 text-sm"
          >
            Get Recommendations
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Recommendations are saved locally for now (localStorage).
          </p>

          <div className="mt-4">
            <Link to="/recommendation-history" className="text-sm underline">
              View Recommendation History
            </Link>
          </div>
        </div>

        {/* Right: Results */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>

          {results.length === 0 ? (
            <p className="text-sm text-gray-600">
              No recommendations yet. Complete the quiz and click “Get Recommendations”.
            </p>
          ) : (
            <div className="space-y-4">
              {results.map((item) => (
                <div key={item.id} className="border rounded p-4">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.tag}</div>

                  <div className="mt-3 flex gap-3">
                    <Link to={`/product/${item.id}`}>
                      <button className="border px-4 py-2 text-sm">
                        View Product
                      </button>
                    </Link>

                    <Link to="/virtual-try-on">
                      <button className="bg-black text-white px-4 py-2 text-sm">
                        Try On
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="my-6" />

          <Link to="/collection" className="text-sm underline">
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIVirtualStylist;
