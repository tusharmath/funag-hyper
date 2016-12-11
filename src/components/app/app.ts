/**
 * Created by tushar on 03/12/16.
 */
import * as audio from '../audio/audio'
import * as modal from '../modal/modal'
import * as modalContent from '../track-modal-content/track-modal-content'
import * as O from 'observable-air'
import * as R from 'ramda'
import * as search from '../search-toolbar/search-toolbar'
import * as t from '../../tasks'
import * as toolbar from '../app-toolbar/app-toolbar'
import * as trackList from '../track-list/track-list'
import {dispatcher, select, from} from '../../events'
import {h, TOKEN} from '../../lib'
import {Model, EventEmitter, Task, Track, Reducer, ModalModel, AudioModel, ReducerLense} from '../../types'

const init = (): Model => ({
  showSearch: false,
  searchQuery: '',
  tracks: [],
  selectedTrack: undefined,
  modal: modal.init(),
  audio: audio.init()
})
export const view = (d: EventEmitter, model: Model) => {
  const content = !model.selectedTrack ? '' : modalContent.view(d.of('modalContent'), model.selectedTrack)
  return h('div.app', [
    toolbar.view(d.of('toolbar')),
    model.showSearch ? search.view(d.of('searchBar')) : '',
    trackList.view(d, model.tracks),
    modal.view(d.of('modal'), content, model.modal),
    audio.view(d.of('audio'), model.audio)
  ])
}
export const searchQuery = R.compose(
  O.skipRepeats(R.identity),
  O.map(R.prop('searchQuery'))
)
export const tracksURL = (q: string) => {
  return `//api.soundcloud.com/tracks?client_id=${TOKEN}&q=${q}`
}
export const update = (root$: O.Observable<any>) => {
  const actions = select(root$)
  return O.merge(
    toolbar.update(actions('toolbar')),
    search.update(actions('searchBar')),
    O.map(
      R.over(R.lensProp('modal')) as ReducerLense<ModalModel, Model>,
      modal.update(actions('modal'), actions('selectTrack'))
    ),
    O.map(
      R.over(R.lensProp('audio')) as ReducerLense<AudioModel, Model>,
      audio.update(actions('audio'))
    ),
    O.map(
      R.assoc('tracks') as {(tracks: Track[]): Reducer<Model>},
      O.switchLatest(actions('HTTP.tracks'))
    ),
    O.map(
      R.assoc('selectedTrack') as {(track: Track): Reducer<Model>},
      actions('selectTrack')
    )
  )
}
export const model = (reducer$: O.Observable<Reducer<Model>>) => {
  return O.merge(
    O.scan((fn, m) => fn(m), init(), reducer$),
    O.of(init())
  )
}
const requestTracks = R.useWith(t.request, [from('HTTP.tracks'), tracksURL])
export const tasks = (D: EventEmitter, model$: O.Observable<Model>) => {
  const actions = select(select(D.source(), '@root'))
  const request$ = O.map(requestTracks(D), searchQuery(model$))
  const dom$ = O.map(model => t.dom(view(D, model)), model$)
  const play$ = modalContent.tasks(actions('modalContent'))
  return O.merge<Task>(dom$, request$, play$)
}
export function main (): O.Observable<Task> {
  const D = dispatcher('@root')
  return tasks(D, model(update(select(D.source(), '@root'))))
}
O.forEach(t => t.run(), main())
const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})