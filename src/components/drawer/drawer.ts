/**
 * Created by tushar on 12/12/16.
 */
import * as  t from '../../tasks'
import * as icon from '../icon-button/icon-button'
import * as O from 'observable-air'
import * as Oe from 'observable-air/extra'
import * as R from 'ramda'
import {Action, select} from '../../events'
import {DrawerModel, EventEmitter, Reducer} from '../../types'
import {h, clientX} from '../../lib'
import {VNode} from 'snabbdom'

export const MAX_COMPLETION = 104
export const init = (): DrawerModel => {
  return {
    touchStart: 0,
    completion: MAX_COMPLETION,
    width: -1,
    isMoving: false
  }
}

export const view = (ev: EventEmitter, model: DrawerModel, children: VNode[]) => {
  const closeEV = ev.of('close')
  return h('div.drawer', {
    on: {
      touchstart: ev.of('touchStart').listen,
      touchmove: ev.of('touchMove').listen,
      touchend: ev.of('touchEnd').listen
    },
    class: {
      'drawer--active': model.completion < MAX_COMPLETION,
      'drawer--no-anime': model.isMoving
    }
  }, [
    h('div.drawer-overlay', {
      style: {opacity: `${(MAX_COMPLETION - model.completion) / 100}`},
      on: {click: closeEV.listen}
    }),
    h('div.drawer-container', {
      style: {transform: `translateX(${-model.completion}%)`}
    }, [
      h('div.drawer-header', [
        h('div.drawer-close', [
          icon.view('close', closeEV)
        ]),
        h('div.drawer-title', ['Tushar Mathur'])
      ]),
      h('div.drawer-content', children)
    ])
  ])
}
export const resetCompletion = (model: DrawerModel) => model.completion > 50 ? MAX_COMPLETION : 0
export const currentCompletion = (model: DrawerModel, touch: TouchEvent) => (model.touchStart - clientX(touch)) / model.width * 100
export const getTargetWidth = (ev: Event) => (ev.target as HTMLElement).getBoundingClientRect().width

export const update = (source: O.Observable<Action<any>>) => {
  const actions = select(source)
  return O.merge(
    O.map(
      R.curry((touch: TouchEvent, model: DrawerModel) => {
        const completion = resetCompletion(model)
        return R.merge(model, {isMoving: false, completion})
      }) as {(touch: TouchEvent): Reducer<DrawerModel>},
      actions('touchEnd')
    ),
    O.map(
      R.curry((touch: TouchEvent, model: DrawerModel) => {
        const completion = currentCompletion(model, touch)
        return R.merge(model, {completion: Math.max(completion, 0)})
      }) as {(touch: TouchEvent): Reducer<DrawerModel>},
      O.multicast(Oe.rafThrottle(actions('touchMove')))
    ),
    O.map(
      R.curry((touch: TouchEvent, model: DrawerModel) => {
        const xPos = clientX(touch)
        const width = getTargetWidth(touch)
        return R.merge(model, {isMoving: true, touchStart: xPos, touchMove: xPos, width})
      }) as {(touch: TouchEvent): Reducer<DrawerModel>},
      actions('touchStart')
    ),
    O.map(
      R.always(R.assoc('completion', MAX_COMPLETION)),
      actions('close')
    )
  )
}

export const tasks = (source: O.Observable<Action<any>>) => {
  const actions = select(source)
  return O.map(
    t.preventDefault,
    actions('touchMove')
  )
}