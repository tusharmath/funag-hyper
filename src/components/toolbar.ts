/**
 * Created by tushar on 03/12/16.
 */

import {h} from '../hyperscript'
import * as iconButton from './icon-button'

export const view = () => {
  return h('div.toolbar', [
    iconButton.view('menu'),
    h('span', ['Funag'])
  ])
}