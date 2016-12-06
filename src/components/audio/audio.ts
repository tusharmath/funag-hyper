/**
 * Created by tushar on 06/12/16.
 */
import * as O from 'observable-air'
import {h} from '../../lib'
import {ISource, AudioModel, MediaStatus} from '../../types'
import {Action} from '../../dispatcher'


export const init = (): AudioModel => {
  return {
    status: MediaStatus.PAUSED
  }
}
export const view = (d: ISource, model: AudioModel) => {
  return h('audio', {
    attrs: {src: model.track.stream_url},
    on: {
      timeupdate: d.of('timeUpdate').listen,
      play: d.of('play').listen,
      pause: d.of('pause').listen,
      error: d.of('error').listen 
    }
  })
}

export const update = (d: O.IObservable<Action<Event>>) => {
  O.forEach(x => console.log(x), d)
  return new O.Observable(() => void 0)
}