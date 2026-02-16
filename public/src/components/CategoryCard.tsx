import { Link } from 'react-router-dom';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group card-minimal p-6 text-center transition-all hover:shadow-md hover:border-primary"
    >
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="font-medium text-foreground">{category.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {category.productCount} products
      </p>
    </Link>
  );
};

export default CategoryCard;
