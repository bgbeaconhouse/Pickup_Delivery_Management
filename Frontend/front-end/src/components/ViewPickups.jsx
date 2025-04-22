import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import dateAndTime from 'date-and-time';
import './ViewPickups.css'; // Import the CSS file

const ViewPickups = () => {
  const [error, setError] = useState(null);
  const [pickups, setPickups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPickups() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/api/pickups", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized access to pickups');
            setError('Unauthorized access. Please log in.');
            navigate('/');
            return;
          } else {
            const errorMessage = await response.text();
            console.error('Error fetching pickups:', errorMessage);
            setError(`Failed to fetch pickups: ${errorMessage}`);
            return;
          }
        }

        const result = await response.json();
        console.log("Raw pickup data:", result);

        const sortedPickups = result.sort((a, b) => {
          const dateA = new Date(a.pickupDate);
          const dateB = new Date(b.pickupDate);
          return dateA - dateB; // Ascending order
        });
        setPickups(sortedPickups);
      } catch (error) {
        setError(error);
      }
    }
    fetchPickups();
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
      <h2 className="view-pickups-title">Upcoming Pick Ups</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="view-pickups-container">
        {pickups.map((pickup) => (
          <div className="view-pickup-card" key={pickup.id}>
            <h3 className="pickup-date">Pick Up: {formatDate(pickup.pickupDate)}</h3>
            <h4 className="pickup-name">{pickup.name}</h4>
            {pickup.images && pickup.images.length > 0 && (
              <div className="pickup-image-container">
                <img
                  src={`http://localhost:3000/uploads/${pickup.images[0]}`}
                  alt={pickup.items}
                  className="pickup-image"
                />
              </div>
            )}
            <p className="pickup-items">Items: {pickup.items}</p>
            <button onClick={() => navigate(`/viewpickups/${pickup.id}`)} className="see-more-button">
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPickups;