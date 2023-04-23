import './upcoming-bills.css';

const UpcomingBills = (props) => {
  const { appData, monthMap } = props;

  const curDay = new Date().getDate();
  const curMonth = monthMap[new Date().getMonth()];

  // double compute, handled in render bill rows
  const billSum = () => {
    let total = 0;

    appData.bills.forEach((bill, index) => {
      const dueDate = bill[3];

      if (index > 0 && dueDate > curDay) {
        const amount = bill[2].replace('$', '');

        total += parseFloat(amount);
      }
    });

    return Math.ceil(total);
  }

  const renderBillRows = () => {
    const bills = []; // weird

    appData.bills.forEach((bill, index) => {
      const dueDate = bill[3];

      if (index > 0 && dueDate > curDay) {
        const name = bill[0];
        const amount = bill[2].replace('$', '');
        const date = bill[3];

        bills.push({name, amount, date});
      }
    });

    return bills.map((bill, index) => (
      <div key={index} className="UpcomingBills__bill">
        <div className="UpcomingBills__name">
          {bill.name}
        </div>
        <div className="UpcomingBills__amount">
          ${bill.amount}
        </div>
        <div className="UpcomingBills__date">
          {curMonth}, {bill.date}
        </div>
      </div>
    ));
  }

  return (
    <div className="UpcomingBills">
      <div className="UpcomingBills__top">
        <h2>Upcoming bills</h2>
        <h3>${billSum()}</h3>
      </div>
      {renderBillRows()}
    </div>
  );
}

export default UpcomingBills;
