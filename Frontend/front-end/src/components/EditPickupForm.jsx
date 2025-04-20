import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dateAndTime from 'date-and-time';

const EditPickupForm = () => {
    const [singlePickup, setSinglePickup] = useState([]);
    const {id} = useParams()
    const [name, setName] = useState("")
const [phoneNumber, setPhoneNumber] = useState("")
const [items, setItems] = useState("")
const [image, setImage] = useState("")
const [notes, setNotes] = useState("")
const [pickupDate, setPickupDate] = useState("")
const navigate = useNavigate();

    useEffect(() => {
        async function fetchSinglePickup() {

            try {
                const response = await fetch (`http://localhost:3000/api/pickups/${id}`)
                const result = await response.json()
                setSinglePickup(result)
                setName(result.name)
                setPhoneNumber(result.phoneNumber)
                setItems(result.items)
                setImage(result.image)
                setNotes(result.notes)
                
                if (result.pickupDate) {
                    // Extract the date part (YYYY-MM-DD) from the UTC string
                    const utcDatePart = result.pickupDate.substring(0, 10);
                    setPickupDate(utcDatePart);
                  }
            } catch (error) {
                setError(error)
            }
        } fetchSinglePickup()
    }, []);

      
         async function handleSubmit(e) {
            e.preventDefault();
        
            try {
                const result = await fetch(`http://localhost:3000/api/pickups/${id}`,{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"},
                    body: JSON.stringify({ name, phoneNumber, items, image, notes, pickupDate })
                       
                })
                
            } catch (error) {
                console.error(error.message)
            }
            
          
            
        }
        
   
    return ( 

        <>
        <form method='post' onSubmit={handleSubmit}>
 <label>
 Name:{" "}
 <input
 value={name}
 onChange={(e) => {
 setName(e.target.value);
 }}
 />
 </label>
 <br />
 <br />
 <label>
 Phone:{" "}
 <input
 value={phoneNumber}
 onChange={(e) => {
 setPhoneNumber(e.target.value);
 }}
 />
 </label>
 <br /><br />
 <label>
 Items:{" "}
 <input
 value={items}
 onChange={(e) => {
 setItems(e.target.value);
 }}
 />
 </label>
 <br />
 <br />
 <label>
 Image:{" "}
 <input
 value={image}
 onChange={(e) => {
 setImage(e.target.value);
 }}
 />
 </label>
 <br /><br />
 <label>
 Notes:{" "}
 <input
 value={notes}
 onChange={(e) => {
 setNotes(e.target.value);
 }}
 />
 </label>
 <br /><br />
 <label>
 Pickup Date:{" "}
 <input
 type="date"
 value={pickupDate}
 onChange={(e) => {
 setPickupDate(e.target.value);
 }}
 />
 </label>
 <br />
 <button onClick={() => navigate(`/viewpickups/${id}`)}  type="submit">Submit</button>
 </form>
        
        </>
     );
}
 
export default EditPickupForm;