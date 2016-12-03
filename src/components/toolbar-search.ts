/**
 * Created by tushar on 03/12/16.
 */

import {h} from '../hyperscript'
import * as icon from './icon-button'
import {IDispatcher} from '../types'

export const view = (d: IDispatcher) => {
  return h('div.toolbar-search', [
    icon.view('arrow_back', d.of('back')),
    h('input', {props: {placeholder: 'Search'}}),
    icon.view('clear', d.of('clear'))
  ])
}