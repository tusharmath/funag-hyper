/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'
import {VNode} from 'snabbdom'
import {IDispatcher} from '../../types'

const onRemove = (e: any, cb: Function) => {
  let count = 0
  let onAnimationEnd = () => {
    if (++count === 2) cb()
  }

  e.elm.addEventListener('animationend', onAnimationEnd)
  e.elm.classList.add('animate-out')
}
export const view = (d: IDispatcher, content: VNode) =>
  h('div.modal', {
    hook: {remove: onRemove}
  }, [
    h('div.overlay', {on: {click: d.listen}}),
    h('div.content', [content])
  ])
