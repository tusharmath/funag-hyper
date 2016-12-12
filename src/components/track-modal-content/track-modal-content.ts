/**
 * Created by tushar on 04/12/16.
 */
import * as artwork from '../artwork-large/artwork-large'
import * as button from '../floating-button/floating-button'
import * as O from 'observable-air'
import * as R from 'ramda'
import * as t from '../../tasks'
import {EventEmitter, TrackModalModel, MediaStatus} from '../../types'
import {h} from '../../lib'
import {select} from '../../events'

export const matchStatus = R.useWith(R.equals, [
  R.identity,
  R.path(['audio', 'status'])
])

export const icon = R.ifElse(
  R.allPass([
    R.anyPass([
      matchStatus(MediaStatus.PLAYING),
      matchStatus(MediaStatus.LOADING)
    ]),
    (model: TrackModalModel) => model.track === model.audio.track
  ]),
  R.always('pause'),
  R.always('play_arrow')
)

export const view = (d: EventEmitter, model: TrackModalModel) => {
  const track = model.track
  const playEE = d.of('play')
  return h('div.track-modal-content', [
    artwork.view(track.artwork_url),
    h('div.floating-button-container', {on: {click: [playEE.listen, track]}}, [
      button.view(icon(model), model.audio.status === MediaStatus.LOADING)
    ]),
    h('div.track-info', [
      h('div.header', [
        h('div', [
          h('div.title', [track.title]),
          h('div.artist', [track.user.username])
        ])
      ]),
      h('div.menu-items', [
        h('button', {on: {click: [playEE.listen, track]}}, ['play']),
        h('button', ['enqueue'])
      ])
    ])
  ])
}

export const tasks = (source: O.Observable<any>, audio$: O.Observable<HTMLAudioElement>) => {
  const click$ = select(source, 'play')
  return O.sample(t.play, click$, [audio$, click$])
}
