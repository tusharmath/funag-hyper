/**
 * Created by tushar on 03/12/16.
 */
import {VNode} from 'snabbdom'
import * as O from 'observable-air'
import {Action} from './events'

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

export interface EventEmitter {
  listen<T>(val: T): void
  of(scope: string): EventEmitter
  source<T>(): O.Observable<T>
}

export interface Model {
  showSearch: boolean,
  searchQuery: string,
  tracks: Array<Track>,
  selectedTrack?: Track,
  modal: ModalModel,
  audio: AudioModel,
  drawer: DrawerModel
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

export interface Reducer<T> {
  (m: T): T
}

export interface Draggable {
  completion: number
  start: number
  isMoving: boolean
  length: number
}

export interface ModalModel {
  hide: boolean
  hidden: boolean
}

export enum MediaStatus {
  PLAYING, PAUSED, ERRORED, LOADING
}

export interface AudioModel {
  status: MediaStatus,
  track?: Track
}

export interface ReducerLense<A, B> {
  (r: Reducer<A>): Reducer<B>
}
export interface ActionReducer<A, R> {
  (a: Action<A>): Reducer<R>
}

export interface TrackModalModel {
  track: Track
  audio: AudioModel
}

export interface DrawerModel extends Draggable {
}