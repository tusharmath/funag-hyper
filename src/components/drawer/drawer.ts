/**
 * Created by tushar on 12/12/16.
 */
import {h} from '../../lib'

export const view = () => {
  return h('div.drawer', [
    h('div.drawer-overlay'),
    h('div.drawer-container', [
      h('div.drawer-header', ['Tushar Mathur']),
      h('div.drawer-content', [
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
      ])
    ])
  ])
}