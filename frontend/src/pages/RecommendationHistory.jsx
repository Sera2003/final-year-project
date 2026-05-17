import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "recommendationHistory";

const RecommendationHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold">Recommendation History</h1>
      <p className="text-gray-600 mt-2">
        Your previous AI recommendations (prototype).
      </p>

      {history.length === 0 ? (
        <p className="text-sm text-gray-600 mt-6">
          No history yet. Go to AI Stylist and generate recommendations.
        </p>
      ) : (
        <>
          <div className="mt-6 flex justify-end">
            <button onClick={clearHistory} className="border px-4 py-2 text-sm">
              Clear History
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-5">
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Preferences:</span>{" "}
                  {entry.preferencesText}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {entry.items.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`}>
                      <button className="border px-3 py-2 text-sm">
                        {item.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationHistory;
