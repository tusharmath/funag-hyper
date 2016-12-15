/**
 * Created by tushar on 15/12/16.
 */
import {h} from '../../lib'

export const view = () => {
  return [
    h('button.drawer-nav-item', [
      h('i.material-icons', ['favorite_border']),
      h('span.drawer-nav-item-title', ['Favourites'])
    ]),
    h('button.drawer-nav-item', [
      h('i.material-icons', ['queue_music']),
      h('span.drawer-nav-item-title', ['Playlists'])
    ]),
    h('button.drawer-nav-item', [
      h('i.material-icons', ['face']),
      h('span.drawer-nav-item-title', ['Me'])
    ]),
    h('button.drawer-nav-item', [
      h('i.material-icons', ['settings']),
      h('span.drawer-nav-item-title', ['Settings'])
    ])
  ]
}