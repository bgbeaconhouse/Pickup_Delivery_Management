import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewPickups from './components/ViewPickups';
import Home from './components/Home';
import ViewSinglePickup from './components/ViewSinglePickup';
import AddPickupForm from './components/AddPickUpForm';
import EditPickupForm from './components/EditPickupForm';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // Make sure this import exists
import ViewDeliveries from './components/ViewDeliveries';
import ViewSingleDelivery from './components/ViewSingleDelivery';
import AddDeliveryForm from './components/AddDeliveryForm';
import EditDeliveryForm from './components/EditDeliveryForm';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login route is public */}
        {/* Protected routes are nested within PrivateRoute */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/viewpickups" element={<ViewPickups />} />
          <Route path="/viewdeliveries" element={<ViewDeliveries />} />
          <Route path="/viewpickups/:id" element={<ViewSinglePickup />} />
          <Route path="/viewdeliveries/:id" element={<ViewSingleDelivery />} />
          <Route path="/addpickupform" element={<AddPickupForm />} />
          <Route path="/adddeliveryform" element={<AddDeliveryForm />} />
          <Route path="/editpickupform/:id" element={<EditPickupForm />} />
          <Route path="/editdeliveryform/:id" element={<EditDeliveryForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;