// 랜덤 데이터 생성 함수
const generateRandomData = () => {
  return Math.floor(Math.random() * 100);
};

// 농장 데이터 전송
const sendFarmData = (socket) => {
  const intervalId = setInterval(() => {
    const farmData = {
      farm1: {
        light: generateRandomData(),
        humidity: generateRandomData(),
        temperature: generateRandomData(),
        soilMoisture: generateRandomData(),
        co2: generateRandomData(),
        waterLevel: generateRandomData(),
      },
      farm2: {
        light: generateRandomData(),
        humidity: generateRandomData(),
        temperature: generateRandomData(),
        soilMoisture: generateRandomData(),
        co2: generateRandomData(),
        waterLevel: generateRandomData(),
      },
      farm3: {
        light: generateRandomData(),
        humidity: generateRandomData(),
        temperature: generateRandomData(),
        soilMoisture: generateRandomData(),
        co2: generateRandomData(),
        waterLevel: generateRandomData(),
      },
    };
    console.log("farmData", farmData);
    socket.emit("farmData", farmData);
  }, 2000);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
  });
};

const eventHandler = (io, socket) => {
  console.log("farm");

  socket.on("enterFarm", () => {
    sendFarmData(socket);
  });
};

module.exports = eventHandler;
