import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import dateAndTime from 'date-and-time';
// import './ViewSinglePickup.css'; 
// Import the CSS file

const ViewSingleDelivery = () => {
  const [singleDelivery, setSingleDelivery] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchSingleDelivery() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://pickup-delivery-gspc.onrender.com/api/deliveries/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized access to delivery details');
            setError('Unauthorized access. Please log in.');
            navigate('/');
            return;
          } else {
            const errorMessage = await response.text();
            console.error('Error fetching delivery:', errorMessage);
            setError(`Failed to fetch delivery details: ${errorMessage}`);
            return;
          }
        }

        const result = await response.json();
        setSingleDelivery(result);
      } catch (error) {
        console.error('Error fetching delivery:', error);
        setError('Failed to fetch delivery details. Please check your network connection.');
      }
    }
    fetchSingleDelivery();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://pickup-delivery-gspc.onrender.com/api/deliveries/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized to delete delivery');
            setError('Unauthorized to delete this delivery.');
            return;
          } else {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! status: ${response.status}: ${errorMessage}`);
          }
        }
        navigate("/viewdeliveries");
      } catch (error) {
        console.error("Failed to delete delivery:", error);
        setError(`Failed to delete delivery: ${error.message}`);
        alert("Failed to delete delivery.");
      }
    }
  };

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!singleDelivery) {
    return <div className="loading-container">Loading delivery details...</div>;
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
        <button onClick={() => navigate("/viewdeliveries")} className="back-button">
          Back to Deliveries
        </button>
      </div>
      <div className="single-pickup-container">
        <h2 className="pickup-title">Delivery Details</h2>
        <div className="pickup-details">
          <div className="detail-item">
            <span className="detail-label">Delivery Date:</span>
            <span className="detail-value">{formatDate(singleDelivery.deliveryDate)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{singleDelivery.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{singleDelivery.phoneNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{singleDelivery.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Items:</span>
            <span className="detail-value">{singleDelivery.items}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Notes:</span>
            <span className="detail-value">{singleDelivery.notes}</span>
          </div>
          {singleDelivery.images && singleDelivery.images.length > 0 && (
            <div className="detail-item image-item">
              <span className="detail-label">Images:</span>
              <div className="images-container">
                {singleDelivery.images.map((imageName, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={`https://pickup-delivery-gspc.onrender.com/uploads/${imageName}`}
                      alt={`${singleDelivery.items}-${index}`}
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
          <button onClick={() => navigate(`/editdeliveryform/${id}`)} className="edit-button">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleDelivery;