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

    const p5Script = document.createElement('script')
    p5Script.text = `new p5($=>{particles1=[],particles2=[],noiseScale=.01/1.5,n=.1,a=.01,a2=.01;let o=0,r,e;function t($){return $.x<r&&$.y<e&&$.x>0&&$.y>0}$.setup=function(){let o=$.select("#c1");for(r=o?o.width:600,e=o?o.height:600,$.createCanvas(r,e),$.background(255),i=0;i<2e3;i++)particles1.push($.createVector(0,$.random(-100,e/2))),particles2.push($.createVector(0,$.random(e/2,e+100)))},$.draw=function(){for(i=0;i<500;i++)p1=particles1[i],p2=particles2[i],$.strokeWeight($.map($.sin(a+a2),-1,1,0,$.random(3,$.random(5,$.random(10,15))))),$.stroke(0,0,$.random(0,255),$.map($.sin(a),-1,1,10,200)),$.point(p1.x,p1.y),o=$.random($.random(100,250),255),$.stroke(o,o-50,0,$.map($.sin(a),-1,1,10,200)),$.point(p2.x,p2.y),n=$.noise(p1.x*noiseScale,p1.y*noiseScale,$.frameCount/noiseScale),a=$.TAU*n,n2=$.noise(p2.x*noiseScale,p2.y*noiseScale,$.frameCount/noiseScale),a2=$.TAU*n2,p1.x+=-($.cos(a)-$.random(-.5,.5)),p1.y+=$.sin(a),p2.x+=-($.cos(a2)-$.random(-.5,.5)),p2.y+=$.sin(a2),t(p1)||(p1.x=0,p1.y=$.random(-100,e/2)),t(p2)||(p2.x=0,p2.y=$.random(e/2,e+100))}},"c1");`
    document.body.appendChild(p5Script)
    // TODO: demount or clean of new p5 object?
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
    return (
      <FullScreenContainer
        viewportHeight={viewportHeight}
        itemProp="image"
        itemScop
        itemType="http://schema.org/ImageObject"
      >
        {false && imgJSX}
        <div id="c1" style={{ width: '100%', height: '100%' }}></div>
        <Helmet>
          <script
            type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js"
          ></script>
        </Helmet>
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
  portraitImgSet: constPropTypes.imgSet,
  viewportHeight: PropTypes.string,
}

export default LeadingImage
