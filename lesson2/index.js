const EventsEmitter = require("events");
const emitter = new EventsEmitter();

let timers = [...process.argv].slice(2).map((item) => {
  let data = item.split("-");
  return {
    value: new Date(`${data[3]}-${data[2]}-${data[1]}T${data[0]}:52:00`),
    active: true,
  };
});

const updateTimers = () => {
  console.clear()
  timers.forEach((item) => {
    if (item.active) {
      let delta = item.value.getTime() - new Date().getTime();
      if (delta > 0) {
        console.log(`For ${item.value.toString()} left: ${parseInt(delta/1000)} seconds`);
      } else {
        console.log(`For ${item.value.toString()} left: 0 seconds. Timer reached.`);
        item.active = false;
      }
    }
  });
};

emitter.on("tick", updateTimers);

let timerId = setInterval(() => emitter.emit("tick"), 1000);
