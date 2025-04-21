import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewPickups from './components/ViewPickups';
import Home from './components/Home';
import ViewSinglePickup from './components/ViewSinglePickup';
import AddPickupForm from './components/AddPickUpForm';
import EditPickupForm from './components/EditPickupForm';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // Make sure this import exists

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
          <Route path="/viewpickups/:id" element={<ViewSinglePickup />} />
          <Route path="/addpickupform" element={<AddPickupForm />} />
          <Route path="/editpickupform/:id" element={<EditPickupForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;