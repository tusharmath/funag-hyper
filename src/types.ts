/**
 * Created by tushar on 03/12/16.
 */

import {VNode} from 'snabbdom'

export interface VNodeProps {
  style?: {[name: string]: string},
  on?: any
  'class'?: {[name: string]: boolean}
}

export interface Hyperscript {
  (type: string, props: VNodeProps, children: Array<VNode|string>): VNode
  (type: string, children: Array<VNode|string>): VNode
  (type: string, props: VNodeProps): VNode
  (type: string): VNode
}
