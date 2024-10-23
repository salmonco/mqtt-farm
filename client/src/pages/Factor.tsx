import { useSocket } from "contexts/socket";
import { FARM_FACTORS } from "libs/constant/farm";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

const FactorPage = () => {
  const [history, setHistory] = useState<number[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const { farmKey, factorKey } = useParams<{
    farmKey: string;
    factorKey: string;
  }>();
  const MAX_HISTORY_SIZE = 40;
  console.log(farmKey, factorKey);

  useEffect(() => {
    if (!socket) return;

    // 특정 농장의 특정 팩터에 대한 구독 요청
    socket.emit("subscribeFactor", farmKey, factorKey);

    socket.on(`farmData:${farmKey}:${factorKey}`, (data: number) => {
      console.log(`Received farmData for ${factorKey} in ${farmKey}:`, data); // farmData가 수신되는지 확인
      setHistory((prev) => {
        const updated = [...prev, data];
        return updated.length > MAX_HISTORY_SIZE
          ? updated.slice(-MAX_HISTORY_SIZE)
          : updated;
      });
    });

    return () => {
      socket.off(`farmData:${farmKey}:${factorKey}`);
      socket.emit("unsubscribeFactor", farmKey, factorKey);
    };
  }, [socket, farmKey, factorKey]);

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

  const getLabelByKey = (key: string) => {
    const factor = FARM_FACTORS.find((factor) => factor.key === key);
    return factor ? factor.label : "";
  };

  if (!factorKey) return null;
  return (
    <div>
      <Line data={getChartFactorData(getLabelByKey(factorKey), history)} />
      <button onClick={() => navigate(-1)}>농장으로 이동</button>
    </div>
  );
};

export default FactorPage;
