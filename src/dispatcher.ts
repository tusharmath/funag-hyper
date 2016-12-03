/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import {IDispatcher} from './types'

class Action<T> {
  constructor (public readonly type: string, public readonly value: T) {
  }

  static of<T> (type: string, value: T) {
    return new Action(type, value)
  }
}

export class RootDispatcher implements IDispatcher {
  private subject = O.subject()

  listen<T> (val: T): void {
    this.subject.next(val)
  }

  source () {
    return this.subject
  }
}

export class Dispatcher implements IDispatcher {
  constructor (private scope: string, private parent: IDispatcher) {
    this.listen = this.listen.bind(this)
  }

  of (scope: string): IDispatcher {
    return new Dispatcher(scope, this)
  }

  listen <T> (val: T): void {
    this.parent.listen(new Action(this.scope, val))
  }

  source () {
    return this.parent.source()
  }
}

export const dispatcher = (scope: string) => new Dispatcher(scope, new RootDispatcher())
export const select = <T> (scope: string) => {
  return (source: O.IObservable<Action<T>>) => {
    return O.map(x => x.value, O.filter(x => x.type === scope, source))
  }
}