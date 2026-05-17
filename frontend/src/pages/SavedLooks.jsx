import React, { useEffect, useState } from "react";

const STORAGE_KEY = "savedLooks";

const SavedLooks = () => {
  const [looks, setLooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setLooks(saved);
  }, []);

  const removeLook = (id) => {
    const updated = looks.filter((l) => l.id !== id);
    setLooks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold">Saved Looks</h1>
      <p className="text-gray-600 mt-2">
        Your saved virtual try-on results (prototype).
      </p>

      {looks.length === 0 ? (
        <p className="text-sm text-gray-600 mt-6">
          No saved looks yet. Go to Virtual Try-On and click “Save Look”.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {looks.map((look) => (
            <div key={look.id} className="border rounded-lg p-4">
              <img
                src={look.resultImage}
                alt="Saved look"
                className="w-full h-64 object-contain border rounded"
              />
              <p className="text-sm text-gray-700 mt-3">
                <span className="font-medium">Product:</span>{" "}
                {look.productId || "N/A"}
              </p>
              <button
                onClick={() => removeLook(look.id)}
                className="mt-4 border px-4 py-2 text-sm w-full"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLooks;
