import { useEffect } from 'react';
import './App.css';
import { HomePage } from './pages/HomePage';

export default function App() {
  // const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/hello');
      const data = await resp.json();

      console.log('Data from server:', data);

      // setServerData(data.message);
    }

    readServerData();
  }, []);

  return (
    <>
      {/* <h1>{serverData}</h1> */}
      <HomePage />
    </>
  );
}
