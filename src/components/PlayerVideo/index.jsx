import React, { useState, useEffect, useRef } from 'react';
import { IoIosPlay, IoIosPause } from 'react-icons/io';
import { AiOutlineStepBackward, AiOutlineStepForward, AiOutlineExpand } from 'react-icons/ai';
import { BsVolumeUpFill, BsVolumeMuteFill } from 'react-icons/bs';

import examples from '../../examples.json';

import { Container, Player, TimeLabel, OptionsBar, OptionsButton, OptionRangeValue, OptionsRangeVideo, TimeValue, Details } from './styles';

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
  const [indexOfSearch, setIndexOfSearch] = useState((Math.random() * maxIndexOfSearch).toFixed(0));

  const [videoURL, setVideoURL] = useState('');
  const [videoThumb, setVideoThumb] = useState('');
  const [details, setDetails] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  

  useEffect(() => {
    setVideoURL(examples.categories[0].videos[parseFloat(indexOfSearch)].url);
    setVideoThumb(examples.categories[0].videos[parseFloat(indexOfSearch)].thumb);
    setDetails({
      title: examples.categories[0].videos[parseFloat(indexOfSearch)].title,
      subtitle: examples.categories[0].videos[parseFloat(indexOfSearch)].subtitle
    });
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

  
  function handleChangeAudioPercentage(volume) {
    const newVolume = document.getElementById(videoPlayer.current.id).volume = (volume / 100)
    if(newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }


  function addZero(value) {
    return (value < 10) ? "0" + value : value;
  }


  function convertSecondsToTimestamp(seconds) {
    const fullTimestamp =  addZero(parseInt((seconds / 3600) % 24)) + ":" +
                           addZero(parseInt((seconds / 60) % 60)) + ":" + 
                           addZero(parseInt((seconds) % 60));

    const timestamp = fullTimestamp.split(':');

    return (timestamp[0] === '00') ? timestamp[1].concat(':' + timestamp[2]) : fullTimestamp
  }  


  function previousVideo() {
    if(parseFloat(indexOfSearch) > 0) {
      if(playerState.playing === true) { toggleVideoPlay() }
      setIsVisible(false);
      setIndexOfSearch(prevState => parseInt(prevState) - 1);
    }
  }


  function nextVideo() {
    if(parseFloat(indexOfSearch) < maxIndexOfSearch) {
      if(playerState.playing === true) { toggleVideoPlay() }
      setIsVisible(false);
      setIndexOfSearch(prevState => parseInt(prevState) + 1);
    }
  }


  return (
    <Container>
      <Player size="800px">
        {isVisible ?
          <TimeLabel>
            <TimeValue>
              {convertSecondsToTimestamp(videoPlayer.current?.currentTime)} / {convertSecondsToTimestamp((videoPlayer.current?.duration))}
            </TimeValue>  
          </TimeLabel>
        : ''}

        <video
          ref={videoPlayer}
          src={videoURL}
          poster={videoThumb}
          onTimeUpdate={handleTimeUpdate}
          id="player-video"
        />

        <OptionsBar>
          <OptionsButton onClick={() => {
            if(!isVisible) { setIsVisible(prevState => !prevState) }
            toggleVideoPlay()
          }}>
            { playerState.playing ? <IoIosPause color="#FFF" size={25} title="Pause" /> : <IoIosPlay color="#FFF" size={25} title="Play" /> }
          </OptionsButton>

          <OptionsButton>
            <AiOutlineStepBackward color="#FFF" size={20} title="Previous" onClick={previousVideo} />
          </OptionsButton>

          <OptionsButton>
            <AiOutlineStepForward color="#FFF" size={20} title="Next" onClick={nextVideo} />
          </OptionsButton>

          <OptionsButton 
            onMouseOver={() => {
              document.getElementById('option-range-value').style.visibility = 'visible'
              document.getElementById('red').style.visibility = 'visible'
            }} 
            onMouseOut={() => {
              document.getElementById('option-range-value').style.visibility = 'hidden'
              document.getElementById('red').style.visibility = 'hidden'
            }}
            onClick={() => {
              setIsMuted(prevState => !prevState)
              setVolume()  
            }          
          }>
            { isMuted ? <BsVolumeMuteFill color="#FFF" size={22} title={isMuted ? "Unmute" : "Mute"} /> : <BsVolumeUpFill color="#FFF" size={22} title="Mute" /> }
          </OptionsButton>

          <div 
            className="red" 
            id="red" 
            onMouseOver={() => {
              document.getElementById('option-range-value').style.visibility = 'visible'
              document.getElementById('red').style.visibility = 'visible'
            }} 
            onMouseOut={() => {
              document.getElementById('option-range-value').style.visibility = 'hidden'
              document.getElementById('red').style.visibility = 'hidden'
            }
          }>
            <OptionRangeValue 
              type="range"
              min="0"
              max="100"
              id="option-range-value"
              orient="vertical"              
              onChange={e => handleChangeAudioPercentage(e.target.value)}
            />
          </div>

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
        
        <Details>
          <h1>{details?.title}</h1>
          <h3>{details?.subtitle}</h3>
        </Details>
      </Player>
    </Container>
  );
}
