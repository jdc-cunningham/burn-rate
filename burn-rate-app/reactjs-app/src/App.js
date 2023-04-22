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
  const [apiErr, setApiErr] = useState(false);

  const apiBasePath = 'http://192.168.1.144:5045';
  const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const callApi = async (route) => new Promise(resolve => { // sus
    axios.get(`${apiBasePath}/${route}`)
      .then((res) => {
        if (res?.data?.data) {
          resolve(res.data.data);
        } else {
          resolve();
        }
      })
      .catch((e) => {
        resolve();
      });
  });

  const getAppData = async () => {
    const netWorth = await callApi('get-latest-net-worth') || {};
    const bills = await callApi('get-bills') || [];
    const cards = await callApi('get-cards') || [];

    if (!Object.keys(netWorth).length) {
      setApiErr(true);
    };

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

  const checkLeadingZero = (str) => {
    if (str.length === 1) {
      return `0${str}`;
    } else {
      return str;
    }
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
        <h4>{`${hour}:${checkLeadingZero(min)} ${period}`}</h4>
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
          <StatusDisplay appData={appData} apiErr={apiErr} />
        </div>
        <div className="App__right">
          <UpcomingBills appData={appData} monthMap={monthMap} />
        </div>
      </div>
    </div>
  );
}

export default App;
