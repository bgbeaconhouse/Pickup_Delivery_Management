import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import dateAndTime from 'date-and-time';


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
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
              },
            });
    
            if (!response.ok) {
              // Handle unauthorized or other error responses
              if (response.status === 401 || response.status === 403) {
                console.error('Unauthorized access to pickups');
                setError('Unauthorized access. Please log in.');
                navigate('/'); // Redirect to the login page
                return;
              } else {
                const errorMessage = await response.text();
                console.error('Error fetching pickups:', errorMessage);
                setError(`Failed to fetch pickups: ${errorMessage}`);
                return;
              }
            }

        


            const result = await response.json();
            console.log("Raw pickup data:", result)
            console.log(result)


            const sortedPickups = result.sort((a, b) => {
              const dateA = new Date(a.pickupDate);
              const dateB = new Date(b.pickupDate);
              return dateA - dateB; // Ascending order
          });
      setPickups(sortedPickups);
          } catch (error) {
            setError(error)
          }
        }
        fetchPickups();
      }, []);
   
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
        <div><button onClick={() => navigate("/home")}>Back</button></div>
       <div className="view-pickups-container">
        {pickups.map((pickup) => (
            <div className="view-pickup-card" key={pickup.id}>
                
                <h3>Pick Up: {formatDate(pickup.pickupDate)}</h3>
                <h3> {pickup.name}</h3>
               
                {pickup.image && <img
                src={`http://localhost:3000/uploads/${pickup.image}`} // Construct the image URL
                alt={pickup.items}
                style={{ maxWidth: '200px', maxHeight: '200px' }} // Basic styling
              />}
            
              <h3>Items: {pickup.items}</h3>
                <button onClick={() => navigate(`/viewpickups/${pickup.id}`)}>See More</button>

                </div>
        ))}

       </div>

        </>
     );
}
 
export default ViewPickups;