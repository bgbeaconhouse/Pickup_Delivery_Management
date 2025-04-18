import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const ViewPickups = () => {
    const [error, setError] = useState(null);
    const [pickups, setPickups] = useState([]);
    const navigate = useNavigate();
   
   
   
   
    useEffect(() => {
        async function fetchPickups() {
          try {
            const response = await fetch("http://localhost:3000/api/pickups")
            const result = await response.json();
            console.log(result)
            setPickups(result)
          } catch (error) {
            setError(error)
          }
        }
        fetchPickups();
      }, []);
   
   
   
    return ( 
        <>
        <div><button onClick={() => navigate("/")}>Back</button></div>
       <div className="view-pickups-container">
        {pickups.map((pickup) => (
            <div className="view-pickup-card" key={pickup.id}>
                <h3>Pick Up Date: {new Date(pickup.pickupDate).toLocaleDateString()}</h3>
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