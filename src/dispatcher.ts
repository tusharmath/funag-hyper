/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import {ISource} from './types'

export class Action<T> {
  constructor (public readonly type: string, public readonly value: T) {
  }

  static of<T> (type: string, value: T) {
    return new Action(type, value)
  }
}

export class RootDispatcher implements ISource {
  private __source: O.IObservable<any>
  private observer: O.IObserver<any>

  constructor () {
    this.__source = O.multicast(new O.Observable((ob) => {
      this.observer = ob
    }))
  }

  listen<T> (val: T): void {
    this.observer.next(val)
  }

  source () {
    return this.__source
  }
}

export class Dispatcher implements ISource {
  constructor (private scope: string, private parent: ISource) {
    this.listen = this.listen.bind(this)
  }

  of (scope: string): ISource {
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
export const select = R.curry(<T> (scope: string, source: O.IObservable<Action<T>>) => {
  return O.map(x => x.value, O.filter(x => x.type === scope, source))
})
export const from = R.curry((scope: string, source: ISource) => source.of(scope))
