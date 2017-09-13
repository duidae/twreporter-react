/* global __DEVELOPMENT__, __CLIENT__, __DEVTOOLS__ */
'use strict'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(history, initialState) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)
  const middlewares = [ reduxRouterMiddleware, thunkMiddleware ]

  let finalCreateStore

  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools')
    const DevTools = require('../containers/DevTools').default
    finalCreateStore = compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middlewares)(_createStore)
  }

  const store = finalCreateStore(rootReducer, initialState)

  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
