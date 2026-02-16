import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "electronics", name: "Electronics" },
  { id: "womens", name: "Womens" },
  { id: "mens", name: "Mens" },
  { id: "kids", name: "Kids" },
  { id: "beauty", name: "Beauty" },
  { id: "decoration", name: "Decorations" },
  { id: "digital", name: "Digital" },
];

const CategoryBar = () => {
  const navigate = useNavigate();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      navigate(`/products?category=${e.target.value}`);
    }
  };

  return (
    <div
      className="w-full border-b border-gray-700 shadow-sm"
      style={{ backgroundColor: "#232f3e" }}
    >
      <div className="container mx-auto px-4 py-1">
        {/* MOBILE VIEW: Select Dropdown (visible below 768px) */}
        <div className="md:hidden py-1">
          <select
            onChange={handleSelectChange}
            className="w-full bg-[#3a4a5d] text-white border border-gray-500 rounded-md p-2 text-sm focus:ring-1 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* DESKTOP VIEW: Tight Horizontal Row */}
        <div className="hidden md:flex items-center justify-start gap-1 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/products?category=${category.id}`)}
              className="text-sm font-medium text-white hover:outline hover:outline-1 hover:outline-white transition-all whitespace-nowrap px-3 py-2 rounded-sm"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
