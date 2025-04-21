import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dateAndTime from 'date-and-time';

const EditPickupForm = () => {
  const [singlePickup, setSinglePickup] = useState(null); // Initialize as null
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState("");
  const [image, setImage] = useState(null); // Changed to null for file object
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSinglePickup() {
      try {
        const response = await fetch(`http://localhost:3000/api/pickups/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSinglePickup(result);
        setName(result.name);
        setPhoneNumber(result.phoneNumber);
        setItems(result.items);
        // When editing, we might want to display the existing image filename or a preview
        // For simplicity in this basic example, we'll just keep the filename in state initially
        setImage(result.image);
        setNotes(result.notes);
        if (result.pickupDate) {
          const utcDatePart = result.pickupDate.substring(0, 10);
          setPickupDate(utcDatePart);
        }
      } catch (error) {
        console.error("Error fetching pickup:", error);
      }
    }
    fetchSinglePickup();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("items", items);
    formData.append("notes", notes);
    formData.append("pickupDate", pickupDate);

    // Append the new image file if one has been selected
    if (image instanceof File) {
      formData.append("image", image);
    } else {
      // If no new file is selected, we can optionally send the existing filename
      // or handle this on the backend to keep the existing image.
      formData.append("image", image); // Sending the existing filename
    }

    try {
      const response = await fetch(`http://localhost:3000/api/pickups/${id}`, {
        method: "PUT",
        body: formData, // Send FormData
      });

      if (response.ok) {
        console.log("Pickup updated successfully!");
        navigate(`/viewpickups/${id}`);
      } else {
        const errorData = await response.json();
        console.error("Error updating pickup:", errorData);
        // Handle error response
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle network error
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (!singlePickup) {
    return <div>Loading pickup details...</div>;
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit} encType="multipart/form-data"> {/* Added enctype */}
        <label>
          Name:{" "}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Phone:{" "}
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <br /><br />
        <label>
          Items:{" "}
          <input
            value={items}
            onChange={(e) => setItems(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Image:{" "}
          <input
            type="file" // Changed to file input
            name="image"
            onChange={handleImageChange}
          />
          {singlePickup.image && typeof singlePickup.image === 'string' && (
            <p>Current Image: {singlePickup.image}</p>
            // You might want to display a preview of the current image here
            // <img src={`http://localhost:3000/uploads/${singlePickup.image}`} alt="Current Pickup Image" style={{ maxWidth: '100px' }} />
          )}
        </label>
        <br /><br />
        <label>
          Notes:{" "}
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <br /><br />
        <label>
          Pickup Date:{" "}
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        <button onClick={() => navigate(`/viewpickups/${id}`)}>Cancel</button>
      </form>
    </>
  );
};

export default EditPickupForm;