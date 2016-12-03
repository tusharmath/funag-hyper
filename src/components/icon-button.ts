/**
 * Created by tushar on 03/12/16.
 */

import {h} from '../hyperscript'
import {IDispatcher} from '../types'

export const view = (icon: string, d: IDispatcher) => {
  return h('button.icon-button', {on: {click: d.listen}}, [
    h('i.material-icons', [icon])
  ])
}