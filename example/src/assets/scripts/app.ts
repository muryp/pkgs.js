import MurypRoutes from '@muryp/routesJs'
import transFromObj from '@muryp/routesJs/transform'
import ROUTES from './routes'
import type { TMurypGlobalArgs } from '@muryp/routesJs/type'

export const global: TMurypGlobalArgs = {
  _target: 'app',
  _middleware: () => {
    return true
  },
  _layouts: ({ childern }) => {
    return `global-layouts-${childern}`
  },
}

const routers = transFromObj(ROUTES)
const ArgsMurypRoutes = {
  routers,
  global,
  variable: {
    globalVar: 'hello from global var',
  },
  isUseHastag: true,
}

MurypRoutes(ArgsMurypRoutes)
window.onpopstate = async () => {
  MurypRoutes(ArgsMurypRoutes)
}
