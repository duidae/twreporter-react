import PropTypes from 'prop-types'
import React from 'react'
import Helmet from 'react-helmet'
import constPropTypes from '../../../constants/prop-types'
import styled from 'styled-components'
import { replaceGCSUrlOrigin } from '@twreporter/core/lib/utils/storage-url-processor'
import { getSrcSet } from '../../../utils/img'

// lodash
import get from 'lodash/get'

const _ = {
  get,
}

const FullScreenContainer = styled.div`
  width: 100vw;
  height: ${props => props.viewportHeight};
`

const ImgPlaceholder = styled.img`
  display: ${props => (props.toShow ? 'block' : 'none')};
  filter: blur(30px);
  object-fit: cover;
  opacity: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`

const StyledPicture = styled.picture`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => (props.toShow ? '1' : '0')};
  transition: opacity 1s;
`

const ImgFallback = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: ${props => {
    return `url(${_.get(props, 'url')})`
  }};
  background-position: center center;
`

class LeadingImage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isObjectFit: true,
      isLoaded: false,
      toShowPlaceholder: true,
    }
    this.onLoad = this._onLoad.bind(this)
    this._imgNode = null
    this._isMounted = false
  }

  componentDidMount() {
    this.setState({
      isObjectFit: 'objectFit' in _.get(document, 'documentElement.style'),
    })
    this._isMounted = true
    // Check if img is already loaded, and cached on the browser.
    // If cached, React.img won't trigger onLoad event.
    // Hence, we need to trigger re-rendering.
    if (this._imgNode) {
      this.onLoad()
    }

    // TODO: demount or clean of new p5 object?
    if (this.props.p5Script) {
      const p5Script = document.createElement('script')
      p5Script.text = this.props.p5Script
      document.body.appendChild(p5Script)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    this._imgNode = null
  }

  _onLoad() {
    // Progressive image
    // Let user see the blur image,
    // and slowly make the blur image clearer

    // in order to make sure users see the blur image,
    // delay the clear image rendering
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          isLoaded: true,
        })
      }
    }, 1500)

    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          toShowPlaceholder: false,
        })
      }
    }, 3000)
  }

  render() {
    const { isLoaded, isObjectFit, toShowPlaceholder } = this.state
    const { alt, imgSet, portraitImgSet, viewportHeight } = this.props

    const imgJSX = isObjectFit ? (
      <StyledPicture>
        <meta
          itemProp="url"
          content={replaceGCSUrlOrigin(_.get(imgSet, 'desktop.url'))}
        />
        <meta itemProp="description" content={alt} />
        <ImgPlaceholder
          src={replaceGCSUrlOrigin(_.get(imgSet, 'tiny.url'))}
          toShow={toShowPlaceholder}
        />
        <source
          media={'(orientation: portrait)'}
          srcSet={getSrcSet(portraitImgSet)}
        />
        <source srcSet={getSrcSet(imgSet)} />
        <StyledImg
          alt={alt}
          ref={node => {
            this._imgNode = node
          }}
          onLoad={this.onLoad}
          src={replaceGCSUrlOrigin(_.get(imgSet, 'tablet.url'))}
          toShow={isLoaded}
        />
      </StyledPicture>
    ) : (
      <ImgFallback url={replaceGCSUrlOrigin(_.get(imgSet, 'desktop.url'))} />
    )

    const p5JSX = (
      <React.Fragment>
        <Helmet>
          <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js"
          ></script>
        </Helmet>
        <div id="c1" style={{ width: '100%', height: '100%' }}></div>
      </React.Fragment>
    )

    return (
      <FullScreenContainer
        viewportHeight={viewportHeight}
        itemProp="image"
        itemScop
        itemType="http://schema.org/ImageObject"
      >
        {this.props.p5Script ? p5JSX : imgJSX}
      </FullScreenContainer>
    )
  }
}

LeadingImage.defaultProps = {
  alt: '',
  imgSet: {},
  portraitImgSet: {},
  viewportHeight: '100vh',
}

LeadingImage.propTypes = {
  alt: PropTypes.string,
  imgSet: constPropTypes.imgSet,
  p5Script: PropTypes.string,
  portraitImgSet: constPropTypes.imgSet,
  viewportHeight: PropTypes.string,
}

export default LeadingImage
