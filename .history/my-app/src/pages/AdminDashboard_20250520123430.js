import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminDashboard.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    long_description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      });
  }, [navigate]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productToSend = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10)
    };

    try {
      const response = await axios.post("/products", productToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        description: "",
        long_description: "",
        price: "",
        stock: "",
        image_url: ""
      });
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || "Error creating product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productToUpdate = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      stock: parseInt(editingProduct.stock, 10)
    };

    try {
      const response = await axios.put(`/products/${productToUpdate.id}`, productToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.map(p => p.id === productToUpdate.id ? response.data : p));
      setEditingProduct(null);
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || "Error updating product");
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || "Error deleting product");
    }
  };

  const handleNumberInputChange = (e, field, isEditing = false) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      if (isEditing) {
        setEditingProduct(prev => ({ ...prev, [field]: value }));
      } else {
        setNewProduct(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ height: '8px' }} /> {/* Spacer to prevent overlap */}

      <div className="admin-dashboard">
        {error && <p className="error">{error}</p>}

        <div className="product-form">
          <h2>Create New Product</h2>
          <form onSubmit={handleCreateProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
            <input
              placeholder="Long Description"
              value={newProduct.long_description}
              onChange={(e) => setNewProduct({ ...newProduct, long_description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => handleNumberInputChange(e, 'price')}
              step="0.01"
              min="0"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => handleNumberInputChange(e, 'stock')}
              min="0"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
            />
            <button type="submit">Create Product</button>
          </form>
        </div>

        <div className="product-list">
          <h2>Manage Products</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="button-group">
                      <button onClick={() => handleEditProduct(product)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingProduct && (
          <div className="product-edit-form">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
              <input
                type="text"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                required
              />
              <input
                type="text"
                value={editingProduct.long_description}
                onChange={(e) => setEditingProduct({ ...editingProduct, long_description: e.target.value })}
                required
              />
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => handleNumberInputChange(e, 'price', true)}
                step="0.01"
                min="0"
                required
              />
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) => handleNumberInputChange(e, 'stock', true)}
                min="0"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingProduct.image_url || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
              />
              < className="button-group-edit">
              <button type="submit">Update Product</button>
              <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
