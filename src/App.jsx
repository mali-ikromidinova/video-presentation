import { useEffect, useState } from "react";
import PlayerApp from "./components/player";
import { Spin, Layout } from "antd";

const { Content } = Layout;

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/presentation.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch JSON");
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content style={{ textAlign: "center", marginTop: "100px" }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content style={{ textAlign: "center", marginTop: "100px" }}>
          <p>Error: Could not load the presentation data.</p>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ background: "#fff", width: "100%" }}>
      <div style={{ margin: "0 auto", width: "800px" }}>
        <PlayerApp data={data} />
      </div>
    </Layout>
  );
}

export default App;
