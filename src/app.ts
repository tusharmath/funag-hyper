/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import * as t from './tasks'
import {h} from './lib'
import * as toolbar from './components/toolbar'
import * as search from './components/toolbar-search'
import {dispatcher, select} from './dispatcher'
import {Model, IDispatcher} from './types'

const init = (): Model => ({
  showSearch: false,
  searchQuery: ''
})

export const view = (d: IDispatcher, model: Model) => h('div.app', [
  toolbar.view(d.of('toolbar')),
  model.showSearch ? search.view(d.of('searchBar')) : '',
  model.searchQuery
])

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
  return O.map(model => t.dom(view(d, model)), model$)
}

O.forEach(t => t.run(), update())

const body = document.body
requestAnimationFrame(() => {
  body.style.opacity = '1'
})