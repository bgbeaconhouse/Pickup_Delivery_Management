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
            const response = await fetch("http://localhost:3000/api/pickups")
            const result = await response.json();
            console.log("Raw pickup data:", result)
            console.log(result)


            const sortedPickups = result.sort((a, b) => b.id - a.id);
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
        return dateAndTime.format(localDate, 'YYYY-MM-DD');
      };
   
    return ( 
        <>
        <div><button onClick={() => navigate("/")}>Back</button></div>
       <div className="view-pickups-container">
        {pickups.map((pickup) => (
            <div className="view-pickup-card" key={pickup.id}>
                <h3>Pick Up Date: {formatDate(pickup.pickupDate)}</h3>
                <h3>Name: {pickup.name}</h3>
                <h3>Items: {pickup.items}</h3>
                {pickup.image && <img src={pickup.image} alt={pickup.items} />}
                <button onClick={() => navigate(`/viewpickups/${pickup.id}`)}>See More</button>

                </div>
        ))}

       </div>

        </>
     );
}
 
export default ViewPickups;