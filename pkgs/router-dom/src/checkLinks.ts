import { TMurypRouteList, TMurypRouteListSub, TMurypRouteSub } from './types'

type TArgs = {
  url: string
  separatorUrl: string
  routers: TMurypRouteList
}

export default function ({ url, separatorUrl, routers }: TArgs) {
  const PATH = new URL(url).hash
    .replace(new RegExp(separatorUrl), '')
    .replace(/\?.*/, '')
    .replace(/#.*/, '')
    .split('/')

  if (PATH[0] === '') {
    return { ARGS: routers._home }
  }

  let ARGS: TMurypRouteSub | TMurypRouteListSub | undefined
  const MiddleWares = []
  let Params: { [key: string]: any } = {}

  const NewArgs = routers[PATH[0]] as TMurypRouteSub
  if (NewArgs) {
    const MiddleWare = NewArgs?._middleware
    if (MiddleWare) {
      MiddleWares.push(MiddleWare)
    }
    ARGS = {
      ...ARGS,
      ...NewArgs,
    }
  }

  if (PATH.length > 1) {
    for (let i = 1; i < PATH.length; i++) {
      let isParamsArgs = ''
      for (let KEY in ARGS) {
        const isParams = KEY.match(/{(.*?)}/)
        if (isParams) {
          isParamsArgs = isParams[1]
        }
      }

      const PATH_NAME = PATH[i]
      const NewArgs = ARGS![PATH_NAME as '_callback'] as TMurypRouteSub
      if (NewArgs) {
        const MiddleWare = NewArgs?._middleware
        if (MiddleWare) {
          MiddleWares.push(MiddleWare)
        }

        ARGS = {
          ...ARGS,
          ...NewArgs,
        }
      } else if (isParamsArgs !== '') {
        Params[isParamsArgs[1]] = PATH[i]

        const NewArgs_ = ARGS![
          `{${isParamsArgs}}` as '_callback'
        ] as TMurypRouteSub
        const MiddleWare = NewArgs_?._middleware
        if (MiddleWare) {
          MiddleWares.push(MiddleWare)
        }

        ARGS = {
          ...ARGS,
          ...NewArgs_,
        }
      }
    }
  }
  if (ARGS?._callback || ARGS?._render) {
    return { ARGS: ARGS as TMurypRouteSub, Params, MiddleWares }
  } else {
    if (ARGS?.[404]) {
      return { ARGS: ARGS?.[404] as TMurypRouteSub, Params }
    }
    return false
  }
}
