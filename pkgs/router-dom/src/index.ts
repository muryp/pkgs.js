import checkLinks from './checkLinks'
import { TMurypRouteCallback, TMurypRouteArgs, TFnArgs } from './types'

export default async function (Args: TMurypRouteArgs) {
  const url = window.location.href
  const separatorUrl = Args.isUseHastag ? '^#/' : ''
  let FnArgs: TFnArgs = {
    url,
    variable: Args?.variable,
  }
  const midleware = Args.global._middleware
  if (midleware) {
    if (midleware(FnArgs) === false) {
      return
    }
  }

  const getRoutes = checkLinks({ url, separatorUrl, routers: Args.routers })
  if (getRoutes) {
    FnArgs.params = getRoutes?.Params

    const midleware = getRoutes.MiddleWares
    if (midleware) {
      // const isNext = true
      for (let i = 0; i < midleware.length; i++) {
        const middleware = midleware[i]
        const isNext = middleware(FnArgs)
        if (!isNext) {
          return
        }
      }
    }

    if (getRoutes.ARGS._callback || getRoutes.ARGS._render) {
      const TARGET_ID =
        (getRoutes.ARGS?._target as string) || Args.global?._target

      if (TARGET_ID) {
        const TARGET = document.getElementById(TARGET_ID)
        if (TARGET) {
          const RENDER = getRoutes.ARGS._render
          let CONTENT = ''
          if (typeof RENDER === 'function') {
            CONTENT = RENDER(FnArgs)
          }
          if (typeof RENDER === 'string') {
            CONTENT = RENDER
          }
          const LAYOUT = getRoutes.ARGS._layouts
          if (LAYOUT) {
            if (typeof LAYOUT === 'function') {
              CONTENT = LAYOUT({ ...FnArgs, childern: CONTENT })
            } else {
              const getImport = await LAYOUT
              CONTENT = getImport.default({ ...FnArgs, childern: CONTENT })
            }
          }
          TARGET.innerHTML = CONTENT
        }
      }

      const CALLBACK = getRoutes.ARGS._callback as
        | TMurypRouteCallback
        | undefined
      if (CALLBACK) {
        if (typeof CALLBACK === 'object') {
          const getImport = await CALLBACK
          const cb = getImport.default
          cb(FnArgs)
        } else {
          CALLBACK(FnArgs)
        }
      }

      const TARGET_ID_SCROLL = new URL(url).hash
        .replace(new RegExp(separatorUrl), '')
        .split('#')[1]
      // goto id hash
      if (TARGET_ID_SCROLL) {
        document.getElementById(TARGET_ID_SCROLL)!.scrollIntoView()
      }
    }
  } else {
    const RENDER = Args.routers[404]._render as string
    const CB = Args.routers[404]._callback
    const ID = Args.global._target
    if (ID && RENDER) {
      document.getElementById(ID)!.innerHTML = RENDER
    }
    if (typeof CB === 'function') {
      CB({ url })
    }
  }
}
