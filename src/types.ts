/**
 * Created by tushar on 03/12/16.
 */

import {VNode} from 'snabbdom'
import * as O from 'observable-air'

export interface VNodeProps {
  attrs?: {[name: string]: string},
  props?: {[name: string]: any},
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

export interface IDispatcher {
  listen<T>(val: T): void
  of?(scope: string): IDispatcher
  source<T>(): O.IObservable<T>
}

export interface Model {
  showSearch: boolean,
  searchQuery: string
}

export interface Reducer {
  (a: Model): Model
}
export interface Task {
  run(): void
}
