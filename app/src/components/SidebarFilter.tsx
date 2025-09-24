// components/SidebarFilter.tsx
import React from "react";

interface FilterState {
  tags: string[];
}

interface SidebarFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTags: string[];
}

export default function SidebarFilter({
  filters,
  onFilterChange,
  availableTags,
}: SidebarFilterProps) {
  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter((t) => t !== tag);
    onFilterChange({
      ...filters,
      tags: newTags,
    });
  };

  const handleReset = () => {
    onFilterChange({ tags: [] });
  };

  return (
    <div className="w-64 bg-white p-4 border-r border-neutral-200">
      <h3 className="text-lg font-semibold mb-4 text-black">Filter Produk</h3>

      {/* Filter Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={(e) => handleTagChange(tag, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-black">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Reset Filter
      </button>
    </div>
  );
}
