/**
 * Created by tushar on 04/12/16.
 */
import * as O from 'observable-air'
import * as t from '../../tasks'
import {h} from '../../lib'
import * as button from '../floating-button/floating-button'
import {Track, EventEmitter} from '../../types'
import * as artwork from '../artwork-large/artwork-large'
import {select} from '../../events'

export const view = (d: EventEmitter, track: Track) => {
  return h('div.track-modal-content', [
    artwork.view(track.artwork_url),
    h('div.floating-button-container', {on: {click: [d.of('click').listen, track]}}, [
      button.view('play_arrow')
    ]),
    h('div.track-info', [
      h('div.header', [
        h('div', [
          h('div.title', [track.title]),
          h('div.artist', [track.user.username])
        ])
      ]),
      h('div.menu-items', [
        h('button', ['play']),
        h('button', ['enqueue'])
      ])
    ])
  ])
}

export const tasks = (source: O.Observable<any>) => {
  return O.map(t.play, select(source, 'click'))
}
