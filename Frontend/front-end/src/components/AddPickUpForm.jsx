import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AddPickupForm.css'; // Import the CSS file

const AddPickupForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState("");
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
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
    if (!items.trim()) {
      validationErrors.items = "Items description is required";
    }
    if (!pickupDate) {
      validationErrors.pickupDate = "Pickup date is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve the token
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("items", items);
    formData.append("image", image);
    formData.append("notes", notes);
    formData.append("pickupDate", pickupDate);

    try {
      const response = await fetch("http://localhost:3000/api/pickups", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Pickup added successfully!");
        navigate("/viewpickups/");
      } else if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized to add pickup");
        setErrors({ general: "Unauthorized to add a new pickup. Please log in." });
      } else {
        const errorData = await response.json();
        console.error("Error adding pickup:", errorData);
        setErrors({ general: "Failed to add pickup." }); // Set a general error message
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setErrors({ general: "Network error. Please try again." }); // Set a network error message
    }

    // Clear the form fields only on successful submission (no general error)
    if (!errors.general && Object.keys(validationErrors).length === 0) {
      setName("");
      setPhoneNumber("");
      setItems("");
      setImage(null);
      setNotes("");
      setPickupDate("");
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
      case "items":
        setItems(value);
        break;
      case "image":
        setImage(e.target.files[0]);
        break;
      case "notes":
        setNotes(value);
        break;
      case "pickupDate":
        setPickupDate(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="add-pickup-form-page">
      <div className="form-container">
        <h2 className="form-title">Add New Pickup</h2>
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
            <label htmlFor="image" className="form-label">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              className="form-input-file"
            />
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
            <label htmlFor="pickupDate" className="form-label">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={pickupDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.pickupDate && <p className="error-message">{errors.pickupDate}</p>}
          </div>
          <button type="submit" className="submit-button">Add Pickup</button>
        </form>
      </div>
    </div>
  );
};

export default AddPickupForm;