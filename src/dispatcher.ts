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
  of (scope: string): ISource {
    return this
  }

  private __source: O.Observable<any>
  private observer: O.Observer<any>

  constructor () {
    this.__source = O.multicast(O.create((ob) => {
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
export const select = R.curry((source: O.Observable<Action<any>>, scope: string) => {
  return O.map(x => x.value, O.filter(x => x.type === scope, source))
})
export const from = R.curry((scope: string, source: ISource) => source.of(scope))
export const source = (d: ISource) => d.source()
