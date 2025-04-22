import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import './AddPickupForm.css';
 // Import the CSS file

const AddDeliveryForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState("");
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!phoneNumber.trim()) {
      validationErrors.phoneNumber = "Phone number is required";
    }
    if (!address.trim()) {
        validationErrors.address = "Address is required";
      }
    if (!items.trim()) {
      validationErrors.items = "Items description is required";
    }
    if (!deliveryDate) {
      validationErrors.deliveryDate = "Delivery date is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve the token
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("items", items);
    images.forEach((image) => { // Append each image
      formData.append("images", image);
    });
    formData.append("notes", notes);
    formData.append("deliveryDate", deliveryDate);

    try {
      const response = await fetch("http://localhost:3000/api/deliveries", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Delivery added successfully!");
        navigate("/viewdeliveries/");
      } else if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized to add delivery");
        setErrors({ general: "Unauthorized to add a new delivery. Please log in." });
      } else {
        const errorData = await response.json();
        console.error("Error adding delivery:", errorData);
        setErrors({ general: "Failed to add delivery." }); // Set a general error message
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setErrors({ general: "Network error. Please try again." }); // Set a network error message
    }

    // Clear the form fields only on successful submission (no general error)
    if (!errors.general && Object.keys(validationErrors).length === 0) {
      setName("");
      setPhoneNumber("");
      setAddress("");
      setItems("");
      setImages([]);
      setNotes("");
      setDeliveryDate("");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    switch (name) {
      case "name":
        setName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
        case "address":
            setAddress(value);
            break;
      case "items":
        setItems(value);
        break;
      case "images":
        setImages([...e.target.files]);
        break;
      case "notes":
        setNotes(value);
        break;
      case "deliveryDate":
        setDeliveryDate(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="add-pickup-form-page">
      <div className="form-container">
        <h2 className="form-title">Add New Delivery</h2>
        <form method='post' onSubmit={handleSubmit} encType="multipart/form-data" className="add-form">
          {errors.general && <p className="error-message general-error">{errors.general}</p>}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.items && <p className="error-message">{errors.items}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="items" className="form-label">Items:</label>
            <input
              type="text"
              id="items"
              name="items"
              value={items}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.items && <p className="error-message">{errors.items}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="images" className="form-label">Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleInputChange}
              className="form-input-file"
              multiple
            />
               {images.length > 0 && (
              <div className="image-preview-container">
                {Array.from(images).map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    className="image-preview"
                    style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryDate" className="form-label">Delivery Date:</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={deliveryDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.deliveryDate && <p className="error-message">{errors.deliveryDate}</p>}
          </div>
          <button type="submit" className="submit-button">Add Delivery</button>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryForm;