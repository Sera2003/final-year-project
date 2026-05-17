const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"];

const SIZE_RULES = [
  { size: "S", maxWeight: 60, maxHeight: 170 },
  { size: "M", maxWeight: 72, maxHeight: 178 },
  { size: "L", maxWeight: 85, maxHeight: 186 },
  { size: "XL", maxWeight: 100, maxHeight: 194 },
  { size: "XXL", maxWeight: Infinity, maxHeight: Infinity },
];

const normalizeSize = (size) => String(size || "").trim().toUpperCase();

const toMetric = (measurements = {}) => {
  const unit = measurements.unit || "metric";
  const rawHeight = Number(measurements.height);
  const rawWeight = Number(measurements.weight);

  if (!rawHeight || !rawWeight) {
    return null;
  }

  if (unit === "imperial") {
    return {
      height: rawHeight * 2.54,
      weight: rawWeight * 0.453592,
    };
  }

  return {
    height: rawHeight,
    weight: rawWeight,
  };
};

const findClosestAvailableSize = (targetSize, availableSizes = []) => {
  const normalizedAvailable = availableSizes.map(normalizeSize);

  if (normalizedAvailable.includes("ONE SIZE")) {
    return "One Size";
  }

  if (normalizedAvailable.includes(targetSize)) {
    return availableSizes[normalizedAvailable.indexOf(targetSize)];
  }

  const targetIndex = SIZE_ORDER.indexOf(targetSize);
  const availableIndexes = normalizedAvailable
    .map((size, index) => ({ size, index, order: SIZE_ORDER.indexOf(size) }))
    .filter((item) => item.order !== -1);

  if (targetIndex === -1 || availableIndexes.length === 0) {
    return null;
  }

  const closest = availableIndexes.reduce((best, current) => {
    const bestDistance = Math.abs(best.order - targetIndex);
    const currentDistance = Math.abs(current.order - targetIndex);
    return currentDistance < bestDistance ? current : best;
  });

  return availableSizes[closest.index];
};

export const getRecommendedSize = (measurements, availableSizes = []) => {
  const metric = toMetric(measurements);

  if (!metric || availableSizes.length === 0) {
    return null;
  }

  const rule = SIZE_RULES.find(
    (item) => metric.weight <= item.maxWeight && metric.height <= item.maxHeight
  );

  if (!rule) {
    return null;
  }

  return findClosestAvailableSize(rule.size, availableSizes);
};
