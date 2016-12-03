/**
 * Created by tushar on 03/12/16.
 */

import {h} from '../hyperscript'
import * as R from 'ramda'
import * as O from 'observable-air'
import * as icon from './icon-button'
import {IDispatcher} from '../types'
import {select} from '../dispatcher'

export const view = (d: IDispatcher) => {
  return h('div.toolbar-search', [
    icon.view('arrow_back', d.of('back')),
    h('input', {props: {placeholder: 'Search', autofocus: true}}),
    icon.view('clear', d.of('clear'))
  ])
}


export const update = (source: O.IObservable<any>) => {
  return O.map(
    R.always(R.assoc('showSearch', false)),
    select('back')(source)
  )
}