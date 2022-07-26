import "./App.css";
import ReactPlayer from "react-player/youtube";
import React, { useState, useEffect, useRef } from "react";
import { getFirestore } from "firebase/firestore";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

function App() {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [url, setUrl] = useState("");
  const [seek, setSeek] = useState(0);
  const [velocity, setVelocity] = useState(0);
  initializeApp({});

  const db = getFirestore();

  const playerRef: any = useRef();

  useEffect(() => {
    try {
      onSnapshot(doc(db, "youtube", "params"), (doc: any) => {
        setPlaying(doc.data().playng);
        setVolume(doc.data().volume);
        setUrl(doc.data().url);
        setVelocity(doc.data().velocity);
      });
    } catch (err) {
      alert("err");
    }
  }, []);

  useEffect(() => {
    try {
      onSnapshot(doc(db, "youtube", "seek"), (doc: any) => {
        playerRef.current.seekTo(doc.data().currentSeek);
        setSeek(doc.data().currentSeek);
      });
    } catch (err) {
      alert("err");
    }
  }, []);

  async function handleChangeTime() {
    playerRef.current.seekTo(seek);
    await updateDoc(doc(db, "youtube", "seek"), {
      currentSeek: seek,
    });
  }

  return (
    <>
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls
        volume={volume}
        playing={playing}
        width={"100%"}
        height={"100vh"}
        progressInterval={1}
        playbackRate={velocity}
        onProgress={(e) => setSeek(e.played)}
        onSeek={(e) => console.log(e)}
        onPause={handleChangeTime}
      />
    </>
  );
}

export default App;
