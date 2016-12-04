/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'
import {VNode} from 'snabbdom'
import {IDispatcher} from '../../types'

export const view = (d: IDispatcher, content: VNode) => h('div.modal', [
  h('div.overlay', {on: {click: d.listen}}),
  h('div.content', [content])
])
