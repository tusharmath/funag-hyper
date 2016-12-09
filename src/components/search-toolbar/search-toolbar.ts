/**
 * Created by tushar on 03/12/16.
 */
import {h, targetValue} from '../../lib'
import * as R from 'ramda'
import * as O from 'observable-air'
import * as icon from '../icon-button/icon-button'
import {ISource, Model} from '../../types'
import {select} from '../../dispatcher'

export const view = (d: ISource) => {
  return h('div.toolbar.search-toolbar', [
    icon.view('arrow_back', d.of('back')),
    h('input', {
      props: {placeholder: 'Search', autofocus: true},
      on: {keyup: d.of('value').listen}
    }),
    icon.view('clear', d.of('clear'))
  ])
}


export const update = (source: O.Observable<any>) => {
  const actions = select(source)
  const value$ = O.map(
    R.assoc('searchQuery') as {(a: string): {(m: Model): Model}},
    targetValue(actions('value'))
  )

  const back$ = O.map(
    R.always(R.assoc('showSearch', false)),
    actions('back')
  )
  return O.merge(value$, back$)
}