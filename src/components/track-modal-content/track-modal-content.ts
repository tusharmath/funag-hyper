/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'
import * as button from '../floating-button/floating-button'

export const view = () => {
  return h('div', [
    'HELLO',
    button.view('play_arrow')
  ])
}