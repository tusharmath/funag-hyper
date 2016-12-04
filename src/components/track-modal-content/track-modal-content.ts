/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'
import * as button from '../floating-button/floating-button'
import {Track} from '../../types'
import * as artwork from '../artwork-large/artwork-large'

export const view = (track: Track) => {
  return h('div.track-modal-content', [
    artwork.view(track.artwork_url),
    h('div.floating-button-container', [
      button.view('play_arrow')
    ]),
    h('div.header', [
      h('div', [
        h('div.title', [track.title]),
        h('div.artist', [track.user.username])
      ])
    ]),
    h('div.menu-items', [])
  ])
}