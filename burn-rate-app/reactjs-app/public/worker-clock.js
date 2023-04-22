let i = 0;

const curSec = new Date().getSeconds();
const curMsec = parseInt((60 - curSec).toString()+'000');

const timedCount = () => {
  i = i + 1;

  if (i > 60) {
    i = 0;
  }

  postMessage(i);
  setTimeout(timedCount, 60000);
}

setTimeout(timedCount, curMsec);
