import React from "react";
import { ArrowRight } from "@mynaui/icons-react";

const CategorySection = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#BA5B55]">Curation</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E180D] tracking-tight">
            Browse by Craft & Heritage
          </h2>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-[#BA5B55] hover:underline cursor-pointer self-start sm:self-auto"
          >
            Clear category filter (Show all)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === String(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "ring-2 ring-[#BA5B55] border-transparent shadow-lg scale-[1.02]"
                  : "border-gray-200 hover:border-[#BA5B55]/50 hover:shadow-md"
              }`}
            >
              {/* Image background with overlay */}
              <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
              </div>

              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
                <p className="text-sm sm:text-base font-bold leading-tight group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-[11px] text-gray-200 font-medium">
                  <span>{cat.product_count} items</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-amber-200">
                    Explore <ArrowRight size={12} />
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
