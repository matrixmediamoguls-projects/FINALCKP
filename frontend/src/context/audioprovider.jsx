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
  const preloadAudioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.78);

  const currentTrack = queue[currentTrackIndex];

  const loadAudioTrack = (track) => {
    const audio = audioRef.current;

    if (!track?.audio_url) return false;

    audio.preload = "auto";
    audio.crossOrigin = track.audio_cross_origin || "anonymous";

    if (audio.getAttribute("src") !== track.audio_url) {
      setCurrentTime(0);
      setDuration(0);
      audio.src = track.audio_url;
      audio.load();
    }

    return true;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.78;
    audio.preload = "auto";

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const updateVolume = () => {
      setVolumeState(audio.volume);
    };

    const onEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("volumechange", updateVolume);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("volumechange", updateVolume);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const normalized = Math.max(0, Math.min(1, Number(volume) || 0));
    audio.volume = normalized;
  }, [volume]);

  useEffect(() => {
    if (!loadAudioTrack(currentTrack)) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error(err);
        setIsPlaying(false);
      });
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const nextTrack = queue.length
      ? queue[(currentTrackIndex + 1) % queue.length]
      : null;
    const preloadAudio = preloadAudioRef.current;

    if (!nextTrack?.audio_url || nextTrack.audio_url === currentTrack?.audio_url) {
      preloadAudio.removeAttribute("src");
      return;
    }

    preloadAudio.preload = "auto";
    preloadAudio.crossOrigin = nextTrack.audio_cross_origin || "anonymous";

    if (preloadAudio.getAttribute("src") !== nextTrack.audio_url) {
      preloadAudio.src = nextTrack.audio_url;
      preloadAudio.load();
    }
  }, [currentTrack?.audio_url, currentTrackIndex, queue]);

  async function playTrack(track, index = 0, tracks = []) {
    const audio = audioRef.current;

    if (tracks.length) {
      setQueue(tracks);
    }

    setCurrentTrackIndex(index);

    if (loadAudioTrack(track)) {
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

  function setVolume(nextVolume) {
    const normalized = Math.max(0, Math.min(1, Number(nextVolume) || 0));
    setVolumeState(normalized);
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
        volume,
        playTrack,
        togglePlayback,
        seek,
        setVolume,
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
