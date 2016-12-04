/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import * as R from 'ramda'
import * as t from './tasks'
import {h} from './lib'
import * as toolbar from './components/app-toolbar'
import * as search from './components/search-toolbar'
import {dispatcher, select} from './dispatcher'
import {Model, IDispatcher, Task} from './types'
import {Request} from './tasks'

const init = (): Model => ({
  showSearch: false,
  searchQuery: ''
})

export const view = (d: IDispatcher, model: Model) => h('div.app', [
  toolbar.view(d.of('toolbar')),
  model.showSearch ? search.view(d.of('searchBar')) : '',
  model.searchQuery
])

export const SoundCloudSearch = R.compose(
  O.multicast,
  O.map((q: string) => t.request(
    `//api.soundcloud.com/tracks?client_id=1862b9bf02ed7c80d0f545f835ad8773&q=${q}`
  )),
  O.skipRepeats(R.identity),
  O.map(R.prop('searchQuery'))
)

export function update () {
  const d = dispatcher('@root')
  const root$ = select('@root')(d.source())
  const reducer$ = O.merge(
    toolbar.update(select('toolbar')(root$)),
    search.update(select('searchBar')(root$))
  )
  const model$ = O.merge(
    O.scan((fn, m) => fn(m), init(), reducer$),
    O.of(init())
  )

  const request$ = SoundCloudSearch(model$)

  O.forEach(x => console.table(x), O.switchLatest(
    O.map((r: Request) => r.response$, request$))
  )

  let dom$ = O.map(model => t.dom(view(d, model)), model$)
  return O.merge<Task>(dom$, request$)
}

O.forEach(t => t.run(), update())

const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})