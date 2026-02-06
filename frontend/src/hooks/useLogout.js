import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return handleLogout;
};