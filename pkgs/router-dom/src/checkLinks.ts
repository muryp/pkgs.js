import { TMurypRouteList, TMurypRouteListSub, TMurypRouteSub } from './types'

type TArgs = {
  url: string
  separatorUrl: string
  routers: TMurypRouteList
}

export default function ({ url, separatorUrl, routers }: TArgs) {
  const PATH = new URL(url).hash
    .replace(/\?.*/, '')
    .replace(new RegExp(separatorUrl), '')
    .replace(/#.*/, '')
    .split('/')
  if (PATH[0] === '') {
    return { ARGS: routers._home }
  }
  let ARGS: TMurypRouteSub | TMurypRouteListSub | undefined
  let Params: { [key: string]: any } = {}
  if (PATH.length <= 1) {
    const NewArgs = routers[PATH[1]] as TMurypRouteSub
    ARGS = {
      ...ARGS,
      ...NewArgs,
    }
  } else {
    let PATH_OLD = ''
    for (let i = 0; i < PATH.length; i++) {
      const KEY = PATH_OLD + '.' + PATH[i]
      if (routers[KEY]) {
        PATH_OLD = PATH_OLD + '.' + PATH[i]
        const NewArgs = routers[PATH[1]] as TMurypRouteSub
        ARGS = {
          ...ARGS,
          ...NewArgs,
        }
      } else {
        const getKey = Object.keys(routers[PATH_OLD])
        for (let j = 0; j < getKey.length; j++) {
          const getParams = getKey[j].match(/\{(.*)\}/)
          if (getParams) {
            Params[getParams[1]] = PATH[j]
            PATH_OLD = PATH_OLD + '.' + getKey[j]
            const NewArgs = routers[PATH[1]] as TMurypRouteSub
            ARGS = {
              ...ARGS,
              ...NewArgs,
            }
            break
          } else {
            const notFound = ARGS?.[404] as TMurypRouteListSub | TMurypRouteSub
            ARGS = undefined
            ARGS = { 404: notFound }
          }
        }
      }
    }
  }
  if (ARGS?._callback) {
    return { ARGS: ARGS as TMurypRouteSub, Params }
  } else {
    if (ARGS?.[404]) {
      return { ARGS: ARGS?.[404] as TMurypRouteSub, Params }
    }
    return false
  }
}
