//TODO: EXAMPLE
//- using layouts => normal, nested
//- using middleware => normal, nested
//- using link 'foo/bar'
//- using hastag

import type { TMurypRouteList } from '@muryp/routesJs/type'

const ROUTES: TMurypRouteList = {
  404: {
    _render: '404-global',
    _callback: function () {
      return '404-global-cb'
    },
  },
  '_home': {
    _render: 'home',
    _callback: function () {
      console.log('hello from home')
      return 'home-cb'
    },
  },
  'about': {
    _render: 'about',
    _callback: function () {
      console.log('hello from about')
      return 'home-cb'
    },
  },
  'user/{id}': {
    _render: function (Args) {
      const url = Args.url
      const params = Args.Args?.id
      const variable = Args.variable?.foo
      return [url, params, variable].join('-')
    },
    _callback: function () {
      return 'home'
    },
  },
  'private/{pass}': {
    _middleware: ({ Args }) => {
      if (Args?.pass === 'allow') {
        return true
      }
      return false
    },
    secret: {
      _render: 'secret',
      _callback: function () {
        return 'secret-cb'
      },
    },
    detail: {
      _render: 'detail',
      _callback: function () {
        return 'detail-cb'
      },
    },
  },
}

ROUTES.post = {
  404: {
    _render: '404-post',
    _callback: function () {
      return '404-post-cb'
    },
  },
  'list': {
    _render: 'post-list',
    _callback: function () {
      return 'post-list-cb'
    },
  },
  'edit/{id}': {
    _render: ({ Args, url }) => {
      return [Args?.id, url].join('-')
    },
    _callback: ({ Args, url }) => {
      return [Args?.id, url, 'callback'].join('-')
    },
  },
  'detail/{id}': {
    _render: ({ Args, url }) => {
      return ['detail', Args?.id, url].join('-')
    },
    _callback: ({ Args, url }) => {
      return ['detail', Args?.id, url, 'callback'].join('-')
    },
  },
}

export default ROUTES