/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import {h} from '../../lib'
import * as iconButton from '../icon-button/icon-button'
import {EventEmitter} from '../../types'
import {select} from '../../events'


const showSearch = R.ifElse(
  R.prop('showSearch'),
  R.assoc('showSearch', false),
  R.assoc('showSearch', true)
)

export const update = (source: O.Observable<any>) => {
  return O.merge(
    O.map(
      R.always(showSearch),
      select(source, 'search')
    ),
    O.map(
      R.always(R.assocPath(['drawer', 'completion'], 0)),
      select(source, 'menu')
    )
  )
}

export const view = (d: EventEmitter) => {
  return h('div.toolbar.app-toolbar', [
    iconButton.view('menu', d.of('menu')),
    h('div.flb-grow-1', ['Funag']),
    iconButton.view('search', d.of('search'))
  ])
}