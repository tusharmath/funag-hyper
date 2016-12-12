/**
 * Created by tushar on 12/12/16.
 */
import {h} from '../../lib'

export const view = () => {
  return h('div.drawer', [
    h('div.drawer-overlay'),
    h('div.drawer-container', [
      h('div.drawer-header', ['Tushar Mathur'])
    ])
  ])
}