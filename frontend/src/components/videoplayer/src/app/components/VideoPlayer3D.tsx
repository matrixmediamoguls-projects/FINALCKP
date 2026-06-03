import { useState, useEffect, useRef } from "react";

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  currentTime: number;
  thumbnail: string;
}

export default function VideoPlayer3D() {
  const [video, setVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch video from backend
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const projectId = (await import("/utils/supabase/info")).projectId;
        const publicAnonKey = (await import("/utils/supabase/info")).publicAnonKey;

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-36aa0f81/videos/VID-00421`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setVideo(data.video);
        } else {
          // Initialize sample video if not found
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-36aa0f81/init-videos`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
              },
            }
          );
          // Fetch again
          const retryResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-36aa0f81/videos/VID-00421`,
            {
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
              },
            }
          );
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setVideo(data.video);
          }
        }
      } catch (error) {
        console.error("Error fetching video from Supabase:", error);
      }
    };

    fetchVideo();
  }, []);

  // Generate animated audio levels
  useEffect(() => {
    const generateLevels = () => {
      const levels = Array.from({ length: 25 }, (_, i) => {
        if (i < 11 && isPlaying) {
          return 10 + Math.random() * 32;
        }
        return 10 + Math.random() * 30;
      });
      setAudioLevels(levels);
    };

    generateLevels();
    const interval = setInterval(generateLevels, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update current time
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => setDuration(videoElement.duration);

    videoElement.addEventListener("timeupdate", updateTime);
    videoElement.addEventListener("loadedmetadata", updateDuration);

    return () => {
      videoElement.removeEventListener("timeupdate", updateTime);
      videoElement.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!video) {
    return (
      <div className="w-full min-h-screen bg-[#060405] flex items-center justify-center">
        <div className="text-[#c22020] text-sm">Loading video...</div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[#060405] flex flex-col items-center justify-center p-10 md:p-20 relative overflow-hidden"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 48%, #220508 0%, #100204 40%, #060405 100%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "18%",
          width: "64%",
          height: "55%",
          background:
            "radial-gradient(ellipse, rgba(160, 8, 8, 0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "140px",
          background:
            "radial-gradient(ellipse, rgba(160, 6, 6, 0.14) 0%, transparent 70%)",
        }}
      />

      {/* 3D Perspective Container */}
      <div style={{ perspective: "1300px", perspectiveOrigin: "52% 46%" }}>
        <div
          style={{
            transform: "rotateX(12deg) rotateY(-16deg) rotateZ(1.5deg)",
            transformStyle: "preserve-3d",
            display: "inline-block",
            filter:
              "drop-shadow(0 70px 120px rgba(160, 8, 8, 0.65)) drop-shadow(0 20px 50px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 60px rgba(140, 6, 6, 0.25))",
          }}
        >
          {/* Right edge (3D side) */}
          <div
            className="absolute top-5 -right-11 h-[calc(100%-40px)] w-[46px]"
            style={{
              transformOrigin: "left center",
              transform: "rotateY(90deg)",
              background:
                "linear-gradient(180deg, #2c0808 0%, #160404 35%, #0e0202 70%, #1a0505 100%)",
              borderTopRightRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          >
            {/* Side details */}
            {[28, 44, 60, 76, 92, 108].map((top, i) => (
              <div
                key={i}
                className="absolute right-2.5 w-[18px] h-0.5 bg-black/75 rounded-sm"
                style={{ top: `${top}px` }}
              />
            ))}
            <div
              className="absolute left-1.5 top-[30%] bottom-[30%] w-0.5 rounded-sm"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(200, 20, 20, 0.6), rgba(200, 20, 20, 0.9), rgba(200, 20, 20, 0.6), transparent)",
                boxShadow: "0 0 8px rgba(220, 20, 20, 0.7)",
              }}
            />
          </div>

          {/* Bottom edge (3D bottom) */}
          <div
            className="absolute -bottom-[38px] left-[18px] h-10 w-[calc(100%-36px)]"
            style={{
              transformOrigin: "top center",
              transform: "rotateX(-90deg)",
              background:
                "linear-gradient(90deg, #1e0505 0%, #120303 50%, #0e0202 100%)",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
          >
            <div
              className="absolute top-[40%] left-[15%] right-[15%] h-px"
              style={{ background: "rgba(180, 20, 20, 0.2)" }}
            />
          </div>

          {/* Main frame */}
          <div
            className="w-[830px] rounded-[28px] p-3 relative"
            style={{
              background:
                "linear-gradient(160deg, #6e1616 0%, #3c0b0b 12%, #1e0505 30%, #140303 55%, #1a0404 75%, #3a0c0c 90%, #581414 100%)",
              border: "1.5px solid #7a2020",
              boxShadow:
                "inset 0 3px 6px rgba(255, 120, 120, 0.14), inset 0 -4px 10px rgba(0, 0, 0, 0.95), inset 4px 0 8px rgba(255, 80, 80, 0.06), inset -2px 0 6px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Corner accents */}
            <div
              className="absolute top-0 left-0 w-24 h-24"
              style={{
                background: "linear-gradient(135deg, #a02828 0%, transparent 52%)",
                borderRadius: "28px 0 0 0",
              }}
            />
            <div
              className="absolute top-0 right-0 w-24 h-24"
              style={{
                background: "linear-gradient(225deg, #a02828 0%, transparent 52%)",
                borderRadius: "0 28px 0 0",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-24 h-24"
              style={{
                background: "linear-gradient(45deg, #a02828 0%, transparent 52%)",
                borderRadius: "0 0 0 28px",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-24 h-24"
              style={{
                background: "linear-gradient(315deg, #a02828 0%, transparent 52%)",
                borderRadius: "0 0 28px 0",
              }}
            />

            {/* Top highlight */}
            <div
              className="absolute top-0 left-9 right-9 h-0.5 rounded-sm"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 140, 140, 0.28), rgba(255, 210, 210, 0.55), rgba(255, 140, 140, 0.28), transparent)",
              }}
            />

            {/* Inner container */}
            <div
              className="rounded-[20px] bg-[#040101] p-3.5 pb-3"
              style={{
                border: "1px solid #3e1414",
                boxShadow:
                  "inset 0 0 40px rgba(0, 0, 0, 0.98), inset 0 2px 4px rgba(180, 20, 20, 0.08)",
              }}
            >
              {/* Video container */}
              <div
                className="rounded-xl overflow-hidden relative bg-black"
                style={{
                  aspectRatio: "16/9",
                  boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.9)",
                }}
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                />

                {/* Overlay effects */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 80% at 50% 50%, #170303 0%, #0d0101 55%, #060101 100%)",
                    mixBlendMode: "multiply",
                    pointerEvents: "none",
                  }}
                />
                <div
                  className="absolute inset-0 z-[3] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.016) 2px, rgba(255, 255, 255, 0.016) 3px)",
                  }}
                />
                <div
                  className="absolute inset-0 z-[4] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(255, 255, 255, 0.055) 0%, transparent 38%)",
                  }}
                />
                <div
                  className="absolute inset-0 z-[2] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.65) 100%)",
                  }}
                />

                {/* Circular rings */}
                {[280, 220, 165].map((size, i) => (
                  <div
                    key={i}
                    className="absolute z-[2] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      border: `1px solid rgba(200, 18, 18, ${0.28 - i * 0.08})`,
                    }}
                  />
                ))}

                {/* Live indicator */}
                <div
                  className="absolute top-4 left-4 z-[5] flex items-center gap-1.5 rounded-md px-3 py-1.5"
                  style={{
                    background: "rgba(4, 0, 0, 0.82)",
                    border: "1px solid rgba(180, 20, 20, 0.45)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#d01a1a]"
                    style={{ boxShadow: "0 0 7px #ff3535" }}
                  />
                  <span
                    className="text-[10px] text-[#b03030] tracking-[0.12em] font-bold"
                  >
                    R2 LIVE
                  </span>
                </div>

                {/* Quality badge */}
                <div
                  className="absolute top-4 right-4 z-[5] rounded-md px-3 py-1.5"
                  style={{
                    background: "rgba(4, 0, 0, 0.82)",
                    border: "1px solid rgba(180, 18, 18, 0.4)",
                  }}
                >
                  <span className="text-[10px] text-[#c42020] tracking-[0.14em] font-extrabold">
                    4K
                  </span>
                </div>

                {/* Audio visualizer */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-end gap-0.5 z-[3]">
                  {audioLevels.map((height, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-t"
                      style={{
                        height: `${height}px`,
                        background:
                          i < 11
                            ? `rgba(210, 22, 22, ${0.5 + i * 0.045})`
                            : "rgba(180, 22, 22, 0.22)",
                        boxShadow:
                          i < 11 ? "0 0 5px rgba(220, 28, 28, 0.45)" : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Play button */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-[5] cursor-pointer"
                  onClick={togglePlay}
                >
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(200, 20, 20, 0.2) 0%, transparent 70%)",
                      boxShadow: "0 0 50px rgba(180, 14, 14, 0.4)",
                    }}
                  />
                  <div
                    className="w-[76px] h-[76px] rounded-full flex items-center justify-center relative"
                    style={{
                      background:
                        "radial-gradient(circle at 38% 36%, rgba(240, 50, 50, 0.3) 0%, rgba(160, 14, 14, 0.18) 60%, transparent 80%)",
                      border: "1.5px solid rgba(220, 36, 36, 0.6)",
                      boxShadow:
                        "0 0 36px rgba(200, 18, 18, 0.55), inset 0 1px 2px rgba(255, 100, 100, 0.2)",
                    }}
                  >
                    {isPlaying ? (
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-7 bg-white/95 rounded-sm" />
                        <div className="w-1.5 h-7 bg-white/95 rounded-sm" />
                      </div>
                    ) : (
                      <div
                        className="ml-1.5"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "14px solid transparent",
                          borderBottom: "14px solid transparent",
                          borderLeft: "24px solid rgba(255, 70, 70, 0.95)",
                          filter: "drop-shadow(0 0 10px rgba(255, 50, 50, 0.85))",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Source label */}
                <div className="absolute bottom-3 right-3.5 z-[5] flex items-center gap-1.5">
                  <span className="text-[10px] text-[#a03232]/50 tracking-[0.09em]">
                    SUPABASE · R2
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-3.5 flex items-center gap-3.5 px-1">
                <button
                  onClick={skipBackward}
                  className="bg-transparent border-none text-[#622020] p-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432zM3 20V4" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(145deg, #c21818 0%, #780c0c 100%)",
                    border: "1.5px solid rgba(220, 48, 48, 0.75)",
                    boxShadow:
                      "0 0 18px rgba(200, 18, 18, 0.55), inset 0 1px 2px rgba(255, 80, 80, 0.25)",
                  }}
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-white/95" />
                      <div className="w-1 h-3 bg-white/95" />
                    </div>
                  ) : (
                    <div
                      className="ml-1"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "7px solid transparent",
                        borderBottom: "7px solid transparent",
                        borderLeft: "12px solid #fff",
                        opacity: 0.95,
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="bg-transparent border-none text-[#622020] p-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 4v16M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
                  </svg>
                </button>

                <span className="text-xs text-[#6e3232] font-medium min-w-[34px]">
                  {formatTime(currentTime)}
                </span>

                {/* Progress bar */}
                <div
                  className="flex-1 h-[3px] bg-[#2a0808] rounded relative cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[rgba(180,20,20,0.18)] rounded"
                    style={{ width: "58%" }}
                  />
                  <div
                    className="h-full rounded relative"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #991212, #ee3030)",
                      boxShadow: "0 0 10px rgba(200, 18, 18, 0.7)",
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full"
                    style={{
                      left: `${progress}%`,
                      transform: "translate(-50%, -50%)",
                      background:
                        "radial-gradient(circle at 35% 35%, #ff6060, #cc2020)",
                      boxShadow: "0 0 12px rgba(255, 44, 44, 0.9)",
                    }}
                  />
                </div>

                <span className="text-xs text-[#6e3232] font-medium min-w-[34px] text-right">
                  {formatTime(duration)}
                </span>

                <button className="bg-transparent border-none text-[#4e2020] p-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6m3.364 3.364a9 9 0 0 0 0-12.728" />
                  </svg>
                </button>

                <button onClick={toggleFullscreen} className="bg-transparent border-none text-[#4e2020] p-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6m0-6l-7 7M3 21l7-7m-1 7H3v-6" />
                  </svg>
                </button>
              </div>

              {/* Info bar */}
              <div
                className="mt-2.5 flex items-center justify-between px-3.5 py-2.5 rounded-[10px]"
                style={{
                  background: "rgba(255, 255, 255, 0.022)",
                  border: "1px solid rgba(110, 18, 18, 0.28)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-[#c22020] tracking-[0.12em] font-bold">
                    {video.id}
                  </span>
                  <div className="w-px h-3 bg-[#3e1010]" />
                  <span className="text-[11px] text-[#5a2e2e] tracking-[0.05em]">
                    {video.title}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"
                    style={{ boxShadow: "0 0 6px #22c55e" }}
                  />
                  <span className="text-[10px] text-[#2e4e2e] tracking-[0.07em]">
                    Supabase
                  </span>
                  <div className="w-px h-2.5 bg-[#2e0e0e]" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.36"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9" />
                  </svg>
                  <span className="text-[10px] text-[#4e2424] tracking-[0.07em]">
                    Cloudflare R2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
