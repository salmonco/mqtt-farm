// 랜덤 데이터 생성 함수
const generateRandomData = () => {
  return Math.floor(Math.random() * 100);
};

// 농장 데이터 생성 함수
const generateFarmData = () => {
  return {
    light: generateRandomData(),
    humidity: generateRandomData(),
    temperature: generateRandomData(),
    soilMoisture: generateRandomData(),
    co2: generateRandomData(),
    waterLevel: generateRandomData(),
  };
};

// 농장 데이터 전송
const sendFarmList = (socket) => {
  const intervalId = setInterval(() => {
    const farmList = {
      farm1: generateFarmData(),
      farm2: generateFarmData(),
      farm3: generateFarmData(),
    };
    console.log("farmList", farmList);
    socket.emit("farmList", farmList);
  }, 2000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
  });
};

const eventHandler = (io, socket) => {
  console.log("farmList");

  socket.on("enterFarmList", () => {
    sendFarmList(socket);
  });
};

module.exports = eventHandler;
