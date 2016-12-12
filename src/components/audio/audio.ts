/**
 * Created by tushar on 12/12/16.
 */
import * as O from 'observable-air'
import * as R from 'ramda'
import {Audio} from '../../tasks'
import {MediaStatus} from '../../types'

export const first = O.slice(0, 1)
export const update = (audioT: Audio) => {
  const getPlaying$ = R.compose(
    O.switchLatest,
    O.map(() => first(audioT.events('timeupdate')))
  )
  return O.merge(
    O.map(
      R.always(R.assoc('status', MediaStatus.LOADING)),
      audioT.events('play')
    ),
    O.map(
      R.always(R.assoc('status', MediaStatus.PLAYING)),
      getPlaying$(audioT.events('play'))
    ),
    O.map(
      R.always(R.assoc('status', MediaStatus.PAUSED)),
      getPlaying$(audioT.events('ended'))
    )
  )
}