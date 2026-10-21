import React from "react";
import { ArrowRight, Sparkles, Check } from "@mynaui/icons-react";
import { triggerHaptic } from "../../lib/haptics";

const CategorySection = ({ categories, selectedCategory, onSelectCategory }) => {
  const handleCategoryClick = (slug) => {
    triggerHaptic("selection");
    const isSelected = selectedCategory === slug;
    onSelectCategory(isSelected ? null : slug);
  };

  return (
    <section className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-4 sm:mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#BA5B55]">
            <Sparkles size={13} />
            <span>Curated Bengal Disciplines</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1E180D] tracking-tight font-serif mt-0.5">
            Browse by Craft & Heritage
          </h2>
        </div>
        {selectedCategory && (
          <button
            onClick={() => {
              triggerHaptic("light");
              onSelectCategory(null);
            }}
            className="text-xs font-semibold text-[#BA5B55] hover:underline cursor-pointer touch-press"
          >
            Show All
          </button>
        )}
      </div>

      {/* Touch-Snapping Horizontal Carousel on Mobile, Grid on Tablet/Desktop */}
      <div className="flex sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-carousel -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === String(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border w-[150px] sm:w-auto shrink-0 snap-start touch-press select-none ${
                isSelected
                  ? "ring-2 ring-[#BA5B55] border-transparent shadow-lg scale-[1.02]"
                  : "border-gray-200 hover:border-[#BA5B55]/50 hover:shadow-md"
              }`}
            >
              {/* Image background with overlay */}
              <div className="h-32 sm:h-44 w-full relative overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>

                {/* Selected Check Pill */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-[#BA5B55] text-white p-1 rounded-full shadow-md animate-scale-pulse">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <p className="text-xs sm:text-base font-bold leading-tight group-hover:text-amber-200 transition-colors line-clamp-1 font-serif">
                  {cat.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] sm:text-[11px] text-gray-200 font-medium">
                  <span>{cat.product_count} items</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-amber-200">
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
