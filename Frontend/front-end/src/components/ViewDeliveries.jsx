import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional: Import CSS for a blur effect

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import dateAndTime from 'date-and-time';
import './ViewPickups.css'; // Import the CSS file

const ViewDeliveries = () => {
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://pickup-delivery-gspc.onrender.com/api/deliveries", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized access to deliveries');
            setError('Unauthorized access. Please log in.');
            navigate('/');
            return;
          } else {
            const errorMessage = await response.text();
            console.error('Error fetching deliveries:', errorMessage);
            setError(`Failed to fetch deliveries: ${errorMessage}`);
            return;
          }
        }

        const result = await response.json();
        console.log("Raw delivery data:", result);

        const sortedDeliveries = result.sort((a, b) => {
          const dateA = new Date(a.deliveryDate);
          const dateB = new Date(b.deliveryDate);
          return dateA - dateB; // Ascending order
        });
        setDeliveries(sortedDeliveries);
      } catch (error) {
        setError(error);
      }
    }
    fetchDeliveries();
  }, [navigate]);

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
    <div className="view-pickups-page">
      <div className="back-button-container">
        <button onClick={() => navigate("/home")} className="back-button">Back</button>
      </div>
      <h2 className="view-pickups-title">Upcoming Deliveries</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="view-pickups-container">
        {deliveries.map((delivery) => (
          <div className="view-pickup-card" key={delivery.id}>
            <h3 className="pickup-date">Delivery: {formatDate(delivery.deliveryDate)}</h3>
            <h4 className="pickup-name">{delivery.name}</h4>
            {delivery.images && delivery.images.length > 0 && (
              <div className="pickup-image-container">
                <LazyLoadImage
                  src={`https://pickup-delivery-gspc.onrender.com/uploads/${delivery.images[0]}`}
                  alt={delivery.items}
                  className="pickup-image"
                  effect="blur"
                />
              </div>
            )}
            <p className="pickup-items">Items: {delivery.items}</p>
            <button onClick={() => navigate(`/viewdeliveries/${delivery.id}`)} className="see-more-button">
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDeliveries;