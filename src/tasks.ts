/**
 * Created by tushar on 03/12/16.
 */
import * as O from 'observable-air'
import {VNode} from 'snabbdom'
import {Task, EventEmitter, Track} from './types'
import {TOKEN} from './lib'
const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
])

export class DomPatch implements Task {
  static node: HTMLElement
  private __node: VNode

  constructor (node: VNode) {
    this.__node = node
  }

  run () {
    DomPatch.node = patch(DomPatch.node || document.getElementById('app'), this.__node)
  }
}

export class Request implements Task {
  private observer: O.Observer<any>
  private oReq: XMLHttpRequest

  constructor (url: string, dispatcher: EventEmitter) {
    const response$ = O.multicast(O.create((observer) => {
      this.observer = observer
      return () => this.oReq.abort()
    }))
    this.oReq = new XMLHttpRequest()
    this.oReq.addEventListener("load", this.onResponse.bind(this))
    this.oReq.addEventListener("error", this.onError.bind(this))
    this.oReq.open('GET', url)
    dispatcher.listen(response$)
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

export class PreventDefault implements Task {
  constructor (private event: Event) {
  }

  run (): void {
    this.event.preventDefault()
  }
}

export class PlayTrack implements Task {
  constructor (private audio: HTMLAudioElement, private track: Track) {
  }

  run (): void {
    const src = this.track.stream_url + `?client_id=${TOKEN}`
    if (this.audio.src === src) return
    else {
      this.audio.src = ''
      this.audio.load()
      this.audio.src = src
      this.audio.play()
    }
  }
}

export class Audio implements Task {
  private audio = document.createElement('audio') as HTMLAudioElement

  constructor (private d: EventEmitter) {
  }

  run (): void {
    this.d.listen(this.audio)
  }

  events (event: string) {
    return O.fromDOM(this.audio, event)
  }
}

export const dom = (node: VNode) => new DomPatch(node)
export const request = (d: EventEmitter, url: string) => new Request(url, d)
export const preventDefault = (ev: Event) => new PreventDefault(ev)
export const play = (audio: HTMLAudioElement, track: Track) => new PlayTrack(audio, track)
export const audio = (events: EventEmitter) => new Audio(events)
