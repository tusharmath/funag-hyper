/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../lib'

export const view = (url?: string) => {
  return h('div.artwork', [
    url ? h('img', {props: {src: url}}) : h('div.placeholder', [
      h('i.material-icons', ['music_note'])
    ])
  ])
}