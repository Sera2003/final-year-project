import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products = [], search, showSearch } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
const tryonMode = searchParams.get("tryon") === "true";

  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filter state
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // ✅ Outputs
  const [filterProducts, setFilterProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const normalize = (value) => String(value || '').trim().toLowerCase();
  const normalizeProductType = (value) => {
    const type = normalize(value);
    const aliases = {
      tops: 'topwear',
      topwear: 'topwear',
      bottoms: 'bottomwear',
      bottomwear: 'bottomwear',
      sets: 'gym sets',
      'gym sets': 'gym sets',
      accessories: 'accessories',
      weights: 'accessories',
      cardio: 'accessories',
      strength: 'accessories',
      recovery: 'accessories',
    };

    return aliases[type] || type;
  };

  // ✅ Generate "Recommended for you" (Prototype)
  // Later: replace with an AI backend endpoint
  useEffect(() => {
    if (!products || products.length === 0) return;
    const pick = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    setRecommended(pick);
  }, [products]);

  useEffect(() => {
  if (tryonMode) {
    toast.info("Pick a product, then click TRY-ON on the product page.");
  }
}, [tryonMode]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const sortProducts = (arr) => {
    const sorted = [...arr];
    if (sortType === 'low-high') return sorted.sort((a, b) => a.price - b.price);
    if (sortType === 'high-low') return sorted.sort((a, b) => b.price - a.price);
    return sorted;
  };

  // ✅ Apply filters (search + category + subcategory + sorting)
  const computedProducts = useMemo(() => {
    let list = [...products];

    if (showSearch && search) {
      const s = normalize(search);
      list = list.filter((item) => normalize(item?.name).includes(s));
    }

    if (category.length > 0) {
      const selectedCategories = category.map(normalize);
      list = list.filter((item) => selectedCategories.includes(normalize(item.category)));
    }

    if (subCategory.length > 0) {
      const selectedSubCategories = subCategory.map(normalizeProductType);
      list = list.filter((item) =>
        selectedSubCategories.includes(normalizeProductType(item.subCategory))
      );
    }

    return sortProducts(list);
  }, [products, showSearch, search, category, subCategory, sortType]);

  const hasActiveFilters =
    category.length > 0 ||
    subCategory.length > 0 ||
    (showSearch && search.trim());

  useEffect(() => {
    setFilterProducts(computedProducts);
  }, [computedProducts]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* LEFT: FILTERS */}
      <div className="min-w-60">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdownFilter_icon}
            alt="dropdown"
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? 'block' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Men"
                onChange={toggleCategory}
                checked={category.includes('Men')}
              />
              Men's Gymwear
            </label>

            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Women"
                onChange={toggleCategory}
                checked={category.includes('Women')}
              />
              Women's Gymwear
            </label>

            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Gym Equipment"
                onChange={toggleCategory}
                checked={category.includes('Gym Equipment')}
              />
              Gym Equipment
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? 'block' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">PRODUCT TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Topwear"
                onChange={toggleSubCategory}
                checked={subCategory.includes('Topwear')}
              />
              Workout Tops
            </label>

            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Bottomwear"
                onChange={toggleSubCategory}
                checked={subCategory.includes('Bottomwear')}
              />
              Training Bottoms
            </label>

            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Gym Sets"
                onChange={toggleSubCategory}
                checked={subCategory.includes('Gym Sets')}
              />
              Gym Sets
            </label>

            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Accessories"
                onChange={toggleSubCategory}
                checked={subCategory.includes('Accessories')}
              />
              Gym Accessories
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT: PRODUCTS */}
      <div className="flex-1">
        {/* ✅ AI Recommended Section */}
        {!hasActiveFilters && recommended.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommended.map((item) => (
                <ProductItem
                  key={item._id}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </div>
        )}

        {/* Header + Sort */}
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <p>No products found matching your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
