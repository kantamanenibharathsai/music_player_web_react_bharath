import React, {useEffect, useRef, useState} from "react";
import "./Card.css"
import musics from "../../assets/data"
import { timer } from "../../utils/Timer";
import { visualizer } from "../../utils/Visualizer";

const Card = ({ props: { musicNumber, setMusicNumber, setOpen } }) => {
    const [duration, setDuration] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [play, setPlay] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [volume, setVolume] = useState(50);
    const [repeat, setRepeat] = useState("repeat");

    const audioRef = useRef();
    const canvasRef = useRef();

    const handleLoadStart = (event) => {
        setDuration(audioRef.current.duration);
        // const src = event.nativeEvent.srcElement.src;
        // const audio = new Audio(src);
        // audio.onloadedmetadata = function() {
        //     if (audio.readyState > 0) setDuration(audio.duration);
        //     if (play) audioRef.current.play();
        // }
        if (play) audioRef.current.play();
    }

    const handlePlayingAudio = () => {
        visualizer(audioRef.current, canvasRef.current, play)
        if (play) {
            audioRef.current.pause();
            setPlay(false);
        }
        else {
            audioRef.current.play();
            setPlay(true);
        }
    }

    const handleTimeUpdate = () => {
        const currentTime = audioRef.current.currentTime;
        setCurrentTime(currentTime)
    }

    const changeCurrentTime = (event) => {
        const currentTime = Number(event.target.value);
        audioRef.current.currentTime = currentTime;
        setCurrentTime(currentTime);
    }

    const handleNextPrev = (n) => {
        setMusicNumber(value => {
            if (n > 0) return value + n > musics.length - 1 ? 0 : value + n;
            return value + n < 0 ? musics.length - 1 : value + n;;
        })
    }

    useEffect(() => {
        audioRef.current.volume = volume / 100; // 0 - 1
    }, [volume])

    const handleRepeat = () => {
        setRepeat(value => {
            switch(value) {
                case "repeat":
                    return "repeat_one";
                case "repeat_one":
                    return "shuffle"
                default:
                    return "repeat"
            }
        })
    }

    const randomNumber = () => {
        const number = Math.floor(Math.random() * (musics.length - 1));
        if (number === musicNumber) return randomNumber();
        return number;
    }

    const handleShuffle = () => {
        const number = randomNumber();
        setMusicNumber(number);
    }

    const endedAudio = () => {
        switch(repeat) {
            case "repeat_one":
                return audioRef.current.play();
            case "shuffle":
                return handleShuffle();
            default:
                return handleNextPrev(1);
        }
    }

    return (
        <div className="card">
            <div className="nav">
                <i className="material-symbols-outlined">
                    keyboard_arrow_down
                </i>
                <span>Now Playing {musicNumber + 1}/{musics.length}</span>
                <i className="material-symbols-outlined" onClick={() => {
                    console.log("clicked")
                    setOpen(prev => !prev)}}>
                    queue_music
                </i>
            </div>
            <div className="img">
                <img src={musics[musicNumber].thumbnail} alt="" className={`${play} ? "playing" : ""}`}/>
                <canvas ref={canvasRef}/>
            </div>
            <div className="details">
                <p className="title">{musics[musicNumber].title}</p>
                <p className="artist">{musics[musicNumber].artist}</p>
            </div>

            <div className="progress">
                <input type="range" min={0} max={duration} value={currentTime} onChange={(e) => changeCurrentTime(e)} 
                style={{background :`linear-gradient(to right, #3264fe ${currentTime / duration * 100}%, #e5e5e5 ${currentTime / duration * 100}%)`}}
                />
            </div>

            <div className="timer">
                <span>{timer(currentTime)}</span>
                <span>{timer(duration)}</span>
            </div>

            <div className="controls">
                <i className="material-symbols-outlined" onClick={handleRepeat}>
                    {repeat}
                </i>

                <i className="material-symbols-outlined" id="prev" onClick={() => handleNextPrev(-1)}>
                    skip_previous
                </i>

                <div className="play" onClick={handlePlayingAudio}>
                    <i className="material-symbols-outlined">
                        {play ? "pause":"play_arrow"}
                    </i>
                </div>

                <i className="material-symbols-outlined" id="next" onClick={() => handleNextPrev(1)}>
                    skip_next
                </i>

                <i class="material-symbols-outlined" onClick={() => setShowVolume(prev => !prev)}>
                    volume_up
                </i>

                <div className={`volume ${showVolume ? "show" : ""}` }>
                    <i class="material-symbols-outlined" onClick={() => setVolume(v => v > 0 ? 0 : 100)}>
                        {volume === 0 ? "volume_off" : "volume_up"}

                    </i>
                    <input type="range" min={0} max={100} onChange={e => setVolume(Number(e.target.value))} value={volume} 
                     style={{background :`linear-gradient(to right, #3264fe ${volume}%, #e5e5e5 ${volume}%)`}}
                    />
                    <span>{volume}</span>
                </div>
            </div>

            <audio onLoadedData={handleLoadStart} onEnded={endedAudio} src={musics[musicNumber].src} hidden ref={audioRef} onTimeUpdate={handleTimeUpdate}/>
        </div>
    )
}

export default Card;