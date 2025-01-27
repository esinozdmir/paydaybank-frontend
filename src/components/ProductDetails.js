import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    available: false,
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`http://localhost:8080/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Ürün detayları yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = () => {
    setProduct(prev => ({
      ...prev,
      available: !prev.available
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let imageUrl = product.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("http://localhost:8080/upload/image", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error("Resim yüklenirken bir hata oluştu.");
        }

        imageUrl = await uploadResponse.text();
      }

      const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...product, image: imageUrl })
      });

      if (!response.ok) {
        throw new Error("Güncelleme başarısız oldu!");
      }

      alert("Ürün başarıyla güncellendi!");
      navigate("/products");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Ürün detayları yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="text-2xl font-bold">Ürün Detayları</h1>
      </header>

      <div className="product-details-card">
        <div className="product-details-form">
          {error && <p className="text-red-500">{error}</p>}
          <div className="form-group">
            <label>Adı:</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Fiyat:</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Açıklama:</label>
            <textarea name="description" value={product.description} onChange={handleChange} className="form-textarea"></textarea>
          </div>
          <div className="form-group file-input-group">
            <label>Resim Yükle:</label>
            <input type="file" onChange={handleImageChange} className="form-input" />
          </div>
          {product.image && (
            <div className="image-preview">
              <img src={product.image.startsWith("http") ? product.image : `http://localhost:8080${product.image}`} alt="Ürün Resmi" className="rounded-lg shadow-md" />
            </div>
          )}
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" checked={product.available} onChange={handleCheckboxChange} className="form-checkbox" />
              Stok Durumu
            </label>
          </div>
          <div className="button-group">
            <button onClick={handleSave} className="save-button flex items-center gap-2">
              <CheckCircle /> Kaydet
            </button>
            <button onClick={() => navigate("/products")} className="cancel-button">İptal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
