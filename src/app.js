import AppShell from './containers/app-shell'
import PropTypes from 'prop-types'
import React from 'react'
import getRoutes from './routes'
import colors from './constants/colors'
import typography from './constants/typography'
import releaseBranchConst from '@twreporter/core/lib/constants/release-branch'
import { Provider } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${typography.font.size.base};
  }
  body {
    overflow-x: hidden;
    overflow-y: auto;
    letter-spacing: 0.4px;
    line-height: 1.4;
    font-family: ${typography.font.fontFamily.default};
    abbr[title], abbr[data-original-title] {
      border-bottom: 0;
    }
    *, :before, :after {
      box-sizing: border-box;
    }

    a, a:link, a:visited {
      text-decoration: none;
    }

    img {
      vertical-align: middle;
    }

    img.img-responsive {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .hidden {
      display: none !important;
    }

    .container {
      line-height: 1.8;
    }

    .no-hover {
      border-bottom: 0 !important;
      &:after {
          display: none;
      }
      &:hover:after {
          width: 0;
          display: none;
      }
    }

    .text-justify {
      text-align: justify;
    }

    .text-center {
      text-align: center;
    }

    .center-block {
      display:block;
      margin-left:auto;
      margin-right:auto;
    }

    .visible-print {
      display: none;
    }

    figure, p {
      margin: 0;
    }

    strong {
      font-weight: ${typography.font.weight.bold};
    }

    @media print {
      .hidden-print {
        display: none !important;
      }
      .visible-print {
        display: block !important;
      }
      a[href]:after {
        content: '';
      }
    }
  }

  ::selection {
    background-color: ${colors.secondaryColor};
    color: ${colors.white};
  }
`

export default class App extends React.Component {
  static propTypes = {
    reduxStore: PropTypes.object,
    releaseBranch: PropTypes.oneOf([
      releaseBranchConst.master,
      releaseBranchConst.staging,
      releaseBranchConst.release,
    ]),
  }

  render() {
    const routes = getRoutes()
    const { reduxStore, releaseBranch } = this.props

    return (
      <Provider store={reduxStore}>
        <Route
          render={props => {
            return (
              <AppShell location={props.location} releaseBranch={releaseBranch}>
                <Switch>
                  {routes.map((route, routeIndex) => (
                    <Route key={`route-${routeIndex}`} {...route} />
                  ))}
                </Switch>
              </AppShell>
            )
          }}
        />
        <GlobalStyle />
      </Provider>
    )
  }
}
