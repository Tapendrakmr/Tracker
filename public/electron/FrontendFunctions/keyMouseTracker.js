const ioHook = require("iohook");

const hook = () => {
  ioHook.on("mousemove", (event) => {
    console.log(event); // { type: 'mousemove', x: 700, y: 400 }
  });

  ioHook.on("keydown", (event) => {
    console.log("key press");
    console.log(event);
  });

  // Register and start hook
  ioHook.start();

  // Alternatively, pass true to start in DEBUG mode.
  ioHook.start(true);
};

module.exports = {
  hook,
};
