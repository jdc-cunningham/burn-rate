import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import StatusDisplay from './components/status-display/status-display';
import UpcomingBills from './components/upcoming-bills/upcoming-bills';
import startClock from './web-worker/worker';

const App = () => {
  const [appData, setAppData] = useState({
    netWorth: {},
    bills: [],
    cards: []
  });

  const [appTime, setAppTime] = useState(0); // 0-60 minutes
  const [appHour, setAppHour] = useState(0);

  const apiBasePath = 'http://localhost:5045';
  const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const callApi = async (route) => new Promise((resolve, reject) => { // sus
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

  const getAppData = async () => {
    const netWorth = await callApi('get-latest-net-worth');
    const bills = await callApi('get-bills');
    const cards = await callApi('get-cards');

    setAppData({
      netWorth,
      bills,
      cards
    });
  }

  const getCurrentHour = () => {
    const d = new Date();
    
    let hour = d.getHours(); // 24hr based

    if (hour > 12) {
      hour = hour - 12;
    }

    if (hour === 0) {
      hour = 12; // no AM/PM
    }

    return hour;
  }

  const dateBlock = () => {
    const dateObj = new Date();
    const date = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const hour = getCurrentHour();
    const hours = dateObj.getHours();
    const min = dateObj.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    return (
      <div className="App__top-date-time">
        <h3>{`${month}/${date}/${year}`}</h3>
        <h4>{`${hour}:${min} ${period}`}</h4>
      </div>
    );
  }

  useEffect(() => {
    if (appHour) {
      getAppData();
    }
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
      <div className="App__top">
        <h1>Burn Rate</h1>
        {dateBlock()}
      </div>
      <div className="App__body">
        <div className="App__left">
          <StatusDisplay appData={appData} />
        </div>
        <div className="App__right">
          <UpcomingBills appData={appData} monthMap={monthMap} />
        </div>
      </div>
    </div>
  );
}

export default App;