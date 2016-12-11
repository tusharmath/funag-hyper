/**
 * Created by tushar on 04/12/16.
 */
import {Track, EventEmitter} from '../../types'
import {h, durationFormat} from '../../lib'
import * as artwork from '../artwork/artwork'

export const view = (d: EventEmitter, track: Track) => {
  return h('div.track-tile', {on: {click: [d.listen, track]}}, [
    artwork.view(track.artwork_url),
    h('div', [
      h('div.title.overflow-ellipsis', [track.title]),
      h('small.artist.overflow-ellipsis', [track.user.username])
    ]),
    h('div', [
      h('small.duration', [durationFormat(track.duration)])
    ])
  ])
}