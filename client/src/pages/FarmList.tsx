import { useSocket } from "@context/socket";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js의 스케일과 플러그인을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Farm = {
  light: number;
  humidity: number;
  temperature: number;
  soilMoisture: number;
  co2: number;
  waterLevel: number;
};

type FarmData = {
  [key: string]: Farm;
};

const FarmListPage = () => {
  const [farmData, setFarmData] = useState<FarmData>({});
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.emit("enterFarm");
    socket.on("farmData", (data: FarmData) => {
      console.log(data);
      setFarmData(data);
    });
    return () => {
      socket.off("farmData");
    };
    // 로컬 데이터로 테스트
    // const farmData: FarmData = {
    //   farm1: {
    //     light: 96,
    //     humidity: 36,
    //   },
    //   farm2: {
    //     light: 27,
    //     humidity: 51,
    //   },
    //   farm3: {
    //     light: 92,
    //     humidity: 8,
    //   },
    // };
    // setFarmData(farmData);
  }, [socket]);

  const getChartData = (farm: Farm) => {
    const { light, humidity, temperature, soilMoisture, co2, waterLevel } =
      farm;
    return {
      labels: ["조도", "습도", "온도", "토양수분", "이산화탄소", "수위"],
      datasets: [
        {
          label: "Farm Data",
          data: [light, humidity, temperature, soilMoisture, co2, waterLevel],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      {Object.keys(farmData).map((farmKey) => (
        <div key={farmKey}>
          <h3>{farmKey}</h3>
          <Line data={getChartData(farmData[farmKey])} />
        </div>
      ))}
    </div>
  );
};

export default FarmListPage;
