import styled from 'styled-components';

export const Container = styled.div`
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`

export const Player = styled.div`
  width: ${props => props.size};
  height: max-content;
  padding: 10px;

  video {
    width: 100%;
    height: 430px;
  }
`

export const TimeLabel = styled.div`
  position: absolute;
  margin: 10px 20px;
  background: rgba(0, 0, 0, .7);
  padding: 5px;
  border-radius: 5px;
`

export const TimeValue = styled.span`
  color: #FFF;
  font-size: 14px;
`

export const OptionsBar = styled.div`
  background: #444;
  width: 100%;
  height: 50px;
  margin-top: -4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
`

export const OptionsButton = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 5px;
  background: transparent;
`

export const OptionsRangeVideo = styled.input`
  width: 70%;
  margin: 0 15px;
`

export const Details = styled.div`
  margin-top: 40px;

  h1 {
    color: #FFF;
    font-size: 23px;
  }

  h3 {
    color: #E5E5E5;
    font-size: 15px;
    margin-top: 7px;
  }
`
