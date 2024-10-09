import { TMurypGlobalArgs } from '../../src/types'

export const global: TMurypGlobalArgs = {
  _middleware: () => {
    return false
  },
  _layouts: ({ childern }) => {
    return `global-layouts-${childern}`
  },
}
