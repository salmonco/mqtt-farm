import { useSocket } from "contexts/socket";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import { Farm } from "types/farm";

const FarmPage = () => {
  const [farmData, setFarmData] = useState<Farm>({} as Farm);
  const navigate = useNavigate();
  const socket = useSocket();
  const { state: farmKey } = useLocation();

  useEffect(() => {
    if (!socket) return;

    // 특정 농장에 대한 구독 요청
    socket.emit("subscribeFarm", farmKey);

    socket.on(`farmData:${farmKey}`, (data: Farm) => {
      console.log(`Received farmData for ${farmKey}:`, data); // farmData가 수신되는지 확인
      setFarmData(data);
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
          label: `${farmKey} Data`,
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

  return (
    <div>
      <h3>{farmKey}</h3>
      <Line data={getChartData(farmData)} />
      <button onClick={() => navigate(-1)}>농장 목록으로 이동</button>
    </div>
  );
};

export default FarmPage;
