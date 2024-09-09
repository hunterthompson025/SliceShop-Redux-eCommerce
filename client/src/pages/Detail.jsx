import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, UPDATE_PRODUCTS } from '../utils/appSlice';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';

function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  // Access products and cart from Redux state
  const products = useSelector((state) => state.app.products);
  const cart = useSelector((state) => state.app.cart);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // If products are already in the global store
    if (products.length) {
      const product = products.find((product) => product._id === id);
      if (product) {
        setCurrentProduct(product);
      }
    }
    // If data is retrieved from the server
    else if (data) {
      dispatch(UPDATE_PRODUCTS(data.products));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });

      const product = data.products.find((product) => product._id === id);
      if (product) {
        setCurrentProduct(product);
      }
    }
    // If loading is finished and nothing is in the store yet, load from IndexedDB
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(UPDATE_PRODUCTS(indexedProducts));

        const product = indexedProducts.find((product) => product._id === id);
        if (product) {
          setCurrentProduct(product);
        }
      });
    }
  }, [products, data, loading, dispatch, id]);

  const handleAddToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(UPDATE_CART_QUANTITY({ _id: id, purchaseQuantity: itemInCart.purchaseQuantity + 1 }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: itemInCart.purchaseQuantity + 1,
      });
    } else {
      dispatch(ADD_TO_CART({ ...currentProduct, purchaseQuantity: 1 }));
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(REMOVE_FROM_CART(currentProduct._id));
    idbPromise('cart', 'delete', { _id: currentProduct._id });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={handleRemoveFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;