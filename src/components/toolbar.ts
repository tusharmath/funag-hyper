/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import * as R from 'ramda'
import {h} from '../lib'
import * as iconButton from './icon-button'
import {IDispatcher} from '../types'
import {select} from '../dispatcher'


const showSearch = R.ifElse(
  R.prop('showSearch'),
  R.assoc('showSearch', false),
  R.assoc('showSearch', true)
)

export const update = (source: O.IObservable<any>) => {
  return O.map(
    R.always(showSearch),
    select('search')(source)
  )
}

export const view = (d: IDispatcher) => {
  return h('div.toolbar', [
    iconButton.view('menu', d.of('menu')),
    h('div.flb-grow-1', ['Funag']),
    iconButton.view('search', d.of('search'))
  ])
}