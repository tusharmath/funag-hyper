/**
 * Created by tushar on 03/12/16.
 */

import * as O from 'observable-air'
import * as t from './tasks'
import {h} from './hyperscript'
import * as toolbar from './components/toolbar'

export function main () {
  return O.of(t.dom(h('div.app', [
    toolbar.view()
  ])))
}

O.forEach(t => t.run(), main())
