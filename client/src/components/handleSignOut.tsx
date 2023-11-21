export const handleSignOut = (navigate) => {
  localStorage.removeItem('token');
  alert('Signed out!');
  navigate('/');
};
