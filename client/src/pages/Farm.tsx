import { useSocket } from "contexts/socket";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import { Farm } from "types/farm";

const FarmPage = () => {
  const [farmData, setFarmData] = useState<Farm>({} as Farm);
  const [lightHistory, setLightHistory] = useState<number[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [soilMoistureHistory, setSoilMoistureHistory] = useState<number[]>([]);
  const [co2History, setCo2History] = useState<number[]>([]);
  const [waterLevelHistory, setWaterLevelHistory] = useState<number[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const { state: farmKey } = useLocation();
  const MAX_HISTORY_SIZE = 40;

  useEffect(() => {
    if (!socket) return;

    // 특정 농장에 대한 구독 요청
    socket.emit("subscribeFarm", farmKey);

    socket.on(`farmData:${farmKey}`, (data: Farm) => {
      console.log(`Received farmData for ${farmKey}:`, data); // farmData가 수신되는지 확인
      setFarmData(data);
      setLightHistory((prev) => {
        const updated = [...prev, data.light];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
      setHumidityHistory((prev) => {
        const updated = [...prev, data.humidity];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
      setTemperatureHistory((prev) => {
        const updated = [...prev, data.temperature];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
      setSoilMoistureHistory((prev) => {
        const updated = [...prev, data.soilMoisture];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
      setCo2History((prev) => {
        const updated = [...prev, data.co2];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
      setWaterLevelHistory((prev) => {
        const updated = [...prev, data.waterLevel];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
    });

    return () => {
      socket.off(`farmData:${farmKey}`);
      socket.emit("unsubscribeFarm", farmKey);
    };
  }, [socket, farmKey]);

  const getChartData = (farm: Farm) => {
    const { light, humidity, temperature, soilMoisture, co2, waterLevel } =
      farm;
    return {
      labels: ["조도", "습도", "온도", "토양수분", "이산화탄소", "수위"],
      datasets: [
        {
          label: `${farmKey}`,
          data: [light, humidity, temperature, soilMoisture, co2, waterLevel],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 205, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getChartFactorData = (label: string, data: number[]) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  return (
    <div>
      <Line data={getChartData(farmData)} />
      <div>
        <Line data={getChartFactorData("조도", lightHistory)} />
        <Line data={getChartFactorData("습도", humidityHistory)} />
        <Line data={getChartFactorData("온도", temperatureHistory)} />
        <Line data={getChartFactorData("토양수분", soilMoistureHistory)} />
        <Line data={getChartFactorData("이산화탄소", co2History)} />
        <Line data={getChartFactorData("수위", waterLevelHistory)} />
      </div>
      <button onClick={() => navigate(-1)}>농장 목록으로 이동</button>
    </div>
  );
};

export default FarmPage;
