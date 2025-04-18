import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return ( 

        <>
        
        <button onClick={() => navigate("/viewpickups")} className="home-button">View Pick Ups</button>
        <button className="home-button">View Deliveries</button>
        <button className="home-button">Create New Pick Up</button>      
        <button className="home-button">Create New Deilvery</button>
        
        </>
     );
}
 
export default Home;