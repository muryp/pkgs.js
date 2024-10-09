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
    //TODO: MIDDLEWARE IS ARRAY
    const midleware = getRoutes.ARGS._middleware
    if (midleware) {
      if (midleware(FnArgs) === false) {
        return
      }
    }
    if (!getRoutes.ARGS._callback) {
      if (getRoutes.ARGS._middleware) {
        const middleware = getRoutes.ARGS._middleware
        const isNext = middleware(FnArgs)
        if (!isNext) {
          return
        }
      }
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
            CONTENT = CONTENT
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
      const CALLBACK = getRoutes.ARGS._callback as TMurypRouteCallback
      if (CALLBACK) {
        if (typeof CALLBACK === 'object') {
          const getImport = await CALLBACK
          const cb = getImport.default
          cb(FnArgs)
        } else {
          CALLBACK(FnArgs)
        }
      }
    }
  } else {
    const RENDER = Args.routers[404]._render as string
    const CB = Args.routers[404]._callback as () => void
    const ID = Args.global._target
    if (ID && RENDER) {
      document.getElementById(ID)!.innerHTML = RENDER
    }
    CB()
  }
}
