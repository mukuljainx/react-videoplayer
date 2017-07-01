<h1 align="center">React Video Player</h1>

<p align="center">
  A configrable react html5 video component
</p>


## Installation

```bash
$ npm install react-videoplayer --save
```

## Getting Started

```
import VideoPlayer from 'react-videoplayer'
import 'react-videoplayer/lib/index.css'
```

## Features

- Pass Initial volume, time, playback rate
- Disable/Enable default controls
- Disable/Enable custom controls
- Disable any particular control like playback rate control
- Pass custom icons for any button
- Keyboard Controls
- Customize slider (Overwrite CSS)
- Control hiding on mouse out or no mouse movement
- Support for playlist

## Upcoming Features (v1)

- High Order Component one can pass custom Control with exposed API for control
- Customize keyboard control in run-time


## Props

Prop   	 	     |  Type      |  Default      |  Description
---------   	 |  -------   |  -------      |  -----------
  `videoSrc` | string | | video url (**required**) 
  `videoVolume` | number | 70 | intial playback volume range [0-100]
  `videoProgress` | string | 0m0s | video start time as string MM:SS
  `videoPlaybackRate` | number | 1 | Default playback rate
  `autoPlay` | bool | false | video will played as component is mounted
  `playButtonImg` | string | svg-icon | icon path
  `pauseButtonImg` | string | svg-icon | icon path
  `nextButtonImg` | string | svg-icon | icon path
  `previousButtonImg` | string | svg-icon | icon path
  `volumeButtonImg` | string | svg-icon | icon path
  `volumeButtonMuteImg` | string | svg-icon | icon path
  `fullScreenButtonImg` | string | svg-icon | icon path
  `playbackRateButtonImg` | string | svg-icon | icon path
  `previousButtonClassName` | string |''  | class for prev btn is disabled ( when 1st video is played)
  `nextButtonClassName` | string | '' | class for prev btn is disabled ( when last video is played)
  `onPlay` | func | | function called when video starts intially
  `onPlaying` | func | | function called when video played 
  `onEnded` | func | | function called when video ends
  `playlist` | bool | false | when true prev and next btn are active
  `playNext` | func | | func called when next buttin is clicked 
  `playPrevious` | func | | func called when prev buttin is clicked 
  `defaultSeekTime` | number | 10 | default seek time when video is seeked through key
  `defaultVolumeChange` | number | 10 | default volume change when changed through key
  `browserControls` | bool | false | default html5 controls
  `htmlControls` | bool | true | default custom controls
  `keyboardControls` | bool | true | enables keyboard controls
  `notificationClass` | string | 'video-player-notifications' | default class for notification
  `notificationDuration` | number | 1500 | timeout for notification

## Keyboard Shortcuts

Key   	 	|  Action 
---------   |  -------
Up Arrow |  Increase Volume
Down Arrow |  Decrease Volume
Right Arrow |  Seek Forward
Left Arrow |  Seek Backward
C |  Increase PlayBack Rate
X |  Decrease PlayBack Rate
Z |  Default Playback Rate
Enter / F |  Fullscreen Toggle
Space / K |  play-Pause Toggle
L |  Seek Forward
J |  Seek Backward
M |  Toggle Volume
T |  Toggle TheaterMode
`>` |  play Next Video
< |  play Previous Video
H |  Show HelpBox



## Basic Example

```
import React from 'react';
import VideoPlayer from 'react-videoplayer'
import 'react-videoplayer/lib/index.css'


class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videoSrc : 'https://www.w3schools.com/html/mov_bbb.mp4'
        };
        
    }


    render() {
        return (
            <div>
                <VideoPlayer
                    videoSrc={this.state.videoSrc}
                    autoPlay={true}
                />
            </div>
        );
    }
}

export default Player;

```

## Advance Example

