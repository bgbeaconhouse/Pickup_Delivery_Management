import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditPickupForm.css'; // Import the CSS file

const EditPickupForm = () => {
  const [singlePickup, setSinglePickup] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState("");
  const [newImages, setNewImages] = useState([]); // New images to add
  const [existingImages, setExistingImages] = useState([]);
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSinglePickup() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://pickup-delivery-gspc.onrender.com/api/pickups/${id}`, {
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
        setExistingImages(result.images || []);
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
    newImages.forEach((image) => {
      formData.append("newImages", image); // Use a different field name
    });
    formData.append("notes", notes);
    formData.append("pickupDate", pickupDate);
    existingImages.forEach((image) => {
      formData.append("existingImages", image); // Send existing images
    });
  

    try {
      const response = await fetch(`https://pickup-delivery-gspc.onrender.com/api/pickups/${id}`, {
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

  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (imageName) => {
    setExistingImages(existingImages.filter((img) => img !== imageName));
  };

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!singlePickup) {
    return <div className="loading-container">Loading pickup details...</div>;
  }

  return (
    <div className="edit-pickup-form-page">
      <div className="form-container">
        <h2 className="form-title">Edit Pickup</h2>
        <form method='post' onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="items" className="form-label">Items:</label>
            <input
              type="text"
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newImages" className="form-label">Add New Images:</label>
            <input
              type="file"
              id="newImages"
              name="newImages"
              onChange={handleNewImageChange}
              className="form-input-file"
              multiple
            />
            {newImages.length > 0 && (
              <div className="image-preview-container">
                {Array.from(newImages).map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`new-preview-${index}`}
                    className="image-preview"
                    style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Current Images:</label>
            {existingImages.length > 0 ? (
              <div className="existing-images-container">
                {existingImages.map((imageName, index) => (
                  <div key={index} className="existing-image-item">
                    <img
                      src={`https://pickup-delivery-gspc.onrender.com/uploads/${imageName}`}
                      alt={`existing-${index}`}
                      className="existing-image"
                      style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imageName)}
                      className="remove-image-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images currently uploaded.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupDate" className="form-label">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Update</button>
            <button type="button" onClick={() => navigate(`/viewpickups/${id}`)} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPickupForm;