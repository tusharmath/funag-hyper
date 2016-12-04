/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'

const bg = (url: string) => ({
  backgroundImage: `url(${url.replace('-large', '-t500x500')})`
})
export const view = (url?: string) => {
  return h('div.artwork-large', [
    url ? h('div.img-holder', {style: bg(url)}) : h('div.placeholder', [
      h('i.material-icons', ['music_note'])
    ])
  ])
}
