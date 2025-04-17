import { useEffect } from "react";
import { useState } from "react";

const ViewPickups = () => {
    const [error, setError] = useState(null);
    const [pickups, setPickups] = useState([]);
   
   
   
   
   
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
       <div>
        {pickups.map((pickup) => (
            <div key={pickup.id}>
                <h2>Pick Up Date: {new Date(pickup.pickupDate).toLocaleDateString()}</h2>
                <h2>Name: {pickup.name}</h2>
                <h2>Items: {pickup.items}</h2>
                {pickup.image && <img src={pickup.image} alt={pickup.items} />}

                </div>
        ))}

       </div>

        </>
     );
}
 
export default ViewPickups;