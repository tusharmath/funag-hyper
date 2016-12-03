/**
 * Created by tushar on 03/12/16.
 */

import {h} from '../hyperscript'

export const view = (icon: string) => {
  return h('button.icon-button', [
    h('i.material-icons', [icon])
  ])
}