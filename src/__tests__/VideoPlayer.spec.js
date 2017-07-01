import React from 'react'
import {shallow, mount} from 'enzyme'
import VideoPlayer from '../VideoPlayer'

describe('VideoPlayer specs', () => {
  it('should render properly', () => {
    const Component = shallow(<VideoPlayer videoSrc='https://www.w3schools.com/html/mov_bbb.mp4' />)
    expect(Component.hasClass('video-player-wrapper-row')).toBeTruthy()
    expect(Component.children().length).toEqual(1)
  })

  it('should have default props', () => {
    const Component = mount(<VideoPlayer videoSrc='https://www.w3schools.com/html/mov_bbb.mp4' />)
    expect(Component.prop('videoVolume')).toEqual(70)
    expect(Component.prop('videoProgress')).toEqual('')
    expect(Component.prop('videoPlaybackRate')).toEqual(1)
    expect(Component.prop('autoPlay')).toEqual(false)
    expect(Component.prop('pauseButtonClassName')).toEqual('')
    expect(Component.prop('nextButtonClassName')).toEqual('')
    expect(Component.prop('playlist')).toEqual(false)
    expect(Component.prop('defaultSeekTime')).toEqual(10)
    expect(Component.prop('defaultVolumeChange')).toEqual(10)
    expect(Component.prop('defaultBrowserControls')).toEqual(false)
    expect(Component.prop('customHtmlControls')).toEqual(true)
    expect(Component.prop('keyboardControls')).toEqual(true)
    expect(Component.prop('notificationClass')).toEqual('video-player-notifications')
    expect(Component.prop('notificationDuration')).toEqual(1500)
  })
})
