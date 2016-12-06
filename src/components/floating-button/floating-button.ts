/**
 * Created by tushar on 04/12/16.
 */
import {h} from '../../lib'

export const view = (name: string, isLoading = false) => {
  return h('div', [
    h('button.floating-button', [
      h('i.material-icons', [name]),
    ]),
    !isLoading ? '' : h('div.floating-button-loader')
  ])
}