import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove the token from local storage (or wherever you stored it)
    localStorage.removeItem('token');

    // 2. Optionally, you might want to clear other user-related data from local storage or state
    // localStorage.removeItem('userId');
    // setUser(null); // If you're using a state management library like useState or Redux

    // 3. Redirect the user to the login page or another appropriate route
    navigate('/');

    // 4. Optionally, you can display a logout success message to the user
    console.log('User logged out successfully');
  };

  return (
    <button onClick={handleLogout}>Log Out</button>
  );
};

export default Logout;