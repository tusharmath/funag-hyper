/**
 * Created by tushar on 04/12/16.
 */

import {Track} from '../types'
import {h} from '../lib'

export const view = (track: Track) => {
  return h('li', [
    track.title
  ])
}