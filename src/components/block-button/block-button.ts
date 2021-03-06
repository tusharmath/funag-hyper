/**
 * Created by tushar on 12/12/16.
 */
import {h} from '../../lib'
import {VNodeProps, VNode} from '../../types'

export const view = (props: VNodeProps, children: Array<VNode|string>) => {
  return h('button.block-button', props, children)
}