/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Button,
  Typography,
  Layout,
  Row,
  Col,
  Slider,
  ConfigProvider,
} from "antd";
import moment from "moment";
import { useSpring, animated } from "react-spring";

const { Text } = Typography;
const { Content } = Layout;

const PlayerApp = ({ data }) => {
  const playerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  const theme = {
    token: {
      colorPrimary: "#3f3f46",
      colorText: "#082f49",
      colorLink: "#082f49",
    },
  };

  const currentSentence = data.sentences[currentIndex];

  const imageSpring = useSpring({
    opacity: playing ? 1 : 0.5,
    config: { duration: 500 },
  });

  const formatTime = (seconds) => {
    return moment.utc(seconds * 1000).format("mm:ss");
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    const elapsed = state.playedSeconds;
    const duration = currentSentence.duration / 1000;

    setSlideProgress((elapsed / duration) * 100);

    const totalElapsed =
      data.sentences
        .slice(0, currentIndex)
        .reduce((acc, s) => acc + s.duration / 1000, 0) + elapsed;
    const totalDuration = data.sentences.reduce(
      (acc, s) => acc + s.duration / 1000,
      0
    );
    setProgress((totalElapsed / totalDuration) * 100);

    setCurrentTime(totalElapsed);
  };

  const handleEnded = () => {
    if (currentIndex + 1 < data.sentences.length) {
      setCurrentIndex(currentIndex + 1);
      // setSlideProgress(0);
      // setProgress(0);
    } else {
      setCurrentIndex(0);
      setSlideProgress(0);
      setProgress(0);
      setPlaying(false);
      playerRef.current.seekTo(0, "seconds");
    }
  };

  const handleSeek = (value) => {
    const totalDuration = data.sentences.reduce(
      (acc, sentence) => acc + sentence.duration / 1000,
      0
    );

    const targetTime = (value / 100) * totalDuration;

    let cumulativeDuration = 0;
    for (let i = 0; i < data.sentences.length; i++) {
      cumulativeDuration += data.sentences[i].duration / 1000;
      if (targetTime <= cumulativeDuration) {
        setCurrentIndex(i);
        const slideStartTime =
          cumulativeDuration - data.sentences[i].duration / 1000;
        playerRef.current.seekTo(targetTime - slideStartTime, "seconds");
        break;
      }
    }
    setCurrentTime(targetTime);
  };

  return (
    <Layout
      style={{
        background: "#fff",
        width: "100%",
      }}
    >
      <Content>
        <ConfigProvider theme={theme}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <animated.div
              style={{
                ...imageSpring,
                width: "100%",
                height: "480px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: "8px",
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                background: "#f0f0f0",
              }}
            >
              <img
                src={currentSentence.image}
                alt="Current Slide"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </animated.div>
          </div>
          <Row
            style={{
              height: "80px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottomRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.3))",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: "16px",
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              {currentSentence.text.replace(/\n/g, " ")}
            </Text>
          </Row>

          <Col style={{ backgroundColor: "#fafaf9" }}>
            <ReactPlayer
              ref={playerRef}
              url={currentSentence.voiceOver}
              playing={playing}
              onProgress={handleProgress}
              onEnded={handleEnded}
              width="100%"
              height="20px"
              // controls={true}
            />

            <Row
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Slider
                value={progress}
                onChange={handleSeek}
                tooltip={{ formatter: null }}
                style={{ width: "85%" }}
              />

              <Button
                onClick={handlePlayPause}
                type="primary"
                style={{ width: "10%", outline: "none", cursor: "pointer" }}
              >
                {playing ? "Pause" : "Play"}
              </Button>
            </Row>

            <Row justify="space-between" style={{ width: "85%" }}>
              <Text>{formatTime(currentTime)}</Text>
              <Text>
                {formatTime(
                  data.sentences.reduce(
                    (acc, sentence) => acc + sentence.duration / 1000,
                    0
                  )
                )}
              </Text>
            </Row>
          </Col>
        </ConfigProvider>
      </Content>
    </Layout>
  );
};

export default PlayerApp;
