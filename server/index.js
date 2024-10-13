const express = require("express");

const server = () => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // app.use(
  //   express.urlencoded({
  //     extended: true,
  //   })
  // );
  // app.use(express.json());

  // app.use("/", require("./routes"));

  io.on("connection", (socket) => {
    require("./routes/farm")(io, socket);
  });

  server.listen(PORT, () => {
    console.log("listening on %d", PORT);
  });

  app.get("/", () => {
    res.send("hello world");
  });
};

server();
