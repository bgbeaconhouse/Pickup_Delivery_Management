import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AddPickupForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState("");
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [errors, setErrors] = useState({}); // State to hold validation errors
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
      return; // Stop submission if there are errors
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("items", items);
    formData.append("image", image);
    formData.append("notes", notes);
    formData.append("pickupDate", pickupDate);

    try {
      const result = await fetch("http://localhost:3000/api/pickups", {
        method: "POST",
        body: formData,
      });

      if (result.ok) {
        console.log("Pickup added successfully!");
        navigate("/viewpickups/");
      } else {
        const errorData = await result.json();
        console.error("Error adding pickup:", errorData);
        // Optionally set a general error message in state
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      // Optionally set a network error message in state
    }

    // Clear the form fields only on successful submission
    if (Object.keys(errors).length === 0) {
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
    // Clear the specific error when the user starts typing in that field
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