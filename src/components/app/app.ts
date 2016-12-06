/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import * as t from '../../tasks'
import {h, TOKEN} from '../../lib'
import * as toolbar from '../app-toolbar/app-toolbar'
import * as search from '../search-toolbar/search-toolbar'
import * as trackTile from '../track-tile/track-tile'
import * as modal from '../modal/modal'
import {ModalModel} from '../modal/modal'
import * as modalContent from '../track-modal-content/track-modal-content'
import {dispatcher, select, from} from '../../dispatcher'
import {Model, ISource, Task, Track} from '../../types'

const init = (): Model => ({
  showSearch: false,
  searchQuery: '',
  tracks: [],
  selectedTrack: null,
  modal: modal.init()
})
export const view = (d: ISource, model: Model) => {
  const content = !model.selectedTrack ? '' : modalContent.view(model.selectedTrack)
  return h('div.app', [
    toolbar.view(d.of('toolbar')),
    model.showSearch ? search.view(d.of('searchBar')) : '',
    h('div.tracks', model.tracks.map(track => trackTile.view(d.of('selectTrack'), track))),
    modal.view(d.of('modal'), content, model.modal)
  ])
}
export const searchQuery = R.compose(
  O.skipRepeats(R.identity),
  O.map(R.prop('searchQuery'))
)
export const tracksURL = (q: string) => {
  return `//api.soundcloud.com/tracks?client_id=${TOKEN}&q=${q}`
}
export const reducers = (root$: O.IObservable<any>) => {
  return O.merge(
    toolbar.update(select('toolbar', root$)),
    search.update(select('searchBar', root$)),
    O.map(
      R.over(R.lensProp('modal')) as {(r: (m: ModalModel) => ModalModel): (m: Model) => Model},
      modal.update(select('modal', root$), select('selectTrack', root$))
    ),
    O.map(
      R.assoc('tracks') as {(tracks: Track[]): {(m: Model): Model}},
      O.switchLatest(select('HTTP.tracks', root$))
    ),
    O.map(
      R.assoc('selectedTrack') as {(track: Track): {(m: Model): Model}},
      select('selectTrack', root$)
    )
  )
}
export const model = (reducer$: O.IObservable<{(m: Model): Model}>) => {
  return O.merge(
    O.scan((fn, m) => fn(m), init(), reducer$),
    O.of(init())
  )
}
const requestTracks = R.useWith(t.request, [from('HTTP.tracks'), tracksURL])
export const tasks = (D: ISource, model$: O.IObservable<Model>) => {
  const request$ = O.map(requestTracks(D), searchQuery(model$))
  const dom$ = O.map(model => t.dom(view(D, model)), model$)
  return O.merge<Task>(dom$, request$)
}
export function update (): O.IObservable<Task> {
  const D = dispatcher('@root')
  const root$ = select('@root', D.source())
  const reducer$ = reducers(root$)
  const model$ = model(reducer$)
  return tasks(D, model$)
}
O.forEach(t => t.run(), update())
const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})