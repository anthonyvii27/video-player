import React, { useState, useEffect, useRef } from 'react';
import { IoIosPlay, IoIosPause } from 'react-icons/io';
import { AiOutlineStepBackward, AiOutlineStepForward, AiOutlineExpand, AiFillSound } from 'react-icons/ai';
import { BsVolumeUpFill, BsVolumeMuteFill } from 'react-icons/bs';

import examples from '../../examples.json';

import { Container, Player, OptionsBar, OptionsButton, OptionsRangeVideo } from './styles';

function usePlayerState(videoPlayer) {
  const [playerState, setPlayerState] = useState({ playing: false, percentage: 0 });

  useEffect(() => {
    playerState.playing ? videoPlayer.current.play() : videoPlayer.current.pause();
  }, [
    videoPlayer,
    playerState.playing
  ]);

  function toggleVideoPlay() {
    setPlayerState({
      ...playerState,
      playing: !playerState.playing
    });
  }

  function handleTimeUpdate() {
    const currentPercentage = (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100;

    setPlayerState({
      ...playerState,
      percentage: currentPercentage | 0
    });
  }

  function handleChangeVideoPercentage(event) {
    const currentPercentageValue = event.target.value;
    videoPlayer.current.currentTime = videoPlayer.current.duration / 100 * currentPercentageValue;  

    setPlayerState({
      ...playerState,
      percentage: currentPercentageValue | 0
    });
  }

  return {
    playerState,
    toggleVideoPlay,
    handleTimeUpdate,
    handleChangeVideoPercentage
  }
}

export default function PlayerVideo() {
  const videoPlayer = useRef(null);
  const maxIndexOfSearch = examples.categories[0].videos.length - 1;

  const [videoURL, setVideoURL] = useState('');
  const [videoThumb, setVideoThumb] = useState('');

  const [indexOfSearch, setIndexOfSearch] = useState((Math.random() * maxIndexOfSearch).toFixed(0));

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setVideoURL(examples.categories[0].videos[parseFloat(indexOfSearch)].url);
    setVideoThumb(examples.categories[0].videos[parseFloat(indexOfSearch)].thumb);
  }, [indexOfSearch]);

  const { 
    playerState,
    toggleVideoPlay,
    handleTimeUpdate,
    handleChangeVideoPercentage
  } = usePlayerState(videoPlayer);

  function setVolume() {
    if(!isMuted) {
      document.getElementById(videoPlayer.current.id).volume = 0;
    } else {
      document.getElementById(videoPlayer.current.id).volume = 1;
    }
  }

  return (
    <Container>
      <Player size={{width: '800px', height: '705px'}}>
        <video
          ref={videoPlayer}
          src={videoURL}
          poster={videoThumb}
          onTimeUpdate={handleTimeUpdate}
          id="player-video"
        />

        <OptionsBar>
          <OptionsButton onClick={toggleVideoPlay}>
            { playerState.playing ? <IoIosPause color="#FFF" size={25} title="Pause" /> : <IoIosPlay color="#FFF" size={25} title="Play" /> }
          </OptionsButton>

          <OptionsButton>
            <AiOutlineStepBackward color="#FFF" size={20} title="Previous" />
          </OptionsButton>

          <OptionsButton>
            <AiOutlineStepForward color="#FFF" size={20} title="Next" />
          </OptionsButton>

          <OptionsButton onClick={() => {
            setIsMuted(prevState => !prevState)
            setVolume()
          }}>
            { isMuted ? <BsVolumeMuteFill color="#FFF" size={22} title="Mute" /> : <BsVolumeUpFill color="#FFF" size={22} title="Mute" /> }
          </OptionsButton>

          <OptionsRangeVideo 
            type="range"
            min="0"
            max="100"
            onChange={handleChangeVideoPercentage}
            value={playerState.percentage}
          />  

          <OptionsButton onClick={() => document.getElementById(videoPlayer.current.id).requestFullscreen()}>
            <AiOutlineExpand color="#FFF" size={20} title="Fullscreen" />
          </OptionsButton>
        </OptionsBar>
      </Player>
    </Container>
  );
}
