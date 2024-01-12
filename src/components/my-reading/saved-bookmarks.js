import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import querystring from 'querystring'
import PropTypes from 'prop-types'
// @twreporters
import { Title1 } from '@twreporter/react-components/lib/title-bar'
import { CardList } from '@twreporter/react-components/lib/listing-page'
import mq from '@twreporter/core/lib/utils/media-query'
import twreporterRedux from '@twreporter/redux'
import useBookmark from '@twreporter/react-components/lib/hook/use-bookmark'
import useStore from '@twreporter/react-components/lib/hook/use-store'
import {
  SnackBar,
  useSnackBar,
} from '@twreporter/react-components/lib/snack-bar'
import requestOrigin from '@twreporter/core/lib/constants/request-origins'
import EmptyState from '@twreporter/react-components/lib/empty-state'
import { Bookmark } from '@twreporter/react-components/lib/icon'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
// components
import Pagination from '../Pagination'
// context
import { CoreContext } from '../../contexts'
// constants
import routes from '../../constants/routes'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'

const BOOKMARK_PER_PAGE = 10

const _ = {
  get,
  map,
  filter,
}

const Container = styled.div`
  width: 100%;
`
const ListContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 64px;
  ${mq.mobileOnly`
    margin-bottom: 32px;
  `}
`

const PaginationContainer = styled.div`
  margin-bottom: 120px;
  ${mq.mobileOnly`
    margin-bottom: 64px;
  `}
`

const SnackBarContainer = styled.div`
  z-index: 1;
  position: fixed;
  transition: opacity 100ms;
  opacity: ${props => (props.showSnackBar ? 1 : 0)};
  max-width: 440px;
  width: 100%;
  left: 50%;
  ${mq.desktopAndAbove`
    bottom: 24px;
    transform: translateX(-50%);
  `}
  ${mq.tabletAndBelow`
    bottom: calc(env(safe-area-inset-bottom, 0) + 60px + 8px);
    transform: translateX(-50%);
    padding: 0 16px;
  `}
`

const SnackBarDiv = styled.div`
  display: flex;
  justify-content: center;
`

const EmptyStateConatiner = styled.div`
  margin-top: 72px;
  margin-bottom: 120px;
