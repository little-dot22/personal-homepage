import { useEffect, useRef, useState } from "react";
import closingTheme from "../../../music/spongebob-closing-theme.mp3";

interface Track {
  id: string;
  title: string;
  url: string;
}

// 之后新增音乐：在数组里加一项即可，播放器自动支持切换
const TRACKS: Track[] = [
  { id: "closing", title: "海绵宝宝片尾曲", url: closingTheme }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.src = TRACKS[0].url;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[index].url;
    audio.load();
    if (playingRef.current) {
      audio.play().catch(() => {});
    }
  }, [index]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingRef.current) {
      audio.pause();
      playingRef.current = false;
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          playingRef.current = true;
          setPlaying(true);
        })
        .catch(() => {});
    }
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    const audio = audioRef.current;
    if (audio) audio.volume = v;
  };

  const switchTrack = (dir: 1 | -1) => {
    if (TRACKS.length < 2) return;
    setIndex((index + dir + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="music-player">
      <button
        type="button"
        className="music-play-btn"
        onClick={toggle}
        aria-label={playing ? "暂停音乐" : "播放音乐"}
      >
        {playing ? "暂停" : "播放"}
      </button>
      <div className="music-meta">
        <span className="music-title">{TRACKS[index].title}</span>
        <div className="music-controls">
          <button
            type="button"
            className="music-nav-btn"
            disabled={TRACKS.length < 2}
            onClick={() => switchTrack(-1)}
            aria-label="上一首"
          >
            ‹
          </button>
          <input
            type="range"
            className="music-volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            aria-label="音量"
          />
          <button
            type="button"
            className="music-nav-btn"
            disabled={TRACKS.length < 2}
            onClick={() => switchTrack(1)}
            aria-label="下一首"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
