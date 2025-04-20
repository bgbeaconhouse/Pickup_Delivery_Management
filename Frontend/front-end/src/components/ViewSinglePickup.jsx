import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import dateAndTime from 'date-and-time';

const ViewSinglePickup = () => {
    const [singlePickup, setSinglePickup] = useState([])
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams()
   
   
    useEffect(() => {
        async function fetchSinglePickup() {
            try {
                const response = await fetch (`http://localhost:3000/api/pickups/${id}`)
                const result = await response.json()
                setSinglePickup(result)
            } catch (error) {
                setError(error)
            }
        } fetchSinglePickup()
    }, []);

    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this pickup?")) {
          try {
              const response = await fetch(`http://localhost:3000/api/pickups/${id}`, {
                  method: 'DELETE',
              });
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              navigate("/viewpickups");
          } catch (error) {
              setError(error);
              alert("Failed to delete pickup.");
          }
      }
  };

  if (error) {
      return <div>Error: {error.message}</div>;
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
        return dateAndTime.format(localDate, 'YYYY-MM-DD');
      };
   


    return (
        <>
        
        <div><button onClick={() => navigate("/viewpickups")}>Back</button></div>
      <div className="view-pickups-container">
        <div className="view-pickup-card" key={singlePickup.id}> {/* Access properties directly */}
          <h3>Pick Up Date: {formatDate(singlePickup.pickupDate)}</h3>
          <h3>Name: {singlePickup.name}</h3>
          <h3>Phone: {singlePickup.phoneNumber}</h3>
          <h3>Items: {singlePickup.items}</h3>
          <h3>Notes: {singlePickup.notes}</h3>
          {singlePickup.image && <img src={singlePickup.image} alt={singlePickup.items} />}
         <button onClick={handleDelete}>Delete</button>
         <button onClick={() => navigate(`/editpickupform/${id}`)}>Edit</button>
        </div>
      </div>

        
        </>
      );
}
 
export default ViewSinglePickup;