import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchWithBaseUrl,
  setFetchFn,
} from "./generated/common/api-client.tsx";
import { useDateConvertNumber } from "./generated/date/reactQueries.tsx";

function App() {
  const [dateInput, setDateInput] = useState(1687000000000);

  useEffect(() => {
    setFetchFn(fetchWithBaseUrl(fetch, "https://ddv.tools/"));
  }, []);

  const { data } = useDateConvertNumber({
    value: dateInput,
    queryOptions: {
      keepPreviousData: true,
    },
  });

  return (
    <>
      <h1>Compas + React + Fetch + React Query</h1>
      <div className="card">
        <span>Change the number:</span>
        <input
          type="number"
          onChange={(element) => setDateInput(Number(element.target.value))}
          value={dateInput}
        />
        {data && <p>Date is {data.isoString}</p>}
        {!data && <p>Change the input to get a new value.</p>}
      </div>

      <div className="card">
        <a href={"https://compasjs.com"} className="link">
          View the Compas docs
        </a>
      </div>
    </>
  );
}

export default App;
