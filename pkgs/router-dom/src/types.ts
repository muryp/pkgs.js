type TObj = {
  [key: string]: string
}
export type TFnArgs = {
  Args?: TObj
  url: string
  variable?: TObj
  params?: TObj
}

export type TMurypRouteCallback =
  | Promise<{
      default: (Args: TFnArgs) => void
    }>
  | ((Args: TFnArgs) => void)

type TRender =
  | string
  | ((Args: TFnArgs) => string)
  | Promise<{ default: (Args: TFnArgs) => string }>

interface TFnLayout extends TFnArgs {
  childern: string
}
type TLayouts =
  | ((Args: TFnLayout) => string)
  | Promise<{ default: (Args: TFnLayout) => string }>

export type TMurypRouteSub = {
  _target?: string
  _layouts?: TLayouts
  _render?: TRender
  _callback: TMurypRouteCallback
  404?: TMurypRouteSub
  _middleware?: TMurypMiddleware
}
export type TMurypRouteListSub = {
  [key: string]:
    | TMurypRouteSub
    | TMurypRouteListSub
    | { _middleware?: TMurypMiddleware }
}
export interface TMurypRouteList extends TMurypRouteListSub {
  404: TMurypRouteSub
  _home: TMurypRouteSub
}
export type TMurypMiddleware = (Args: TFnArgs) => boolean
export type TMurypGlobalArgs = {
  _target?: string
  _layouts?: TLayouts
  _middleware?: TMurypMiddleware
}
export type TMurypRouteArgs = {
  routers: TMurypRouteList
  global: TMurypGlobalArgs
  variable?: {
    [key: string]: any
  }
  isUseHastag?: boolean
}
