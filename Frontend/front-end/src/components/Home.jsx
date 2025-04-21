import { useNavigate } from 'react-router-dom';
import Logout from './Logout';

const Home = () => {
    const navigate = useNavigate();

    return ( 

        <>
       <Logout></Logout>
        <button onClick={() => navigate("/viewpickups")} className="home-button">View Pick Ups</button>
        <button className="home-button">View Deliveries</button>
        <button  onClick={() => navigate("/addpickupform")}className="home-button">Create New Pick Up</button>      
        <button className="home-button">Create New Deilvery</button>
        
        </>
     );
}
 
export default Home;