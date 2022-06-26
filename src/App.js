import { useEffect, useMemo, useState } from "react";
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
import { Line } from "react-chartjs-2";
import "./styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Gold Prices",
    },
  },
};

//year-month-date
const API = (d1, d2) =>
  `http://api.nbp.pl/api/cenyzlota/${d1}/${d2}/?format=json`;

const USD_TO_CENA_API =
  "https://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json";

const toYYYYMMDD = (str) => {
  return str.split("/").reverse().join("-");
};

const calculateReturns = (investment, percentInterest) => {
  const op = {
    percentInterest,
  };
  if (percentInterest > 0) {
    const interest = Math.abs(investment * percentInterest).toFixed(1);
    const total = investment + interest;
    op.statement = `Profit of ${interest} dollars making total amount: ${total} dollars`;
    op.status = 1;
  } else if (percentInterest < 0) {
    const interest = Math.abs(investment * percentInterest).toFixed(1);
    const total = investment - interest;
    op.statement = `Loss of ${interest} dollars making total amount: ${total} dollars`;
    op.status = -1;
  } else {
    op.status = 0;
    op.interest = 0;
    op.total = investment;
  }
  return op;
};

const calculateInterest = (p1, p2) => ((p2 - p1) / p2) * 100;

export default function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [data, setData] = useState([]);
  const [usdValue, setUsdValue] = useState(0);
  const [investment, setInvestment] = useState("");
  const [returns, setReturns] = useState({});

  useEffect(() => {
    if (input1 && input2) {
      const handleInputsChange = async () => {
        try {
          const res = await fetch(API(toYYYYMMDD(input1), toYYYYMMDD(input2)));
          if (res.status === 200) {
            const resData = await res.json();
            setData(resData);
          } else if (res.status === 400) {
            throw new Error(res.statusText);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      handleInputsChange();
    }
  }, [input1, input2]);

  useEffect(() => {
    const usdToCenaPrice = async () => {
      try {
        const res = await fetch(USD_TO_CENA_API);
        console.log({ res });
        if (res.status === 200) {
          const resData = await res.json();
          console.log({ v: resData.rates[0].mid });
          const usd = Number(1 / resData.rates[0].mid).toFixed(2);
          setUsdValue(usd);
        } else if (res.status === 400) {
          throw new Error(res.statusText);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    usdToCenaPrice();
  }, []);

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.data),
      datasets: [
        {
          label: "Gold Prices",
          data: data.map((d) => d.cena),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    }),
    [data]
  );

  useEffect(() => {
    if (
      usdValue &&
      data[0]?.cena &&
      data[data.length - 1]?.cena &&
      investment !== ""
    ) {
      const percentInterest = calculateInterest(
        data[0].cena,
        data[data.length - 1].cena
      );
      setReturns(calculateReturns(Number(investment), percentInterest));
    }
  }, [data[0]?.cena, data[data.length - 1]?.cena, usdValue, investment]);

  return (
    <div className="App">
      <div className="d-flex justify-content-around py-3">
        <input
          type="date"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
        <input
          type="date"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />
      </div>
      <div className="text-center">
        <p>1 cena = {usdValue}$</p>
        <label htmlFor="investment" className="mx-2">
          Investment amount:{" "}
        </label>
        <input
          type="text"
          id="investment"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Eg.1000"
        />
        {returns.statement && (
          <p className={`text-${returns.status === 1 ? "primary" : "danger"} `}>
            {returns.statement}
          </p>
        )}
        <hr />
      </div>
      {data.length !== 0 && (
        <div
          className="mx-auto"
          style={{ maxHeight: "1000px", maxWidth: "1000px" }}
        >
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
