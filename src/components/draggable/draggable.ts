/**
 * Created by tushar on 04/12/16.
 */
import * as R from 'ramda'
import * as O from 'observable-air'

export const TRANSLATE_END = -1.05
export interface DragModel {
  completion: number,
  isMoving: boolean
  start: number,
  size: number
}

export const clientX = (ev: TouchEvent) => ev.changedTouches[0].clientX
export const clientY = (ev: TouchEvent) => ev.changedTouches[0].clientY
export const bcrWidth = R.curry((selector: string, target: HTMLElement) => target.querySelector(selector).getBoundingClientRect().width)
export const bcrHeight = R.curry((selector: string, target: HTMLElement) => -target.querySelector(selector).getBoundingClientRect().height)

type Coordinate = typeof clientX | typeof clientY
type Size = (el: HTMLElement) => number
type Direction = {coordinate: Coordinate, size: Size}

export const init = R.curry((dir: Direction,
                             touchStart: TouchEvent): DragModel => {
  return {
    completion: 0,
    isMoving: true,
    start: dir.coordinate(touchStart),
    size: dir.size(touchStart.currentTarget as HTMLElement)
  }
})

export const completion = (size: number, start: number, current: number) => (current - start) / size

export const touchStartR = R.curry(
  (dir: Direction, touchStart: TouchEvent) => R.always(init(dir, touchStart))
)

export const touchMoveR = R.curry((dir: Direction, touchMove: TouchEvent, model: DragModel) => {
  const value = completion(model.size, model.start, dir.coordinate(touchMove))
  if (value > 0) return R.assoc('completion', 0, model)
  return R.assoc('completion', value, model)
})

export const touchEndR = R.curry((dir: Direction, touchEnd: TouchEvent, state: DragModel) => {
  const value = completion(state.size, state.start, dir.coordinate(touchEnd))
  if (value < 0) return R.merge(state, {completion: TRANSLATE_END, isMoving: false})
  return R.assoc('isMoving', false, state)
})

export const update = (dir: Direction, source: {
  touchStart$: O.IObservable<TouchEvent>,
  touchMove$: O.IObservable<TouchEvent>,
  touchEnd$: O.IObservable<TouchEvent>,
}) => {
  type TReducer = (t: DragModel) => DragModel
  return O.merge(
    O.map<TouchEvent, TReducer>(touchStartR(dir), source.touchStart$),
    O.map<TouchEvent, TReducer>(touchEndR(dir), source.touchEnd$),
    O.map<TouchEvent, TReducer>(touchMoveR(dir), source.touchMove$)
  )
}

export const Vertical = (selector: string) => ({coordinate: clientY, size: bcrHeight(selector)})
export const Horizontal = (selector: string) => ({coordinate: clientX, size: bcrWidth(selector)})
