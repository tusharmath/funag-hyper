/**
 * Created by tushar on 04/12/16.
 */
import {Track} from '../types'
import {h, durationFormat} from '../lib'

export const view = (track: Track) => {
  return h('div.track-tile', [
    h('div', [
      h('div.title', [track.title]),
      h('small.artist', [track.user.username])
    ]),
    h('div', [
      h('small.duration', [durationFormat(track.duration)])
    ])
  ])
}