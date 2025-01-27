import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import './AddProduct.css';
const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    available: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [nextProductId, setNextProductId] = useState(null);

  useEffect(() => {
    const fetchNextProductId = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) {
          throw new Error("Ürün listesi alınamadı.");
        }
        const data = await response.json();
        const maxId = Math.max(...data.map((p) => p.id), 0);
        setNextProductId(maxId + 1);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchNextProductId();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = () => {
    setProduct((prev) => ({ ...prev, available: !prev.available }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("http://localhost:8080/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Resim yüklenirken bir hata oluştu.");
        }

        imageUrl = await uploadResponse.text();
      }

      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: nextProductId, ...product, image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Ürün eklenirken bir hata oluştu.");
      }

      alert("Ürün başarıyla eklendi!");
      navigate("/products");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Yeni Ürün Ekle</h1>
      </header>
      <main className="dashboard-main">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Ürün Adı:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              placeholder="Ürün adını girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Fiyat:</label>
            <input
              id="price"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              placeholder="Fiyatı girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama:</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              placeholder="Ürün açıklamasını girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="available">Stok Durumu:</label>
            <input
              id="available"
              type="checkbox"
              checked={product.available}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Resim Yükle:</label>
            <input id="image" type="file" onChange={handleImageChange} />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Ürün Ekle
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
