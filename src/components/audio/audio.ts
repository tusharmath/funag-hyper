/**
 * Created by tushar on 06/12/16.
 */
import * as O from 'observable-air'
import {h} from '../../lib'
import {EventEmitter, AudioModel, MediaStatus} from '../../types'
import {Action} from '../../events'


export const init = (): AudioModel => {
  return {
    status: MediaStatus.PAUSED
  }
}
export const view = (d: EventEmitter, model: AudioModel) => {
  return h('audio', {
    attrs: model.track ? {src: model.track.stream_url} : {},

    on: {
      timeupdate: d.of('timeUpdate').listen,
      play: d.of('play').listen,
      pause: d.of('pause').listen,
      error: d.of('error').listen
    }
  })
}

export const update = (d: O.Observable<Action<Event>>) => {
  O.forEach(x => console.log(x), d)
  return O.create(() => void 0)
}