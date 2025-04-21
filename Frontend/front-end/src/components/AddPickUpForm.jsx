import { useState } from "react";
import { useNavigate } from 'react-router-dom';

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
    <>
      <form method='post' onSubmit={handleSubmit} encType="multipart/form-data">
        {errors.general && <p className="error-message">{errors.general}</p>} {/* Display general error */}
        <label>
          Name:{" "}
          <input
            name="name"
            value={name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </label>
        <br />
        <br />
        <label>
          Phone:{" "}
          <input
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
        </label>
        <br /><br />
        <label>
          Items:{" "}
          <input
            name="items"
            value={items}
            onChange={handleInputChange}
          />
          {errors.items && <p className="error-message">{errors.items}</p>}
        </label>
        <br />
        <br />
        <label>
          Image:{" "}
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
          />
        </label>
        <br /><br />
        <label>
          Notes:{" "}
          <input
            name="notes"
            value={notes}
            onChange={handleInputChange}
          />
        </label>
        <br /><br />
        <label>
          Pickup Date:{" "}
          <input
            type="date"
            name="pickupDate"
            value={pickupDate}
            onChange={handleInputChange}
          />
          {errors.pickupDate && <p className="error-message">{errors.pickupDate}</p>}
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddPickupForm;