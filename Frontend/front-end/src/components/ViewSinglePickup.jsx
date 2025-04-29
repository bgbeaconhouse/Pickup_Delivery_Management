import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import dateAndTime from 'date-and-time';
import './ViewSinglePickup.css'; // Import the CSS file

const ViewSinglePickup = () => {
  const [singlePickup, setSinglePickup] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
            console.error('Unauthorized access to pickup details');
            setError('Unauthorized access. Please log in.');
            navigate('/');
            return;
          } else {
            const errorMessage = await response.text();
            console.error('Error fetching pickup:', errorMessage);
            setError(`Failed to fetch pickup details: ${errorMessage}`);
            return;
          }
        }

        const result = await response.json();
        setSinglePickup(result);
      } catch (error) {
        console.error('Error fetching pickup:', error);
        setError('Failed to fetch pickup details. Please check your network connection.');
      }
    }
    fetchSinglePickup();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pickup?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://pickup-delivery-gspc.onrender.com/api/pickups/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized to delete pickup');
            setError('Unauthorized to delete this pickup.');
            return;
          } else {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorMessage}`);
          }
        }
        navigate("/viewpickups");
      } catch (error) {
        console.error("Failed to delete pickup:", error);
        setError(`Failed to delete pickup: ${error.message}`);
        alert("Failed to delete pickup.");
      }
    }
  };

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!singlePickup) {
    return <div className="loading-container">Loading pickup details...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date not available';
    }
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);
    const localDate = new Date(year, month, day);
    return dateAndTime.format(localDate, 'MM-DD-YY');
  };

  return (
    <div className="view-single-pickup-page">
      <div className="back-button-container">
        <button onClick={() => navigate("/viewpickups")} className="back-button">
          Back to Pick Ups
        </button>
      </div>
      <div className="single-pickup-container">
        <h2 className="pickup-title">Pickup Details</h2>
        <div className="pickup-details">
          <div className="detail-item">
            <span className="detail-label">Pick Up Date:</span>
            <span className="detail-value">{formatDate(singlePickup.pickupDate)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{singlePickup.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{singlePickup.phoneNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Items:</span>
            <span className="detail-value">{singlePickup.items}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Notes:</span>
            <span className="detail-value">{singlePickup.notes}</span>
          </div>
          {singlePickup.images && singlePickup.images.length > 0 && (
            <div className="detail-item image-item">
              <span className="detail-label">Images:</span>
              <div className="images-container">
                {singlePickup.images.map((imageName, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={`https://pickup-delivery-gspc.onrender.com/uploads/${imageName}`}
                      alt={`${singlePickup.items}-${index}`}
                      className="pickup-image"
                      style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
          <button onClick={() => navigate(`/editpickupform/${id}`)} className="edit-button">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSinglePickup;