/**
 * Created by tushar on 03/12/16.
 */
import * as audio from '../audio/audio'
import * as modal from '../modal/modal'
import * as modalContent from '../track-modal-content/track-modal-content'
import * as O from 'observable-air'
import * as R from 'ramda'
import * as search from '../search-toolbar/search-toolbar'
import * as drawer from '../drawer/drawer'
import * as t from '../../tasks'
import {Audio} from '../../tasks'
import * as toolbar from '../app-toolbar/app-toolbar'
import * as trackList from '../track-list/track-list'
import {dispatcher, select, from} from '../../events'
import {h, TOKEN} from '../../lib'
import {
  Model,
  EventEmitter,
  Task,
  Track,
  Reducer,
  ModalModel,
  ReducerLense,
  MediaStatus,
  AudioModel,
  DrawerModel
} from '../../types'

const init = (): Model => ({
  showSearch: false,
  searchQuery: '',
  tracks: [],
  selectedTrack: undefined,
  modal: modal.init(),
  audio: {
    status: MediaStatus.PAUSED
  },
  drawer: drawer.init()
})

export const view = (d: EventEmitter, model: Model) => {
  const content = !model.selectedTrack ? '' : modalContent.view(
    d.of('modalContent'),
    {track: model.selectedTrack, audio: model.audio}
  )
  return h('div.app', [
    toolbar.view(d.of('toolbar')),
    model.showSearch ? search.view(d.of('searchBar')) : '',
    trackList.view(d, model.tracks),
    modal.view(d.of('modal'), content, model.modal),
    drawer.view(d.of('drawer'), model.drawer)
  ])
}
export const searchQuery = R.compose(
  O.skipRepeats(R.identity),
  O.map(R.prop('searchQuery'))
)
export const tracksURL = (q: string) => {
  return `//api.soundcloud.com/tracks?client_id=${TOKEN}&q=${q}`
}

export const update = (root$: O.Observable<any>, audioT: Audio) => {
  const actions = select(root$)
  return O.merge(
    toolbar.update(actions('toolbar')),
    search.update(actions('searchBar')),

    O.map(
      R.over(R.lensProp('audio')) as ReducerLense<AudioModel, Model>,
      audio.update(audioT)
    ),

    O.map(
      R.over(R.lensProp('drawer')) as ReducerLense<DrawerModel, Model>,
      drawer.update(actions('drawer'))
    ),

    O.map(
      R.always(R.converge(R.assocPath(['audio', 'track']), [R.prop('selectedTrack'), R.identity])),
      audioT.events('play')
    ),

    O.map(
      R.always(R.assocPath(['audio', 'track'], undefined)),
      audioT.events('ended')
    ),

    O.map(
      R.over(R.lensProp('modal')) as ReducerLense<ModalModel, Model>,
      modal.update(actions('modal'), actions('selectTrack'))
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

export function main (D: EventEmitter): O.Observable<Task> {
  const audioT = t.audio(D.of('audio'))
  const root$ = select(D.source(), '@root')
  const reducer$ = update(root$, audioT)
  const model$ = model(reducer$)

  // Log Actions
  // O.forEach(x => console.log(x), root$)
  O.forEach(x => console.log(x), model$)

  // Tasks
  const actions = select(root$)
  return O.merge<Task>(
    O.map(model => t.dom(view(D, model)), model$),
    O.map(requestTracks(D), searchQuery(model$)),
    modalContent.tasks(actions('modalContent'), actions('audio')),
    O.of(audioT)
  )
}

const events = dispatcher('@root')
O.forEach(t => t.run(), main(events))
const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})