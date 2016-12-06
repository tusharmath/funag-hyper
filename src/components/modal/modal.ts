/**
 * Created by tushar on 04/12/16.
 */
import * as R from 'ramda'
import * as O from 'observable-air'
import {h} from '../../lib'
import {VNode} from 'snabbdom'
import {ISource} from '../../types'
import {select} from '../../dispatcher'

export interface ModalModel {
  hide: boolean
  hidden: boolean
}

export const view = (d: ISource, content: VNode | string, model: ModalModel) => {
  return model.hidden ? '' : h('div.modal', {
    'class': {'animate-out': model.hide},
    on: {animationend: d.of('animationEnd').listen}
  }, [
    h('div.overlay', {on: {click: d.of('click').listen}}),
    h('div.content', [content])
  ])
}

export const init = (isVisible = false): ModalModel => ({
  hide: true,
  hidden: true
})

export const animationEnd = R.compose(
  O.filter((x: number) => x % 2 === 0),
  O.scan(R.add as {(a: number, b: number): number}, 0),
  O.map(R.always(1)),
  select('animationEnd')
)

const mergeR = R.flip(R.merge)

export const update = (source$: O.IObservable<any>, show$: O.IObservable<any>) => {
  const overlayClick$ = select('click', source$)
  const animationEnd$ = animationEnd(source$)

  return O.merge(
    O.map(R.always(mergeR({hide: true, hidden: false})), overlayClick$),
    O.map(R.always(mergeR({hide: false, hidden: false})), show$),
    O.map(R.always(
      R.ifElse(
        R.prop('hide'),
        R.assoc('hidden', true),
        R.identity
      )
    ), animationEnd$)
  )
}