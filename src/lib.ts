/**
 * Created by tushar on 03/12/16.
 */
import {Hyperscript} from './types'
import * as O from 'observable-air'
import * as R from 'ramda'

export const h = require('snabbdom/h') as Hyperscript
export const targetValue = R.compose(
  O.skipRepeats(R.identity),
  O.map((ev: Event) => (ev.target as HTMLInputElement).value)
)
export const durationFormat = (time: number) => {
  const mins = Math.floor(time / 60000)
  const secs = Math.round((time - mins * 60000) / 1000)
  return `${mins}:${secs.toString().length < 2 ? secs + '0' : secs}`
}
export const TOKEN = '1862b9bf02ed7c80d0f545f835ad8773'
export const clientX = (touch: TouchEvent) => touch.changedTouches[0].clientX
export const clientY = (touch: TouchEvent) => touch.changedTouches[0].clientY
export const getTargetWidth = (ev: Event) => (ev.target as HTMLElement).getBoundingClientRect().width
export const getTargetHeight = (ev: Event) => (ev.target as HTMLElement).getBoundingClientRect().height
