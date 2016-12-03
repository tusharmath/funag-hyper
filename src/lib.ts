/**
 * Created by tushar on 03/12/16.
 */

import {Hyperscript} from './types'
import * as O from 'observable-air'
import * as R from 'ramda'

export const h = require('snabbdom/h') as Hyperscript
export const targetValue = R.compose(
  O.skipRepeats(R.identity),
  O.map((ev: Event) => (ev.target as HTMLInputElement).value)
)