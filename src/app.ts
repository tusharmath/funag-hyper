/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import * as t from './tasks'
import {h} from './lib'
import * as toolbar from './components/app-toolbar'
import * as search from './components/search-toolbar'
import * as trackTile from './components/track-tile'
import {dispatcher, select} from './dispatcher'
import {Model, IDispatcher, Task, Track} from './types'

const init = (): Model => ({
  showSearch: false,
  searchQuery: '',
  tracks: []
})

export const view = (d: IDispatcher, model: Model) => {
  return h('div.app', [
    toolbar.view(d.of('toolbar')),
    model.showSearch ? search.view(d.of('searchBar')) : '',
    h('ul.tracks', model.tracks.map(trackTile.view))
  ])
}

export const searchQuery = R.compose(
  O.skipRepeats(R.identity),
  O.map(R.prop('searchQuery'))
)

export const tracksURL = (q: string) =>
  `//api.soundcloud.com/tracks?client_id=1862b9bf02ed7c80d0f545f835ad8773&q=${q}`


export function update () {
  const d = dispatcher('@root')
  const root$ = select('@root', d.source())
  const reducer$ = O.merge(
    toolbar.update(select('toolbar', root$)),
    search.update(select('searchBar', root$)),
    O.map(
      R.assoc('tracks') as {(tracks: Track[]): {(m: Model): Model}},
      O.switchLatest(select('HTTP.tracks', root$))
    ) as O.IObservable<{(m: Model): Model}>
  )
  const getTracks = (q: string) => t.request(d.of('HTTP.tracks'), tracksURL(q))
  const model$ = O.merge(
    O.scan((fn, m) => fn(m), init(), reducer$),
    O.of(init())
  )
  const request$ = O.map(getTracks, searchQuery(model$))
  let dom$ = O.map(model => t.dom(view(d, model)), model$)
  return O.merge<Task>(dom$, request$)
}

O.forEach(t => t.run(), update())

const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})