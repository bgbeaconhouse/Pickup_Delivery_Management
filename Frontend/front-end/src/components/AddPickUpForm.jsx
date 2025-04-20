import { useState } from "react";
import { useNavigate } from 'react-router-dom';
const AddPickupForm = () => {
const [name, setName] = useState("")
const [phoneNumber, setPhoneNumber] = useState("")
const [items, setItems] = useState("")
const [image, setImage] = useState("")
const [notes, setNotes] = useState("")
const [pickupDate, setPickupDate] = useState("")
const navigate = useNavigate();

// console.log(items)

async function handleSubmit(e) {
    e.preventDefault();

    try {
        const result = await fetch("http://localhost:3000/api/pickups",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify({ name, phoneNumber, items, image, notes, pickupDate })

        })

        
    } catch (error) {
        console.error(error.message)
    }
    setName("")
    setPhoneNumber("")
    setItems("")
    setImage("")
    setNotes("")
    setPickupDate("")
    
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
 <button onClick={() => navigate("/viewpickups/")} type="submit">Submit</button>
 </form>
        </>
     );
}
 
export default AddPickupForm;