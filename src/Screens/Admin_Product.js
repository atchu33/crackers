import React, { useState, useEffect } from "react";
import Layout from "./AdminLayouts";
import { FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import localforage from "localforage";
import API_BASE_URL from "./apiConfig";

// Define base styles outside the component to avoid circular references
const baseInputStyle = {
  flex: "1",
  padding: "6px",
  borderRadius: "5px",
  border: "1px solid #000",
  fontSize: "12px",
  height: "32px",
  boxSizing: "border-box",
};

const AdminProduct = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [previewUrl, setPreviewUrl] = useState("");
const [ratePer, setRatePer] = useState(""); // ← Add this
const [loadingUnits, setLoadingUnits] = useState(true);
const [unitOfSale, setUnitOfSale] = useState([]);      // All units: [{unitID: 1, name: "Box"}, ...]
const [selectedUnitId, setSelectedUnitId] = useState(""); // Selected unit ID (number)
const [pieces, setPieces] = useState("");
const [authChecked, setAuthChecked] = useState(false);
const [isCategoryOpen, setIsCategoryOpen] = useState(false);

useEffect(() => {
  const fetchUnitOfSale = async () => {
    try {
      const token = await localforage.getItem("jwtToken");
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}api/Crackers/GetUnitOfSale`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.statusCode === 200 && Array.isArray(response.data.data)) {
        setUnitOfSale(response.data.data);
        // Optional: set default only if not editing
      } else {
        setUnitOfSale([]);
      }
    } catch (error) {
      console.error("Error fetching unit of sale:", error);
      setUnitOfSale([]);
      alert("Failed to load unit options.");
    }
  };

  fetchUnitOfSale();
}, []);
  // Debug API base URL
  useEffect(() => {
    console.log("Using API Base URL:", API_BASE_URL);
  }, []);

  // Fetch categories
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = await localforage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_BASE_URL}api/Crackers/GetCategories`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { CompanyId: 1 }, // Pass companyId in query params
        }
      );

      let categoriesData = [];

      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data?.result) {
        categoriesData = response.data.result;
      } else if (response.data?.data) {
        categoriesData = response.data.data;
      }

      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        console.warn("No categories found in response");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please check console for details.");
      setCategories([]);
    }
  };

  fetchCategories();
}, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
  try {
    setLoading(true);
    const token = await localforage.getItem("jwtToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${API_BASE_URL}api/Crackers/GetProductSummary`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { CompanyId: 1 }, // Pass companyId in query params
      }
    );

    if (response.data?.result) {
      setProducts(response.data.result);
    } else {
      console.warn("Unexpected API response structure for products");
      setProducts([]);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    setError("Failed to load products");
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

    
    fetchProducts();
  }, []);
