/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'
import {VNode} from 'snabbdom'

export const view = (content: VNode) => h('div.modal', [
  h('div.overlay'),
  h('div.content', [content])
])
