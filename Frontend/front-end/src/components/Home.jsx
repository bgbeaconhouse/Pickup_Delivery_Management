import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import './Home.css'; // Import the CSS file

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Logout />
      <div className="button-container">
        <button onClick={() => navigate("/viewpickups")} className="home-button view-pickups">
          View Pick Ups
        </button>
        <button onClick={() => navigate("/viewdeliveries")} className="home-button view-deliveries">View Deliveries</button>
        <button onClick={() => navigate("/addpickupform")} className="home-button create-pickup">
          Create New Pick Up
        </button>
        <button onClick={() => navigate("/adddeliveryform")} className="home-button create-delivery">Create New Delivery</button>
      </div>
    </div>
  );
};

export default Home;