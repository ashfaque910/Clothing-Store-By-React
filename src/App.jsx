import React, { useState, useEffect } from "react";
import axios from "axios";

function ClothingStore() {
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [clothingList, setClothingList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndDisplay(category);
  }, [category]);

  const fetchAndDisplay = (category) => {
    axios.get("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json")
      .then((response) => {
        const data = response.data;
        const categoryData = category === "All" ?
          data.categories.flatMap((cat) => cat.category_products) :
          data.categories.find((cat) => cat.category_name.toLowerCase() === category.toLowerCase())?.category_products;
        setClothingList(categoryData || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      });
  };

  const filteredClothingList = clothingList.filter((product) =>
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="buttons">
        <button onClick={() => setCategory('All')}>All</button>
        <button onClick={() => setCategory('Men')}>Men</button>
        <button onClick={() => setCategory('Women')}>Women</button>
        <button onClick={() => setCategory('Kids')}>Children</button>
      </div>
      <div className="clothing-list">
        {error ? (
          <p>{error}</p>
        ) : (
          filteredClothingList.map((product, index) => (
            <div className="clothing-item" key={index}>
              <img src={product.image} alt={product.title} className="clothing-image" />
              <p>Title: {product.title}</p>
              <p>Price: {product.price}</p>
              <p>Vendor: {product.vendor}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClothingStore;
