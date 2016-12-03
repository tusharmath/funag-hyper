/**
 * Created by tushar on 03/12/16.
 */


import {VNode} from 'snabbdom'
const snabbdom = require('snabbdom')

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
])

export class DomPatch {
  static node = document.getElementById('app')
  private __node: VNode

  constructor (node: VNode) {
    this.__node = node
  }

  run () {
    DomPatch.node = patch(DomPatch.node, this.__node)
  }
}

export const dom = (node: VNode) => new DomPatch(node)