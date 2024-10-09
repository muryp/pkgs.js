// sum.test.js
import { expect, test } from 'vitest'
import transformObj from '../src/transformUrlToObj'
import ROUTES from './helper/routes'

const result = transformObj(ROUTES)
test('tranform object key url', () => {
  expect('function').eq(typeof result.private['{pass}'].secret['_callback'])
})
test('tranform object key url', () => {
  expect('function').eq(typeof result.private['{pass}'].secret['_callback'])
})
