import React from 'react'
import PropTypes from 'prop-types'

import Notification from './Notification'

// import './styles/videoPlayer.css'

class VideoPlayer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      videoPlaying: this.props.autoPlay,
      videoProgress: this.props.videoProgress,
      videoBufferedProgressStart: 0,
      videoBufferedProgressEnd: 0,
      videoVolume: this.props.videoVolume,
      videoPlaybackRate: this.props.videoPlaybackRate,
      showVolumeSlider: false,
      showPlaybackRateSlider: false,
      videoControlContainerDisplay: 'none',
      videoClassName: '',
      hideMouse: '',
      showNotification: false
    }

    this.changePlaybackRate = this.changePlaybackRate.bind(this)
    this.toggleVideoPlay = this.toggleVideoPlay.bind(this)
    this.videoOnClick = this.videoOnClick.bind(this)
    this.showVideoControls = this.showVideoControls.bind(this)
    this.hideVideoControls = this.hideVideoControls.bind(this)
    this.onDurationChange = this.onDurationChange.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPlaying = this.onPlaying.bind(this)
    this.onEnded = this.onEnded.bind(this)
    this.putFoucsOnMe = this.putFoucsOnMe.bind(this)

    this.playNext = this.playNext.bind(this)
    this.playPrevious = this.playPrevious.bind(this)

    this.seek = this.seek.bind(this)
    this.changeDefaultSeekingTime = this.changeDefaultSeekingTime.bind(this)

    this.changeVolume = this.changeVolume.bind(this)
    this.volumeSliderDragStart = this.volumeSliderDragStart.bind(this)
    this.volumeSliderDragEnd = this.volumeSliderDragEnd.bind(this)
    this.changeDefaultVolumeChange = this.changeDefaultVolumeChange.bind(this)

    this.updateProgressBar = this.updateProgressBar.bind(this)

    this.progressBarOnClick = this.progressBarOnClick.bind(this)
    this.progressBarDragStart = this.progressBarDragStart.bind(this)
    this.progressBarDragEnd = this.progressBarDragEnd.bind(this)

    this.toggleVolume = this.toggleVolume.bind(this)
    this.showVolumeSlider = this.showVolumeSlider.bind(this)
    this.hideVolumeSlider = this.hideVolumeSlider.bind(this)

    this.showPlaybackRateSlider = this.showPlaybackRateSlider.bind(this)
    this.hidePlaybackRateSlider = this.hidePlaybackRateSlider.bind(this)

    this.videoHandleKeyDown = this.videoHandleKeyDown.bind(this)

    this.videoFullScreenToggle = this.videoFullScreenToggle.bind(this)
    this.toggleTheaterMode = this.toggleTheaterMode.bind(this)

    this.showNotification = this.showNotification.bind(this)
    this.hideNotification = this.hideNotification.bind(this)

    this.showHelpBox = this.showHelpBox.bind(this)
  }

  componentWillMount () {
    if (this.props.autoPlay) {
      this.videoButton = this.props.pauseButtonImg
    } else {
      this.videoButton = this.props.playButtonImg
    }
    this.volumeButtonImg = this.props.volumeButtonImg
  }

  componentDidMount () {
    this.playbackRate = this.props.playbackRate
    this.video = this.refs.video
    this.videoControlContainer = this.refs.videoControlContainer
    this.lastSavedVolume = this.video.volume
    this.defaultSeekTime = this.props.defaultSeekTime
    this.defaultVolumeChange = this.props.defaultVolumeChange
    this.progressBarWrapper = this.refs.progressBar
    this.preventSliderHide = false
    this.theaterModeOriginal = false
    this.helpBox = false
    this.videoKeyBinding = {
      38: {action: 'increaseVolume', key: 'Up-arrow'}, // arrow-up
      40: {action: 'DecreaseVolume', key: 'Down-arrow'}, // arrow-down
      39: {action: 'seekForward', key: 'Right-arrow'}, // arrow-right
      37: {action: 'seekBackward', key: 'Left-arrow'}, // arrow-left
      67: {action: 'increasePlayBackRate', key: 'C'}, // c
      88: {action: 'decreasePlayBackRate', key: 'X'}, // x
      90: {action: 'defaultPlaybackRate', key: 'Z'}, // z
      13: {action: 'fullScreenToggle', key: 'Enter'}, // enter
      70: {action: 'fullScreenToggle', key: 'F'}, // f
      32: {action: 'playPauseToggle', key: 'Space'}, // space
      75: {action: 'playPauseToggle', key: 'K'}, // k
      76: {action: 'seekForward', key: 'L'}, // l
      74: {action: 'seekBackward', key: 'J'}, // j
      77: {action: 'toggleVolume', key: 'M'}, // m
      84: {action: 'toggleTheaterMode', key: 'T'}, // t
      190: {action: 'playNextVideo', key: '>'}, // >
      188: {action: 'playPreviousVideo', key: '<'}, // <
      72: {action: 'showHelpBox', key: 'H'} // h
    }

    if (!this.props.browserControls) {
      this.videoDefaultControls = 'hide-video-controls'
    }
  }

  componentWillUnmount () {
    clearTimeout(this.hideAgain)
  }

  // onChange() {
  //
  //     const file = this.refs.lol.files[0];
  //
  //     // let reader = new FileReader();
  //     // var url = reader.readAsDataURL(file);
  //     // reader.onloadend = function (e) {
  //     //     debugger;
  //     //     this.setState({
  //     //         videoSrc : [reader.result]
  //     // });
  //     // }.bind(this);
  //
  //
  //     const fileURL = URL.createObjectURL(file);
  //
  //     this.setState({
  //         videoSrc: fileURL,
  //     });
  // }

  changePlaybackRate (option) {
    let newPlaybackRate = this.video.playbackRate
    if (option === 'increase') {
      newPlaybackRate = newPlaybackRate < 4 ? newPlaybackRate + 0.25 : newPlaybackRate
    } else if (option === 'decrease') {
      newPlaybackRate = newPlaybackRate > 0.5 ? newPlaybackRate - 0.25 : newPlaybackRate
    } else if (option === 'default') {
      newPlaybackRate = this.props.videoPlaybackRate
    } else if (option === 'custom') {
      const playbackControl = this.refs.playbackRateControl
      const playbackRateSliderHeight = this.refs.playbackRateSlider.offsetHeight

      newPlaybackRate = (1 - (event.clientY - (playbackControl.offsetTop - playbackRateSliderHeight)) / (playbackRateSliderHeight)) * 4
    }

    this.video.playbackRate = newPlaybackRate
    this.showNotification(['Playback Speed: ' + newPlaybackRate])
    this.setState({
      videoPlaybackRate: newPlaybackRate
    })
  }

  toggleVideoPlay () {
    if (this.props.videoSrc === '') {
      return
    }
    if (!this.state.videoPlaying) {
      this.videoButton = this.props.pauseButtonImg
      this.video.play()
    } else {
      this.videoButton = this.props.playButtonImg
      this.video.pause()
    }
    this.setState((prevState) => {
      return {
        videoPlaying: !prevState.videoPlaying
      }
    })
  }

  onDurationChange () {
    this.setState({
      videoProgress: 0
    })
  }

  onPlay () {
    this.setState({
      videoVolume: this.video.volume
    })

    if (this.props.onPlay) {
      this.props.onPlay()
    }
  }

  onPlaying () {
    if (this.props.onPlaying) {
      this.props.onPlaying()
    }
  }

  onEnded () {
    this.setState({
      videoProgress: 0
    })
    this.videoButton = this.props.playButtonImg
    if (this.props.onEnded) {
      this.props.onEnded()
    }
  }

  playNext () {
    if (!this.props.playNext) {
      this.showNotification(['No file found'])
    } else {
      this.props.playNext()
      this.videoButton = this.props.pauseButtonImg
    }
  }

  playPrevious () {
    if (!this.props.playPrevious) {
      this.showNotification(['No file found'])
    } else {
      this.props.playPrevious()
      this.videoButton = this.props.pauseButtonImg
    }
  }

  seek (direction) {
    if (direction === 'forward') {
      this.video.currentTime += this.defaultSeekTime
    } else if (direction === 'backward') {
      this.video.currentTime -= this.defaultSeekTime
    }
  }

  changeDefaultSeekingTime (newTime) {
    if (newTime > 0) {
      this.seekTime = newTime
    }
  }

  changeVolume (event, keyevent, direction) {
    let volume = 0
    if (event.type === 'keydown') {
      if (direction === 'up' && this.video.volume <= 1) {
        volume = this.video.volume + this.defaultVolumeChange
      } else if (direction === 'down' && this.video.volume >= 0) {
        volume = this.video.volume - this.defaultVolumeChange
      }
      volume = Math.round(volume * 10) / 10
    } else {
      if (this.state.showVolumeSlider === false) {
        return
      }
      const videoControlContainer = this.refs.videoControlContainer
      const volumeSliderHeight = this.refs.volumeSlider.offsetHeight

      volume = 1 - (event.clientY - (videoControlContainer.offsetTop - window.scrollY - volumeSliderHeight + 5)) / (volumeSliderHeight)
    }

    this.volumeButtonImg = this.props.volumeButtonImg
    if (volume > 1) {
      volume = 1
    } else if (volume <= 0) {
      this.volumeButtonImg = this.props.volumeButtonMuteImg
      volume = 0
    }
    if (event.type === 'keydown') {
      this.showNotification(['Volume: ' + volume * 100])
    }

    this.video.volume = volume
    this.setState({
      videoVolume: volume
    })
  }

  volumeSliderDragStart (event) {
    this.changeVolume(event)
    this.preventSliderHide = true
    document.addEventListener('mousemove', this.changeVolume)
    document.addEventListener('mouseup', this.volumeSliderDragEnd)
  }

  volumeSliderDragEnd () {
    document.removeEventListener('mousemove', this.changeVolume)
    document.removeEventListener('mouseup', this.volumeSliderDragEnd)
    this.hideVolumeSlider()
  }

  changeDefaultVolumeChange (newVolume) {
    if (newVolume <= 1 && newVolume >= 0) {
      this.defaultVolumeChange = newVolume
    }
  }

  updateProgressBar () {
    const buffered = this.video.buffered
    const target = buffered.length - 1

    let videoBufferedProgressStart = 0
    let videoBufferedProgressEnd = 0

    /* TODO: Fix buffered progress bar */
    if (buffered.length !== 0) {
      videoBufferedProgressStart = this.video.buffered.start(target) / this.video.duration * 100
      videoBufferedProgressEnd = this.video.buffered.end(target) / this.video.duration * 100
    }
    this.setState({
      videoProgress: this.video.currentTime / this.video.duration * 100,
      videoBufferedProgressStart,
      videoBufferedProgressEnd
    })
  }

  progressBarOnClick (event) {
    let progressValue = (event.clientX - (this.progressBarWrapper.offsetLeft + this.refs.videoContainer.offsetLeft)) / (this.progressBarWrapper.offsetWidth)
    if (progressValue > 1) {
      progressValue = 1
    }
    this.video.currentTime = (progressValue * this.video.duration)
    this.setState({
      videoProgress: progressValue * 100
    })
  }

  progressBarDragStart (event) {
    this.progressBarOnClick(event)
    document.addEventListener('mousemove', this.progressBarDragStart)
    document.addEventListener('mouseup', this.progressBarDragEnd)
  }

  progressBarDragEnd () {
    document.removeEventListener('mousemove', this.progressBarDragStart)
    document.removeEventListener('mouseup', this.progressBarDragEnd)
  }

  toggleVolume () {
    const currentVolume = this.video.volume
    if (currentVolume > 0) {
      this.lastSavedVolume = currentVolume
      this.volumeButtonImg = this.props.volumeButtonMuteImg
      this.video.volume = 0
    } else if (currentVolume === 0) {
      this.video.volume = this.lastSavedVolume
      this.volumeButtonImg = this.props.volumeButtonImg
    }
    this.setState({
      videoVolume: this.video.volume
    })
  }

  showVolumeSlider () {
    this.setState({
      showVolumeSlider: true
    })
  }

  hideVolumeSlider () {
    if (!this.preventSliderHide) {
      this.setState({
        showVolumeSlider: false
      })
    } else {
      this.preventSliderHide = false
    }
  }

  showPlaybackRateSlider () {
    this.setState({
      showPlaybackRateSlider: true
    })
  }

  hidePlaybackRateSlider () {
    this.setState({
      showPlaybackRateSlider: false
    })
  }

  videoFullScreenToggle () {
    const isFullScreenWebkit = document.webkitIsFullScreen
    const isFullScreenMoz = document.mozFullScreen

    let videoClassName = ''

    if (isFullScreenWebkit !== undefined) {
      if (isFullScreenWebkit) {
        videoClassName = ''
        document.webkitExitFullscreen()
      } else {
        this.refs.videoContainer.webkitRequestFullscreen()
        videoClassName = 'video-fit-to-screen'
        this.showNotification(['Press [T] to toggle between Video Mode'])
      }
    } else if (isFullScreenMoz !== undefined) {
      if (isFullScreenMoz) {
        document.isFullScreenWebkit()
        videoClassName = ''
      } else {
        this.refs.videoContainer.mozRequestFullScreen()
        videoClassName = 'video-fit-to-screen'
        this.showNotification(['Press [T] to toggle between Video Mode'])
      }
    }
    this.setState({
      videoClassName
    })
  }

  putFoucsOnMe (event) {
    event.target.focus()
  }

  videoHandleKeyDown (event) {
    if (!this.props.keyboardControl) {
      return
    }
    event.preventDefault()
    let handle = ''
    if (this.videoKeyBinding[event.keyCode]) {
      handle = this.videoKeyBinding[event.keyCode].action
    } else {
      handle = 'helpNotification'
    }
    switch (handle) {
      case 'increaseVolume':
        this.changeVolume(event, true, 'up')
        break
      case 'DecreaseVolume':
        this.changeVolume(event, true, 'down')
        break
      case 'toggleVolume':
        this.toggleVolume()
        break
      case 'seekForward':
        this.seek('forward')
        break
      case 'seekBackward':
        this.seek('backward')
        break
      case 'playPauseToggle':
        this.toggleVideoPlay()
        break
      case 'increasePlayBackRate':
        this.changePlaybackRate('increase')
        break
      case 'decreasePlayBackRate':
        this.changePlaybackRate('decrease')
        break
      case 'defaultPlaybackRate':
        this.changePlaybackRate('default')
        break
      case 'playNextVideo':
        this.playNext()
        break
      case 'playPreviousVideo':
        this.playPrevious()
        break
      case 'fullScreenToggle':
        this.videoFullScreenToggle()
        break
      case 'toggleTheaterMode':
        this.toggleTheaterMode()
        break
      case 'showHelpBox':
        this.showHelpBox()
        break
      case 'helpNotification':
        this.showNotification(['Press [H] for Help'])
        break
      default:
        break
    }
  }

  videoOnClick (event) {
    this.putFoucsOnMe(event)
    this.toggleVideoPlay()
  }

  showVideoControls () {
    clearTimeout(this.hideAgain)
    this.setState({
      hideMouse: 'none',
      videoControlContainerDisplay: 'flex'
    })

    this.hideAgain = setTimeout(this.hideVideoControls, 3000)
  }

  hideVideoControls () {
    this.setState({
      hideMouse: 'hide-mouse-cursor',
      videoControlContainerDisplay: 'none'
    })
  }

  toggleTheaterMode () {
    let className = ''
    if (this.theaterModeOriginal) {
      className = 'video-fit-to-screen'
    } else {
      className = 'video-original'
    }
    this.theaterModeOriginal = !this.theaterModeOriginal
    this.setState({
      videoClassName: className
    })
  }

  showNotification (value, className, duration) {
    clearTimeout(this.hideNotificationTimeOut)

    this.notificationClass = className || this.props.notificationClass
    const Duration = duration || this.props.notificationDuration
    // const Duration = duration || 15000;
    this.notificationValue = value

    this.setState({
      showNotification: true
    })

    this.hideNotificationTimeOut = setTimeout(this.hideNotification, Duration)
  }

  hideNotification () {
    clearTimeout(this.hideNotificationTimeOut)
    this.setState({
      showNotification: false
    })
  }

  showHelpBox () {
    if (!this.helpBox) {
      const values = []
      const keyBinding = this.videoKeyBinding
      for (let key in keyBinding) {
        if (keyBinding.hasOwnProperty(key)) {
          values.push(keyBinding[key].key + ' : ' + keyBinding[key].action)
        }
      }
      this.showNotification(values, 'help-box', 15000)
    } else {
      this.hideNotification()
    }
    this.helpBox = !this.helpBox
  }

  render () {
    return (
      <div>
        <div className='video-player-wrapper-row'>
          <div className='react-video-player-columns'>
            <div
              className='video-player-wrapper'
              ref='videoContainer'
              onMouseEnter={this.showVideoControls}
              onMouseLeave={this.hideVideoControls}
              onMouseMove={this.showVideoControls}
            >
              {this.state.showNotification &&
              <Notification className={this.notificationClass} values={this.notificationValue} />}

              <video
                className={this.state.videoClassName + ' ' + this.videoDefaultControls + ' ' + this.state.hideMouse + ' react-video-player-align-middle'}
                onKeyDown={this.videoHandleKeyDown}
                onClick={this.videoOnClick}
                onDoubleClick={this.videoFullScreenToggle}
                ref='video'
                src={this.props.videoSrc}
                controls
                autoPlay={this.props.autoPlay}
                muted={this.props.muted}
                onDurationChange={this.onDurationChange}
                onPlay={this.onPlay}
                onPlaying={this.onPlaying}
                onEnded={this.onEnded}
                onTimeUpdate={this.updateProgressBar}
              />
              <div className='video-controls react-video-player-row react-video-player-align-middle'
                ref='videoControlContainer'
                style={{'display': this.state.videoControlContainerDisplay}}>
                <div className='playback-control react-video-player-columns react-video-player-shrink'>
                  {this.props.playlist &&
                  <button className={'previous ' + this.props.previousButtonClassName}
                    onClick={this.playPrevious}>
                    <img src={this.props.previousButtonImg} />
                  </button>}

                  <button className='play-pause' onClick={this.toggleVideoPlay}>
                    <img src={this.videoButton} />
                  </button>

                  {this.props.playlist &&
                  <button className={'next ' + this.props.nextButtonClassName}
                    onClick={this.props.playNext}>
                    <img src={this.props.nextButtonImg} />
                  </button>}
                </div>
                <div className='progress-bar-control react-video-player-columns'>
                  <div className='progress-bar'
                    onMouseDown={this.progressBarDragStart}
                    ref='progressBar'>
                    <div className='progress' style={{'width': this.state.videoProgress + '%'}} />
                    <div className='progress-buffered'
                      style={{
                        'width': (this.state.videoBufferedProgressEnd - this.state.videoBufferedProgressStart) + '%',
                        'left': (this.state.videoBufferedProgressStart) + '%'
                      }}
                    />
                  </div >
                </div >
                <div className='react-video-player-columns react-video-player-shrink'>
                  <div
                    ref='volumeControl'
                    className='volume-control'
                    onMouseLeave={this.hideVolumeSlider}>
                    <button
                      className='volumeButton'
                      onClick={this.toggleVolume}
                      onMouseEnter={this.showVolumeSlider}>
                      <img
                        src={this.volumeButtonImg} />
                    </button >
                    {this.state.showVolumeSlider && <div
                      // <div
                      className='volume-slider'
                      ref='volumeSlider'
                      onClick={this.changeVolume}
                      onMouseDown={this.volumeSliderDragStart}
                    >
                      <div className='volume-wrapper-box'>
                        <div className='volume-wrapper'>
                          <div className='volume'
                            style={{'height': this.state.videoVolume * 100 + '%'}} />
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                </div>

                <div className='react-video-player-columns react-video-player-shrink'>
                  <div ref='fullScreen' className='fullscreen-control'>
                    <button
                      className='volumeButton'
                      onClick={this.videoFullScreenToggle}
                    >
                      <img src={this.props.fullScreenButtonImg} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

VideoPlayer.propTypes = {
  playbackRate: PropTypes.number,
  autoPlay: PropTypes.bool,
  muted: PropTypes.bool,
  playButtonImg: PropTypes.string,
  pauseButtonImg: PropTypes.string,
  nextButtonImg: PropTypes.string,
  previousButtonImg: PropTypes.string,
  volumeButtonImg: PropTypes.string,
  volumeButtonMuteImg: PropTypes.string,
  fullScreenButtonImg: PropTypes.string,
  playbackRateButtonImg: PropTypes.string,
  previousButtonClassName: PropTypes.string,
  nextButtonClassName: PropTypes.string,
  videoSrc: PropTypes.string.isRequired,
  playlist: PropTypes.bool, // is there any playlist
  onPlay: PropTypes.func,
  onPlaying: PropTypes.func,
  onEnded: PropTypes.func,
  playNext: PropTypes.func,
  playPrevious: PropTypes.func,
  defaultSeekTime: PropTypes.number,
  defaultVolumeChange: PropTypes.number,
  settings: PropTypes.bool,
  videoVolume: PropTypes.number,
  videoProgress: PropTypes.number,
  videoPlaybackRate: PropTypes.number,
  browserControls: PropTypes.bool,
  htmlControls: PropTypes.bool,
  keyboardControl: PropTypes.bool,
  notificationClass: PropTypes.string,
  notificationDuration: PropTypes.number
}

VideoPlayer.defaultProps = {
  playbackRate: 1,
  autoPlay: false,
  muted: false,
  playButtonImg: require('./media/fi-play.svg'),
  pauseButtonImg: require('./media/pause-button.svg'),
  nextButtonImg: require('./media/next.svg'),
  previousButtonImg: require('./media/back.svg'),
  volumeButtonImg: require('./media/speaker.svg'),
  volumeButtonMuteImg: require('./media/speaker-mute.svg'),
  fullScreenButtonImg: require('./media/switch-to-full-screen-button.svg'),
  playbackRateButtonImg: require('./media/speedometer.svg'),
  pauseButtonClassName: '',
  nextButtonClassName: '',
  playlist: false,
  defaultSeekTime: 10,
  defaultVolumeChange: 0.1,
  settings: false,
  videoVolume: 1,
  videoProgress: 0,
  videoPlaybackRate: 1,
  browserControls: false,
  htmlControls: true,
  keyboardControl: true,
  notificationClass: 'video-player-notifications',
  notificationDuration: 1500
}

export default VideoPlayer
