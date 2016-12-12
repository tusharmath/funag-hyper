/**
 * Created by tushar on 12/12/16.
 */
import * as icon from '../icon-button/icon-button'
import * as O from 'observable-air'
import * as R from 'ramda'
import {Action, select} from '../../events'
import {DrawerModel, EventEmitter} from '../../types'
import {h} from '../../lib'

export const init = (): DrawerModel => {
  return {
    visible: false
  }
}

export const view = (ev: EventEmitter, model: DrawerModel) => {
  const closeEV = ev.of('close')
  return h('div.drawer', {class: {'drawer--show': model.visible}}, [
    h('div.drawer-overlay', {on: {click: closeEV.listen}}),
    h('div.drawer-container', [
      h('div.drawer-header', [
        h('div.drawer-close', [
          icon.view('close', closeEV)
        ]),
        h('div', ['Tushar Mathur'])
      ]),
      h('div.drawer-content', [
        h('button.drawer-nav-item', [
          h('i.material-icons', ['favorite_border']),
          h('span.drawer-nav-item-title', ['Favourites'])
        ]),
        h('button.drawer-nav-item', [
          h('i.material-icons', ['queue_music']),
          h('span.drawer-nav-item-title', ['Playlists'])
        ]),
        h('button.drawer-nav-item', [
          h('i.material-icons', ['face']),
          h('span.drawer-nav-item-title', ['Me'])
        ]),
        h('button.drawer-nav-item', [
          h('i.material-icons', ['settings']),
          h('span.drawer-nav-item-title', ['Settings'])
        ])
      ])
    ])
  ])
}

export const update = (source: O.Observable<Action<any>>) => {
  const actions = select(source)
  return O.map(
    R.always(R.assoc('visible', false)),
    actions('close')
  )
}