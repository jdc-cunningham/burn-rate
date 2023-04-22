import { useState, useEffect } from 'react';
import './status-display.css';

const StatusDisplay = (props) => {
  const { appData, apiErr } = props;

  const [displayData, setDisplayData] = useState(0); // months left burn rate

  const calculateCashCredit = (accounts, cards) => {
    const { latestRow } = accounts;
    
    let cash = 0;
    let creditLine = 0;

    const cashColRanges = [1, 8]; // hardcoded info
    const creditLineRanges = [9, 19];

    const creditLineMap = {
      9: 1,
      10: 2,
      11: 3,
      12: 4,
      13: 5,
      14: 6,
      15: 7,
      16: 8,
      17: 9,
      18: 10,
      19: 11
    };

    latestRow.forEach((col, index) => {
      if (index >= 1 && index <= 8) {
        cash += parseFloat(col);
      }

      if (index >= 9 && index <= 19) {
        creditLine += (parseInt(cards[creditLineMap[index]][2]) - parseFloat(col));
      }
    });

    return Math.floor(cash + creditLine);
  }

  const calculateBills = (bills, cards) => {
    let monthlyBills = 0;

    bills.forEach((bill, index) => {
      if (index > 0) { // header
        const amount = parseFloat(bill[2].replace('$', ''));
        const frequency = bills[4];

        if (frequency === 'bi-weekly') {
          monthlyBills += 2 * amount;
        } else if (frequency === 'quarterly') { // assumed divisible, not true
          monthlyBills += (amount / 3);
        } else {
          monthlyBills += amount;
        }
      }
    });

    cards.forEach((card, index) => {
      if (index > 0) {
        const minDue = parseFloat(card[3]);

        monthlyBills += minDue;
      }
    });
    
    return Math.floor(monthlyBills);
  }

  const getDisplayData = () => {
    const cash = calculateCashCredit(appData.netWorth, appData.cards);
    const monthlyBills = calculateBills(appData.bills, appData.cards);

    const monthsLeft = Math.ceil((cash/monthlyBills).toFixed(2) * 30); // ceil since 30 loses a few days
    setDisplayData(monthsLeft);
  }

  useEffect(() => {
    if (appData.bills.length) {
      getDisplayData();
    }
  }, [appData]);

  return (
    <div className="StatusDisplay">
      <div className="StatusDisplay__text-group">
        <h2>{apiErr ? 'API error' : displayData}</h2>
        <span>{apiErr ? '' : 'days'}</span>
      </div>
    </div>
  );
}

export default StatusDisplay;
