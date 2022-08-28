import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./styles.css";

function App() {
  const [prefCode, setPrefCode] = useState([]);
  // const [prefID, setPrefID] = useState(-1);
  const [data, setData] = useState([]);
  const [prefName, setPrefName] = useState([]);
  const text1 = "Population of ";

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`https://opendata.resas-portal.go.jp/api/v1/prefectures`, {
          headers: {
            "X-API-KEY": "OrG2P6cuTztfnrAd0nvC9NK1Bsabel1QyFJOaBL8",
            Accept: "application/json",
          },
        })
        .then((res) => {
          setPrefCode(res.data.result);
        });
    };
    getData();
  }, []);

  const renderCheckList = () => {
    return (
      <div className="container">
        {prefCode?.map((item) => {
          return (
            <div key={item.prefCode}>
              <input
                value={item.prefCode}
                type="radio"
                onChange={handleCheck}
                name="prefCode"
                id={item.prefName}
              />
              <label htmlFor={item.prefName}>{item.prefName}</label>
            </div>
          );
        })}
      </div>
    );
  };

  const handleCheck = (event) => {
    if (event.target.checked) {
      setPrefName(event.target.id);
      // setPrefID(event.target.value);
      axios
        .get(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${event.target.value}`,
          {
            headers: {
              "X-API-KEY": "OrG2P6cuTztfnrAd0nvC9NK1Bsabel1QyFJOaBL8",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setData(res.data.result.data[0].data);
        });
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <table>
          <tr>
            <td>
              <LineChart
                width={1000}
                height={700}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis ticks={[1000000,2000000,3000000,4000000, 5000000, 7000000, 9000000,12000000,15000000]}   />
                <Tooltip />
                <Legend />
                <Line
                  name={text1.concat(prefName)}
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </td>
            <td></td>
            <td>
              <div className="app">
                <div className="checkList">
                  <div className="title">Choose the area:</div>
                  <div className="list-container">{renderCheckList()}</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </header>
    </div>
  );
}
export default App;