const handleAddProduct = async () => {
  if (!productName.trim()) {
    alert("Please enter a product name.");
    return;
  }
  if (!productPrice) {
    alert("Please enter a product price.");
    return;
  }
  if (!selectedCategory) {
    alert("Please select a category.");
    return;
  }
  if (!selectedUnitId) {
    alert("Please select a unit of sale.");
    return;
  }

  const price = parseFloat(productPrice);
  const disc = parseFloat(discount) || 0;
  const stock = openingStock ? parseInt(openingStock, 10) : 0;

  if (isNaN(price)) {
    alert("Price must be a valid number.");
    return;
  }

  try {
    setIsSubmitting(true);
    const token = await localforage.getItem("jwtToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("CategoryId", selectedCategory);
    formData.append("ProdName", productName.trim());
    formData.append("ProdPrice", price);
    formData.append("DiscountPercentage", disc);
    formData.append("companyId", 1); // ✅ Always set companyId = 2
    formData.append("OpeningStock", stock);
    formData.append("unitID", selectedUnitId);
    formData.append("pieces", pieces);
    formData.append("expiryDate", expiryDate);

    if (image && typeof image !== "string") {
      formData.append("ProdImage", image);
    }
    if (typeof image === "string" && image.trim() !== "") {
      formData.append("ProdImageUrl", image.trim());
    }

    if (editId) {
      formData.append("id", editId);
    }
    if (ratePer) {
      formData.append("ratePer", ratePer);
    }

    const response = await axios.post(
      `${API_BASE_URL}api/Crackers/AddOrUpdateProduct`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data) {
      throw new Error("No data received from server");
    }
    if (response.data.statusCode !== 200) {
      throw new Error(response.data.statusDesc || "Unknown server error");
    }

    // ✅ Refresh product list & also pass companyId=2
    const productsResponse = await axios.get(
      `${API_BASE_URL}api/Crackers/GetProductSummary`,
      {
        params: { companyId: 1 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!productsResponse.data?.result) {
      throw new Error("Invalid product list response structure");
    }

    setProducts(productsResponse.data.result);

    resetForm();
    alert(`Product ${editId ? "updated" : "added"} successfully!`);
  } catch (error) {
    console.error("Error saving product:", error);
    alert(`Failed to ${editId ? "update" : "add"} product: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};


const resetForm = () => {
  setProductName("");
  setProductPrice("");
  setDiscount("");
  setImage("");
  setOpeningStock("");
  setExpiryDate("");
  setPieces("");
  setEditId(null);
   setSelectedCategory("");  
  setSelectedUnitId("");
  setPreviewUrl(""); // ← Add this
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = "";
};

const handleEdit = async (id) => {
  try {
    setIsLoading(true);
    const token = await localforage.getItem("jwtToken");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    console.log("Fetching product with ID:", id);

    const response = await axios.get(`${API_BASE_URL}api/Crackers/GetProductById`, {
      params: { productId: id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", response.data);

    if (response.data.statusCode === 200 && response.data.data) {
      const product = response.data.data;

      setProductName(product.prodName || "");
      setProductPrice(product.prodPrice || "");
      setDiscount(product.discountPercentage || "");
      setImage(product.prodImage?.trim() || "");
      setPreviewUrl(product.prodImage?.trim() || "");
      setOpeningStock(product.openingStock || "");
      setPieces(product.pieces || "");
      setExpiryDate(product.expiryDate ? product.expiryDate.split("T")[0] : "");
      setSelectedCategory(product.categoryId?.toString() || "");
      
      // ✅ FIX: Use unitID (not unitId)
      setSelectedUnitId(product.unitID || ""); // ← This will auto-select in dropdown

      setEditId(id);
    } else {
      throw new Error(response.data.statusDesc || "Failed to load product details");
    }
  } catch (error) {
    console.error("Error loading product:", error);
    alert("Failed to load product. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const token = await localforage.getItem("jwtToken");
    if (!token) {
      alert("Not authenticated. Please log in.");
      window.location.href = "/login"; // Redirect to login
      return;
    }

    const response = await axios.post(
      `${API_BASE_URL}api/Crackers/DeleteProduct`,
      { productId: id }, // This is the data (body)
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      } // This is the config, where headers go
    );

if (response.data.statusCode === 200) {
      alert("Product deleted successfully!");

      // ✅ Refetch and update products list
      const productsResponse = await axios.get(
        `${API_BASE_URL}api/Crackers/GetProductSummary`,
        {
          params: { companyId: 1 },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // ✅ Set the updated list
      setProducts(productsResponse.data?.result || []);
    } else {
      alert(response.data.statusDesc || "Failed to delete product");
    }
  } catch (error) {
    console.error("Delete error:", error);

    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
    } else if (error.response?.data?.statusDesc) {
      alert(`Error: ${error.response.data.statusDesc}`);
    } else {
      alert("Failed to delete product. Please try again.");
    }
  }
};

  return (
    <>
      <Layout />
      <div style={styles.container}>
        <div style={styles.titleContainer}>
        
          <div style={{ ...styles.filterRow, justifyContent: "right", marginTop: "10px"}}>
              {/* <h2 style={styles.title}>Manage Products</h2> */}
  <button 
    onClick={handleAddProduct} 
    style={{ ...styles.addButton, width: "auto", minWidth: "120px", }}
    disabled={isSubmitting}
  >
    {isSubmitting ? "Processing..." : (editId ? "Update Product" : "Add Product")}
  </button>
</div>

        </div>

        {/* Add/Edit Product Form */}
        <div style={styles.filterContainer}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category:</label>
             <div style={styles.customDropdown}>
  <div
    style={styles.customDropdownToggle}
    onClick={() => setIsCategoryOpen(prev => !prev)}
  >
    {selectedCategory
      ? categories.find(c => (c.id || c.categoryId || c._id).toString() === selectedCategory)?.name ||
        categories.find(c => (c.id || c.categoryId || c._id).toString() === selectedCategory)?.categoryName ||
        "Unknown Category"
      : "Select Category"
    }
  </div>

  {isCategoryOpen && (
    <ul style={styles.customDropdownList}>
      {categories.length === 0 ? (
        <li style={styles.customDropdownItem}>No categories available</li>
      ) : (
        categories.map((category) => {
          const catId = (category.id || category.categoryId || category._id).toString();
          const catName = category.name || category.categoryName || category.title || "Unnamed";
          return (
            <li
              key={catId}
               style={{
        ...styles.customDropdownItem,
        '&:hover': styles.customDropdownItem[':hover'] // Apply hover style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "gray";
         e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
         e.currentTarget.style.color = "black";
      }}
              onClick={() => {
                setSelectedCategory(catId);
                setIsCategoryOpen(false);
              }}
            >
              {catName}
            </li>
          );
        })
      )}
    </ul>
  )}

  {/* Close dropdown when clicking outside */}
  {isCategoryOpen && (
    <div
      style={styles.dropdownOverlay}
      onClick={() => setIsCategoryOpen(false)}
    />
  )}
</div>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Product Name:</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={styles.input}
                placeholder="Enter name"
                required
              />
            </div>
<div style={styles.filterGroup}>
  <label style={styles.filterLabel}>Units:</label>
  <select
  value={selectedUnitId}
  onChange={(e) => setSelectedUnitId(Number(e.target.value))}
  style={styles.select}
  required
>
  <option value="">Select Unit</option>
  {unitOfSale.map((unit) => (
    <option key={unit.unitID} value={unit.unitID}>
      {unit.name}
    </option>
  ))}
</select>
</div>
<div style={styles.filterGroup}>
  <label style={styles.filterLabel}>Pieces:</label>
  <input
    type="number"
    value={pieces}
    onChange={(e) => setPieces(e.target.value)}
    style={styles.input}
    placeholder="Enter number of pieces"
    min="0"
    required
  />
</div>
          </div>

<div style={styles.filterRow}>
    <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Price (₹):</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                style={styles.input}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
<div style={styles.filterGroup}>
  <label style={styles.filterLabel}>Discount (%):</label>
  <input
    type="number"
    value={discount}
    onChange={(e) => setDiscount(e.target.value)}
    onWheel={(e) => e.target.blur()} // Optional: Prevents accidental scroll changes
    style={styles.input}
    placeholder="e.g. 10"
    min="0"
    max="100"
    step="10" // 👈 This makes arrow keys & spinner buttons change by 10
  />
</div>
  <div style={styles.filterGroup}>
    <label style={styles.filterLabel}>Opening Stock:</label>
    <input
      type="number"
      value={openingStock}
      onChange={(e) => setOpeningStock(e.target.value)}
      style={styles.input}
      placeholder="Initial stock"
      min="0"
      
    />
  </div>
 
  <div style={styles.filterGroup}>
    <label style={styles.filterLabel}>Image:</label>
    {/* Hidden File Input */}
    <input
      type="file"
      accept="image/*"
        onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        // ✅ Check file size (max 300 KB)
        if (file.size > 300 * 1024) {
          alert("The selected image is too large. Please choose an image smaller than 300 KB.");
          return;
        }

        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
      }}
      style={{ display: "none" }}
      id="file-input"
    />
    <div style={{
      ...styles.fileInputDisplay,
      justifyContent: "flex-start",
      gap: "10px"
    }}>
      {previewUrl ? (
        <>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "13px",
              color: "#0066cc",
              textDecoration: "underline",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            View Image
          </a>
          <span
            onClick={() => {
              setImage("");
              setPreviewUrl("");
              document.getElementById("file-input").value = "";
            }}
            style={{
              fontSize: "16px",
              color: "#dc3545",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "8px",
              width: "16px",
              height: "16px",
              textAlign: "center",
              border: "1px solid #dc3545",
              borderRadius: "50%",
              lineHeight: "14px"
            }}
            title="Remove image"
          >
            ×
          </span>
        </>
      ) : (
        <label
          htmlFor="file-input"
          style={{
            ...styles.browseButton,
            cursor: "pointer",
            padding: "4px 8px",
            backgroundColor: "#e9ecef",
            border: "1px solid #ccc",
            fontSize: "13px"
          }}
        >
          Choose Image
        </label>
      )}
    </div>
  </div>
</div>


        </div>

        {/* Products Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Product No</th>
                <th style={styles.th}>Category Name</th>
                <th style={styles.th}>Product Name</th>
                 <th style={styles.th}>Units</th>
                  <th style={styles.th}>Pieces</th>
                <th style={styles.th}>Price (₹)</th>
                <th style={styles.th}>Discount (%)</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={styles.loadingRow}>
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" style={styles.errorRow}>
                    {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={styles.noDataRow}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.productId} style={{ backgroundColor: "#f9f9f9" }}>
                    <td style={styles.tdCenter}>{index + 1}</td>
                    <td style={styles.tdCenter}>{product.productId}</td>
                    <td style={styles.td}>{product.categoryName}</td>
                    <td style={styles.td}>{product.prodName}</td>
                      <td style={styles.td}>{product.unitName}</td>
                   <td style={styles.tdCenter}>
  {product.pieces ? `${product.pieces} Pieces` : '-'}
</td>                  
                    <td style={styles.tdCenter}>{product.prodPrice?.toFixed(2) || "0.00"}</td>
                    <td style={styles.tdCenter}>{product.discountPercentage || "0"} %</td>
<td style={styles.tdCenter}>
  {product.prodImage?.trim() ? (
    <img
      src={
        product.prodImage.trim().startsWith("http")
          ? product.prodImage.trim()
          : `${API_BASE_URL}${product.prodImage.trim()}`
      }
      alt="Product"
      style={{
        width: "30px",
        height: "30px",
        objectFit: "cover",
        borderRadius: "4px",
        border: "1px solid #ddd",
        backgroundColor: "#f0f0f0",
      }}
    />
  ) : (
    <span style={{ fontSize: "12px", color: "#999" }}>No Image</span>
  )}
</td>
                    <td style={styles.tdCenter}>
                      <div style={styles.actionContainer}>
                        <button
                          onClick={() => handleEdit(product.id)}
                          style={{ ...styles.actionButton, ...styles.editButton }}
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{ ...styles.actionButton, ...styles.deleteButton }}
                          title="Delete"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
 const styles = {
    container: {
      padding: "10px",
      maxHeight: "400px",
    },
     titleContainer: {
    padding: "2px",
    borderRadius: "4px",
    textAlign: "left",
    color: "#fff",
    // backgroundColor: "#f8f9fa",
    // border: "1px solid #ddd",
    marginBottom: "10px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
  },
  title: {
    color: "darkblue",
    fontWeight: "900",
    fontSize: "18px",
    margin: 0,
  },
  // addProductButton: {
  //   backgroundColor: "#042d88",
  //   color: "white",
  //   border: "none",
  //   padding: "8px 16px",
  //   borderRadius: "4px",
  //   cursor: "pointer",
  //   fontSize: "13px",
  //   fontWeight: "bold",
  //   marginLeft: "10px",
  // },
     
  filterContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "15px",
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flex: "1 1 200px", 
    minWidth: "200px",
  },
  filterLabel: {
    fontWeight: "bold",
    fontSize: "12px",
    width: "120px", 
    color: "#333",
    flexShrink: 0,
  },
  input: {
    ...baseInputStyle,
    flex: "1", 
    minWidth: "150px", 
  },
  select: {
    ...baseInputStyle,
    backgroundColor: "white",
    flex: "1", // Takes remaining space
    minWidth: "150px", // Same as input
  },
    addButton: {
      backgroundColor: "#042d88",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px",
      width: "auto",
      minWidth: "100px",
      fontWeight: "bold",
      fontSize: "12px",
      alignSelf: "right",
      borderRadius: "4px",
      fontFamily: "inherit",
    },
    tableContainer: {
      maxHeight: "300px",
      overflowY: "auto",
      marginBottom: "40px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#1e1e66",
      color: "#fff",
      textAlign: "center",
      fontSize: "12px",
      padding: "8px",
      position: "sticky",
      top: 0,
      zIndex: "1",
    },
    td: {
      padding: "6px",
      border: "1px solid #ccc",
      textAlign: "left",
      fontSize: "12px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tdCenter: {
      textAlign: "center",
      padding: "6px",
      border: "1px solid #ccc",
      fontSize: "12px",
    },
    imgThumbnail: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "6px",
      border: "1px solid #ddd",
    },
    actionContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    },
    actionButton: {
      padding: "6px",
      fontSize: "12px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
    },
    editButton: {
      backgroundColor: "#bbbdbeff",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    noDataRow: {
      textAlign: "center",
      color: "#666",
      fontStyle: "italic",
      padding: "1rem",
    },
    loadingRow: {
      textAlign: "center",
      padding: "1rem",
    },
    errorRow: {
      textAlign: "center",
      color: "#dc3545",
      padding: "1rem",
    },
    fileInputContainer: {
      position: "relative", 
      flex: 1,
      display: "flex",
      alignItems: "center"
    },
    fileInputDisplay: {
  ...baseInputStyle,
  display: "flex",
  justifyContent: "flex-start", // Align items to the left
  alignItems: "center",
  backgroundColor: "white",
  overflow: "hidden",
  gap: "8px",
},
    fileName: {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: "#666"
    },
    browseButton: {
      backgroundColor: "#f0f0f0",
      padding: "4px 8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "12px",
      marginLeft: "8px"
    },
     customDropdown: {
    position: "relative",
    flex: "1",
    minWidth: "150px",
  },
  customDropdownToggle: {
    ...baseInputStyle,
    backgroundColor: "white",
    cursor: "pointer",
    padding: "6px 10px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "32px",
    boxSizing: "border-box",
    fontWeight: "normal",
  },
  customDropdownList: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    maxHeight: "220px", // ← Controls height (shows ~4-5 items)
    overflowY: "auto",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    zIndex: 1000,
    listStyle: "none",
    margin: "2px 0",
    padding: "0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontSize: "12px",
  },
  customDropdownItem: {
    padding: "6px 10px",
    cursor: "pointer",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  customDropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  dropdownOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  };
export default AdminProduct;