import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AudioContextState = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = queue[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!currentTrack?.audio_url) return;

    audio.crossOrigin = currentTrack.audio_cross_origin || "anonymous";
    audio.src = currentTrack.audio_url;

    if (isPlaying) {
      audio.play();
    }
  }, [currentTrack]);

  async function playTrack(track, index = 0, tracks = []) {
    const audio = audioRef.current;

    if (tracks.length) {
      setQueue(tracks);
    }

    setCurrentTrackIndex(index);

    if (track?.audio_url) {
      audio.crossOrigin = track.audio_cross_origin || "anonymous";
      audio.src = track.audio_url;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  function togglePlayback() {
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function seek(time) {
    audioRef.current.currentTime = time;
  }

  function nextTrack() {
    if (!queue.length) return;

    const nextIndex =
      (currentTrackIndex + 1) % queue.length;

    setCurrentTrackIndex(nextIndex);
  }

  function previousTrack() {
    if (!queue.length) return;

    const prevIndex =
      currentTrackIndex === 0
        ? queue.length - 1
        : currentTrackIndex - 1;

    setCurrentTrackIndex(prevIndex);
  }

  return (
    <AudioContextState.Provider
      value={{
        currentTrack,
        currentTrackIndex,
        queue,
        audioElement: audioRef.current,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        togglePlayback,
        seek,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </AudioContextState.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContextState);
}
