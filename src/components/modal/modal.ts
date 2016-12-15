/**
 * Created by tushar on 04/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import * as t from '../../tasks'
import {EventEmitter, ModalModel, Reducer} from '../../types'
import {h, clientY, getTargetHeight} from '../../lib'
import {select} from '../../events'
import {VNode} from 'snabbdom'

export const MAX_COMPLETION = 104
export const currentCompletion = (model: ModalModel, touch: TouchEvent) => (clientY(touch) - model.start) / model.length * 100
export const resetCompletion = (model: ModalModel) => model.completion > 50 ? MAX_COMPLETION : 0
export const view = (d: EventEmitter, content: VNode | string, model: ModalModel) => {
  return h('div.modal', {
    'class': {
      'modal--active': model.completion < MAX_COMPLETION,
      'modal--no-anime': model.isMoving
    },
    on: {
      touchstart: d.of('touchStart').listen,
      touchend: d.of('touchEnd').listen,
      touchmove: d.of('touchMove').listen
    }
  }, [
    h('div.modal-overlay', {
      style: {
        opacity: `${(MAX_COMPLETION - model.completion) / 100}`
      },
      on: {click: d.of('overlayClick').listen}
    }),
    h('div.modal-content', {
      style: {transform: `translateY(${model.completion}%)`}
    }, [content])
  ])
}

export const init = (isVisible = false): ModalModel => ({
  start: 0,
  completion: MAX_COMPLETION,
  isMoving: false,
  length: 0
})

export const update = (source$: O.Observable<any>) => {
  const actions = select(source$)
  return O.merge(
    O.map(
      R.curry((touch: TouchEvent, model: ModalModel) => {
        const start = clientY(touch)
        const length = getTargetHeight(touch, '.modal-content')
        return R.merge(model, {isMoving: true, start, length})
      }) as {(t: TouchEvent): Reducer<ModalModel>},
      actions('touchStart')
    ),

    O.map(
      R.curry((touch: TouchEvent, model: ModalModel): ModalModel => {
        const completion = currentCompletion(model, touch)
        return R.merge(model, {completion: Math.max(completion, 0)})
      }) as {(t: TouchEvent): Reducer<ModalModel>},
      actions('touchMove')
    ),

    O.map(
      R.curry((touch: TouchEvent, model: ModalModel): ModalModel => {
        const completion = resetCompletion(model)
        return R.merge(model, {isMoving: false, completion})
      }) as {(t: TouchEvent): Reducer<ModalModel>},
      actions('touchEnd')
    ),
    O.map(
      R.always(R.assoc('completion', MAX_COMPLETION)),
      actions('overlayClick')
    )
  )
}

export const tasks = (source$: O.Observable<any>) => {
  const actions = select(source$)
  return O.map(
    t.preventDefault,
    actions('touchMove')
  )
}