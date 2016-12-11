/**
 * Created by tushar on 06/12/16.
 */

import * as trackTile from '../track-tile/track-tile'
import {h} from '../../lib'
import {Track, EventEmitter} from '../../types'

export const view = (d: EventEmitter, tracks: Array<Track>) => {
  return h('div.tracks', tracks.map(track => trackTile.view(d.of('selectTrack'), track)))
}
