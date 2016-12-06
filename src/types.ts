/**
 * Created by tushar on 03/12/16.
 */
import {VNode} from 'snabbdom'
import * as O from 'observable-air'
import {ModalModel} from './components/modal/modal'

export interface VNodeProps {
  attrs?: {[name: string]: string},
  props?: {[name: string]: any},
  style?: {[name: string]: string},
  on?: any
  hook?: {[name: string]: Function}
  'class'?: {[name: string]: boolean}
}

export interface Hyperscript {
  (type: string, props: VNodeProps, children: Array<VNode|string>): VNode
  (type: string, children: Array<VNode|string>): VNode
  (type: string, props: VNodeProps): VNode
  (type: string): VNode
}

export interface ISource {
  listen<T>(val: T): void
  of?(scope: string): ISource
  source<T>(): O.IObservable<T>
}

export interface Model {
  showSearch: boolean,
  searchQuery: string,
  tracks: Array<Track>,
  selectedTrack?: Track,
  modal: ModalModel
}

export interface Task {
  run(): void
}

export interface TrackUser {
  id: number
  username: string
}

export interface Track {
  id: number
  kind: string
  title: string
  duration: number
  stream_url: string
  artwork_url: string,
  description: string
  user: TrackUser
}