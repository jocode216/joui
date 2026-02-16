import { Link } from 'react-router-dom';
import styles from './ProductGrid.module.css';

interface ProductCardStyledProps {
  product: {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    category?: string;
    price: number;
    thumbnail?: string;
    image_url?: string;
  };
}

const ProductCardStyled = ({ product }: ProductCardStyledProps) => {
  // Logic simplified as we no longer need stock/cart checks for the button
  const productName = product.title || product.name || 'Unnamed Product';
  const productImage = product.thumbnail || product.image_url || '/placeholder-image.jpg';

  return (
    /* Wrap the entire card in a Link to make the whole area clickable */
    <Link to={`/product/${product.id}`} className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
      <img
        src={productImage}
        alt={productName}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
        }}
      />
      
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{productName}</h3>
        
        <div className={styles.productPrice}>
          ETB {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardStyled;