/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import {VNode} from 'snabbdom'
import {Task} from './types'
const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
])
export class DomPatch implements Task {
  static node = document.getElementById('app')
  private __node: VNode

  constructor (node: VNode) {
    this.__node = node
  }

  run () {
    DomPatch.node = patch(DomPatch.node, this.__node)
  }
}

export class Request implements Task {
  readonly response$: O.IObservable<any>
  private observer: O.IObserver<any>
  private oReq: XMLHttpRequest

  constructor (url: string) {
    this.response$ = new O.Observable((observer) => {
      this.observer = observer
      return () => this.oReq.abort()
    })
    this.oReq = new XMLHttpRequest()
    this.oReq.addEventListener("load", this.onResponse.bind(this))
    this.oReq.addEventListener("error", this.onError.bind(this))
    this.oReq.open('GET', url)
  }

  onResponse () {
    this.observer.next(JSON.parse(this.oReq.responseText))
    this.observer.complete()
  }

  onError (err: Error) {
    this.observer.error(err)
    this.observer.complete()
  }

  run () {
    this.oReq.send()
  }
}

export const dom = (node: VNode) => new DomPatch(node)
export const request = (url: string) => new Request(url)