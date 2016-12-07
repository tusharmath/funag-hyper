/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import {h} from '../../lib'
import * as iconButton from '../icon-button/icon-button'
import {ISource} from '../../types'
import {select} from '../../dispatcher'


const showSearch = R.ifElse(
  R.prop('showSearch'),
  R.assoc('showSearch', false),
  R.assoc('showSearch', true)
)

export const update = (source: O.IObservable<any>) => {
  return O.map(
    R.always(showSearch),
    select(source, 'search')
  )
}

export const view = (d: ISource) => {
  return h('div.toolbar.app-toolbar', [
    iconButton.view('menu', d.of('menu')),
    h('div.flb-grow-1', ['Funag']),
    iconButton.view('search', d.of('search'))
  ])
}