`

const SavedBookmarks = ({
  isDeleting,
  isFetching,
  jwt,
  userID,
  getMultipleBookmarks,
  page,
  totalPages,
}) => {
  const [totalSavedBookmarkCount, setTotalSavedBookmarkCount] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [showEmptyState, setShowEmptyState] = useState(false)
  const { releaseBranch } = useContext(CoreContext)
  const store = useStore()
  const { removeAction } = useBookmark(store)
  const { showSnackBar, snackBarText, toastr } = useSnackBar()
  const navigate = useHistory()

  const removeBookmark = bookmarkID => {
    removeAction(bookmarkID)
      .then(() => {
        toastr({ text: '已取消收藏' })
        setBookmarks(prevBookmarks =>
          _.filter(prevBookmarks, bookmark => bookmark.id !== bookmarkID)
        )
        setTotalSavedBookmarkCount(
          prevTotalSavedBookmark => prevTotalSavedBookmark - 1
        )
      })
      .catch(error => {
        console.error('error: ', error)
        toastr({ text: '出了點小問題，請再試一次' })
      })
  }

  const filterBookmark = bookmark => {
    const {
      title,
      desc,
      thumbnail,
      slug,
      published_date: publishedDate,
      id: bookmarkID,
      category,
    } = bookmark
    const handleToggleBookmark = () => {
      removeBookmark(bookmarkID)
    }
    return {
      id: bookmarkID,
      title,
      og_description: desc,
      hero_image: {
        resized_targets: {
          mobile: {
            url: thumbnail,
          },
        },
      },
      category,
      category_set: [{ category: { name: category } }],
      published_date: Number(`${publishedDate}000`),
      releaseBranch,
      slug,
      is_bookmarked: true,
      toggle_bookmark: handleToggleBookmark,
    }
  }

  const getBookmarks = async page => {
    const { payload } = await getMultipleBookmarks(
      jwt,
      userID,
      (page - 1) * BOOKMARK_PER_PAGE,
      BOOKMARK_PER_PAGE
    )
    setTotalSavedBookmarkCount(_.get(payload, 'data.meta.total', 0))
    const { records } = _.get(payload, 'data', [])
    if (records.length === 0) {
      setShowEmptyState(true)
    } else {
      setShowEmptyState(false)
      setBookmarks(_.map(records, bookmark => filterBookmark(bookmark)))
    }
  }

  useEffect(() => {
    if (bookmarks.length === 0 && page > 1) {
      const redirectPage = Math.max(page === totalPages ? page - 1 : page, 1)
      navigate.push(
        `${routes.myReadingPage.savedBookmarksPage.path}?page=${redirectPage}`
      )
    }
  }, [bookmarks])

  useEffect(() => {
    if (totalSavedBookmarkCount === 0) {
      setShowEmptyState(true)
    }
  }, [totalSavedBookmarkCount])

  useEffect(() => {
    getBookmarks(page)
  }, [page])

  return (
    <Container>
      <Title1
        title={'已收藏'}
        subtitle={
          totalSavedBookmarkCount ? `共${totalSavedBookmarkCount}篇` : null
        }
      />
      {showEmptyState ? (
        <EmptyStateConatiner>
          <EmptyState
            style={EmptyState.Style.DEFAULT}
            title="你還沒有收藏任何報導"
            guide={
              <>
                <P2 text="點擊" />
                <Bookmark
                  type={Bookmark.Type.ADD}
                  releaseBranch={releaseBranch}
                />
                <P2 text="將喜愛的文章加入我的書籤" />
              </>
            }
            buttonText="前往首頁"
            buttonUrl={requestOrigin.forClientSideRendering[releaseBranch].main}
            releaseBranch={releaseBranch}
          />
        </EmptyStateConatiner>
      ) : (
        <>
          <ListContainer>
            <CardList
              isFetching={!isDeleting && isFetching}
              showSpinner={!isDeleting && isFetching}
              data={bookmarks}
              showIsBookmarked={true}
              width={100}
            />
          </ListContainer>
          <PaginationContainer>
            <Pagination currentPage={page} totalPages={totalPages} />
          </PaginationContainer>
          <SnackBarContainer showSnackBar={showSnackBar}>
            <SnackBarDiv>
              <SnackBar text={snackBarText} />
            </SnackBarDiv>
          </SnackBarContainer>
        </>
      )}
    </Container>
  )
}

SavedBookmarks.propTypes = {
  isDeleting: PropTypes.bool,
  isFetching: PropTypes.bool,
  jwt: PropTypes.string,
  userID: PropTypes.number,
  getMultipleBookmarks: PropTypes.func,
  page: PropTypes.number,
  totalPages: PropTypes.number,
}

const { reduxStateFields, actions } = twreporterRedux
const { getMultipleBookmarks } = actions

function pageProp(location = {}) {
  const defaultPage = 1
  const search = _.get(location, 'search', '')
  const searchWithoutPrefix =
    typeof search === 'string' ? search.replace(/^\?/, '') : search
  const pageStr = _.get(querystring.parse(searchWithoutPrefix), 'page', '1')
  let page = parseInt(Array.isArray(pageStr) ? pageStr[0] : pageStr, 10)

  if (isNaN(page) || page < defaultPage) {
    page = defaultPage
  }

  return page
}

const mapStateToProps = (state, props) => {
  const location = _.get(props, 'location')
  const isDeleting = _.get(
    state,
    [reduxStateFields.bookmarkWidget, 'isRequesting'],
    false
  )
  const isFetching = _.get(
    state,
    [reduxStateFields.bookmarks, 'isRequesting'],
    false
  )
  const jwt = _.get(state, [reduxStateFields.auth, 'accessToken'])
  const userID = _.get(state, [reduxStateFields.auth, 'userInfo', 'user_id'])
  const isAuthed = _.get(state, [reduxStateFields.auth, 'isAuthed'])
  const total = _.get(state, [reduxStateFields.bookmarks, 'total'], 0)

  let currentPage = pageProp(location)
  const totalPages = Math.ceil(total / 10)
  if (currentPage > totalPages) {
    currentPage = totalPages
  }
  return {
    isDeleting,
    isFetching,
    isAuthed,
    jwt,
    userID,
    page: currentPage,
    totalPages,
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    { getMultipleBookmarks }
  )(SavedBookmarks)
)
