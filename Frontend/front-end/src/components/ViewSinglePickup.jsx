import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import dateAndTime from 'date-and-time';

const ViewSinglePickup = () => {
  const [singlePickup, setSinglePickup] = useState(null); // Initialize as null for loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
  }, [id, navigate]); // Include id and navigate in the dependency array

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pickup?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/pickups/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized to delete pickup');
            setError('Unauthorized to delete this pickup.');
            return; // Don't navigate, just show the error
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
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!singlePickup) {
    return <div>Loading pickup details...</div>;
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
    <>
      <div><button onClick={() => navigate("/viewpickups")}>Back</button></div>
      <div className="view-pickups-container">
        <div className="view-pickup-card" key={singlePickup.id}>
          <h3>Pick Up Date: {formatDate(singlePickup.pickupDate)}</h3>
          <h3>Name: {singlePickup.name}</h3>
          <h3>Phone: {singlePickup.phoneNumber}</h3>
          <h3>Items: {singlePickup.items}</h3>
          <h3>Notes: {singlePickup.notes}</h3>
          {singlePickup.image && <img
            src={`http://localhost:3000/uploads/${singlePickup.image}`}
            alt={singlePickup.items}
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />}
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => navigate(`/editpickupform/${id}`)}>Edit</button>
        </div>
      </div>
    </>
  );
};

export default ViewSinglePickup;