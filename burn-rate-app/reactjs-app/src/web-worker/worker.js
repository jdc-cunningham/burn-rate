// web worker based on https://github.com/jdc-cunningham/django-devkin-blog/blob/master/devkin/ver.0.0.1/developing/index.html
const startClock = (setAppTime) => {
  if (window.Worker) {
                
    var workerClock = new Worker(`${process.env.PUBLIC_URL}/worker-clock.js`);

    workerClock.onmessage = (event) => {
      setAppTime(event.data);
    }
  }
}

export default startClock;
