import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/Usercontext';
import LogoutModal from "../components/Logoutmodal"

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const handleConfirm = () => {
    logout();
    setShowModal(false);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };
  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };
  return (
    <>
      {showModal && (
        <LogoutModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {!showModal && <p>Logging you out...</p>}
    </>
  );
};
export default Logout;