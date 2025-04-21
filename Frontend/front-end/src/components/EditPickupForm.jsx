import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dateAndTime from 'date-and-time';

const EditPickupForm = () => {
  const [singlePickup, setSinglePickup] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState("");
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSinglePickup() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/pickups/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error("Unauthorized to view edit form");
            setError("Unauthorized access. Please log in.");
            navigate("/");
            return;
          } else {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorMessage}`);
          }
        }
        const result = await response.json();
        setSinglePickup(result);
        setName(result.name);
        setPhoneNumber(result.phoneNumber);
        setItems(result.items);
        setImage(result.image);
        setNotes(result.notes);
        if (result.pickupDate) {
          const utcDatePart = result.pickupDate.substring(0, 10);
          setPickupDate(utcDatePart);
        }
      } catch (error) {
        console.error("Error fetching pickup:", error);
        setError("Failed to fetch pickup details.");
      }
    }
    fetchSinglePickup();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("items", items);
    formData.append("notes", notes);
    formData.append("pickupDate", pickupDate);

    if (image instanceof File) {
      formData.append("image", image);
    } else if (typeof image === 'string') {
      formData.append("image", image); // Send existing filename if no new file
    }

    try {
      const response = await fetch(`http://localhost:3000/api/pickups/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Pickup updated successfully!");
        navigate(`/viewpickups/${id}`);
      } else if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized to update pickup");
        setError("Unauthorized to update this pickup.");
      } else {
        const errorData = await response.json();
        console.error("Error updating pickup:", errorData);
        setError("Failed to update pickup.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to update pickup. Please check your network connection.");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!singlePickup) {
    return <div>Loading pickup details...</div>;
  }

  return (
    <>
      <form method='post' onSubmit={handleSubmit} encType="multipart/form-data">
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
            type="file"
            name="image"
            onChange={handleImageChange}
          />
          {singlePickup.image && typeof singlePickup.image === 'string' && (
            <p>Current Image: {singlePickup.image}</p>
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