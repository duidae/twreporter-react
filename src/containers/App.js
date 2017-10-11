'use strict'
import React, { PureComponent } from 'react'
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'
// import locale data
import { addLocaleData, IntlProvider } from 'react-intl'
import { connect } from 'react-redux'

addLocaleData(enLocaleData)
addLocaleData(zhLocaleData)
let currentLocale = 'zh-Hant'

class App extends PureComponent {
  getChildContext() {
    return { location: this.props.location }
  }

  componentWillMount() {
    // set current locale
    if (process.env.BROWSER) {
      currentLocale = navigator.language
      addLocaleData({
        locale: navigator.language,
        parentLocale: navigator.language.split('-')[0]
      })
    }
  }

  render() {
    return (
      <IntlProvider locale={currentLocale} defaultLocale="zh-Hant">
        {this.props.children}
      </IntlProvider>
    )
  }
}

App.childContextTypes = {
  location: React.PropTypes.object,
  device: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    header: state.header,
    device: state.device
  }
}

export default connect(mapStateToProps)(App)
