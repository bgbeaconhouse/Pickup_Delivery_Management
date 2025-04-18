import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

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
   
    return (
        <>
        
        <div><button onClick={() => navigate("/viewpickups")}>Back</button></div>
      <div className="view-pickups-container">
        <div className="view-pickup-card" key={singlePickup.id}> {/* Access properties directly */}
          <h3>Pick Up Date: {new Date(singlePickup.pickupDate).toLocaleDateString()}</h3>
          <h3>Name: {singlePickup.name}</h3>
          <h3>Phone: {singlePickup.phoneNumber}</h3>
          <h3>Items: {singlePickup.items}</h3>
          <h3>Notes: {singlePickup.notes}</h3>
          {singlePickup.image && <img src={singlePickup.image} alt={singlePickup.items} />}
         
        </div>
      </div>

        
        </>
      );
}
 
export default ViewSinglePickup;