This examples contains one more component dragNdrop which is loosely based on [react-drag-and-drop](!https://github.com/asbjornenge/react-drag-and-drop) through which files are dropped to play.

```
import React from 'react';
import VideoPlayer from 'react-videoplayer'
import 'react-videoplayer/lib/index.css'
import DragNDropInput from '../components/DragNDropInput';


class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist: [],
            videoFiles: [],
            videoSrc: "",
            currentVideo: -1,
            previousButtonClassName: "",
            nextButtonClassName: ""
        };

        this.DragNDropInputOnDrop = this.DragNDropInputOnDrop.bind(this);
        this.videoPlayerPlayNext = this.videoPlayerPlayNext.bind(this);
        this.videoPlayerPlayPrevious = this.videoPlayerPlayPrevious.bind(this);
    }


    DragNDropInputOnDrop(dragndrop, acceptedFiles) {
        let newVideoFile = [];
        let newPlayList = [];
        let oldVideoFile = this.state.videoFiles;
        let oldPlayList = this.state.playlist;
        acceptedFiles.forEach((file) => {
            const index = helper.isObjectDuplicate(file, oldVideoFile, "name");
            const fileURL = URL.createObjectURL(file);
            if (index === -1) {
                newVideoFile.push(file);
                newPlayList.push(fileURL);
            }
        });

        if (newPlayList.length > 0) {
            this.setState((prevState) => {
                let currentVideo = -1;
                if (prevState.currentVideo === -1) {
                    currentVideo = 0;
                }
                else {
                    currentVideo = prevState.currentVideo;
                }
                const playlist = [...oldPlayList, ...newPlayList];
                const videoFiles = [...oldVideoFile, ...newVideoFile];
                return {
                    nextButtonClassName: "",
                    playlist,
                    videoFiles,
                    currentVideo,
                    videoSrc: playlist[currentVideo]
                };
            });
        }
    }

    videoPlayerPlayNext() {
        if (this.state.currentVideo === this.state.playlist.length - 1) {
            return;
        }
        else {
            this.setState((prevState) => {
                const currentVideo = prevState.currentVideo + 1;
                const className = currentVideo === prevState.playlist.length - 1 ? "disabled" : "";
                return {
                    currentVideo,
                    videoSrc: prevState.playlist[currentVideo],
                    nextButtonClassName: className,
                    previousButtonClassName: ""
                };
            });
        }
    }

    videoPlayerPlayPrevious() {
        if (this.state.currentVideo === 0) {
            return;
        }
        else {
            this.setState((prevState) => {
                const currentVideo = prevState.currentVideo - 1;
                const className = currentVideo === 0 ? "disabled" : "";
                return {
                    currentVideo,
                    videoSrc: prevState.playlist[currentVideo],
                    previousButtonClassName: className,
                    nextButtonClassName: ""
                };
            });
        }
    }


    render() {
        return (
            <div>
                {this.state.videoSrc === "" ? false :
                    <VideoPlayer
                        videoSrc={this.state.videoSrc}
                        playNext={this.videoPlayerPlayNext}
                        playPrevious={this.videoPlayerPlayPrevious}
                        nextButtonClassName={this.state.nextButtonClassName}
                        previousButtonClassName={this.state.previousButtonClassName}
                        autoPlay={true}
                        playlist={this.state.playlist.length > 1}
                    />}
                <DragNDropInput
                    onDrop={this.DragNDropInputOnDrop}
                />

            </div>
        );
    }
}

export default Player;

```
## Screenshots
<p align="center">
   <img src="https://github.com/mukuljainx/react-videoplayer/blob/master/screenshots/player.png" width="500">
   <img src="https://github.com/mukuljainx/react-videoplayer/blob/master/screenshots/notification-volume.png" width="500">
   <img src="https://github.com/mukuljainx/react-videoplayer/blob/master/screenshots/notification-help.png" width="500">
   <img src="https://github.com/mukuljainx/react-videoplayer/blob/master/screenshots/helpbox.png" width="500">
</p>

**Note**: Image contains music video [believer](https://www.youtube.com/watch?v=IhP3J0j9JmY) by [Imagine Dragons](https://en.wikipedia.org/wiki/Imagine_Dragons) to which I claim not rights.

## Issues
Feel free to contribute. Submit a Pull Request or open an issue for further discussion.

## License
MIT
