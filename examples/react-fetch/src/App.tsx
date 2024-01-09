import { useEffect } from "react";
import "./App.css";
import {
  fetchWithBaseUrl,
  setFetchFn,
} from "./generated/common/api-client.tsx";
import { useEmojisEmojisGet } from "./generated/emojis/reactQueries.tsx";

function App() {
  useEffect(() => {
    setFetchFn(fetchWithBaseUrl(fetch, "https://api.github.com/"));
  }, []);

  const { data } = useEmojisEmojisGet({});

  return (
    <>
      <h1>Compas + React + Fetch + React Query</h1>
      <div className="card">
        {data && <p>GitHub supports {Object.keys(data).length} emojis.</p>}
        {!data && <p>Fetching emojis from GitHub</p>}
      </div>

      <div className="card">
        <a href={"https://compasjs.com"} className="link">
          View the Compas docs
        </a>
      </div>
    </>
  );
}

// eslint-disable-next-line import/no-default-export
export default App;
