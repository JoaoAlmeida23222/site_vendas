import React, { useEffect, useState } from "react";
import api from "../api"; // Import the api instance

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products") // Now, the token is automatically included
      .then(response => setProducts(response.data.products))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
