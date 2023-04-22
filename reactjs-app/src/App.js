import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import StatusDisplay from './components/status-display/status-display';
import UpcomingBills from './components/upcoming-bills/upcoming-bills';
import startClock from './web-worker/worker';

const App = () => {
  const [appData, setAppData] = useState({});
  const [appTime, setAppTime] = useState(0); // 0-60 minutes
  const [appHour, setAppHour] = useState(0);

  const apiBasePath = 'http://localhost:5045';

  const callApi = (route) => {
    return new Promise((resolve, reject) => { // dumb nested promises
      axios.get(`${apiBasePath}/${route}`)
        .then((res) => {
          if (res?.data?.data) {
            resolve(res.data.data);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  };

  const getAppData = async () => {
    const netWorth = await callApi('get-latest-net-worth');
    const bills = await callApi('get-bills');
    const cards = await callApi('get-cards');

    console.log(netWorth, bills, cards);
  }

  const getCurrentHour = () => {
    const d = new Date();
    
    let hour = d.getHours(); // 24hr based

    if (hour > 12) {
      hour = hour - 12;
    }

    return hour;
  }

  useEffect(() => {
    getAppData();
  }, [appHour]);

  useEffect(() => {
    const hour = getCurrentHour();

    if (hour !== appHour) {
      setAppHour(hour);
    }
  }, [appTime]);

  useEffect(() => {
    setAppHour(getCurrentHour());
    startClock(setAppTime);
  }, []);

  return (
    <div className="App">
      <div className="App__left">
        <StatusDisplay />
      </div>
      <div className="App__right">
        <UpcomingBills />
      </div>
    </div>
  );
}

export default App;
