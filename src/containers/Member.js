import React from 'react'
import styled from 'styled-components'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { MEMBER_ROLE } from '@twreporter/core/lib/constants/member-role'
import mq from '@twreporter/core/lib/utils/media-query'
import {
  BRANCH_PROP_TYPES,
  BRANCH,
} from '@twreporter/core/lib/constants/release-branch'

import {
  MobileOnly,
  TabletAndAbove,
} from '@twreporter/react-components/lib/rwd'

import MemberMenuList from '../components/member-page/menu-list'
import MemberData from '../components/member-page/member-data'
import MemberRoleCard from '../components/member-page/member-role-card'
import MemberDonationPage from '../components/member-page/donation'
import EmailSubscription from '../components/member-page/email-subscription'
import MobileMemberPage from '../components/member-page/mobile-page/mobile-member-page'
import routes from '../constants/routes'

const PageContainer = styled.div`
	width: 100%;
	padding-bottom: 200px;
	${mq.mobileOnly`
		padding: 24px 24px 64px;
	`}
	${mq.tabletAndAbove`
		display: grid;
		grid-template-columns: 2fr 7fr 3fr;
	`}
	${mq.tabletOnly`
		padding-top: 32px;
		padding-left: 32px;
		grid-column-gap: 24px;
	`}
  ${mq.desktopAndAbove`
    padding-top: 64px;
		padding-left: 48px;
		grid-column-gap: 32px;
  `}
	${mq.hdOnly`
		padding-left: 0px;
		width: 1280px;
		margin: auto;
	`}
`

const MenuContainer = styled.div``

const ContentContainer = styled.div`
  ${mq.mobileOnly`
	padding: 24px 24px 200px;
	`}
`

const RoleCardContainer = styled.div`
  margin: auto;
`

const tempMemberData = [
  {
    role: MEMBER_ROLE.explorer,
    email: 'abc@email',
    joinDate: '2020/01/01',
  },
  {
    role: MEMBER_ROLE.action_taker,
    name: '小富翁',
    email: 'efh@email',
    joinDate: '2022/02/02',
  },
  {
    role: MEMBER_ROLE.trailblazer,
    name: '大富翁',
    email: 'vip@email',
    joinDate: '1900/12/21',
  },
]

const MemberPage = ({ releaseBranch = BRANCH.master }) => {
  const { path } = useRouteMatch()
  // TODO: fake data to show all roles
  const memberData = tempMemberData[Math.floor(Math.random() * 3)]
  return (
    <div>
      <TabletAndAbove>
        <PageContainer>
          <MenuContainer>
            <MemberMenuList releaseBranch={releaseBranch} />
          </MenuContainer>
          <ContentContainer>
            <Switch>
              <Route exact path={routes.memberPage.path}>
                <MemberData
                  role={memberData.role}
                  email={memberData.email}
                  joinDate={memberData.joinDate}
                  name={memberData.name || ''}
                />
              </Route>
              <Route path={routes.memberPage.memberDonationPage.path}>
                <MemberDonationPage releaseBranch={releaseBranch} />
              </Route>
              <Route path={routes.memberPage.memberEmailSubscriptionPage.path}>
                <EmailSubscription />
              </Route>
            </Switch>
          </ContentContainer>
          <Route exact path={routes.memberPage.path}>
            <RoleCardContainer>
              <MemberRoleCard
                role={memberData.role}
                releaseBranch={releaseBranch}
              />
            </RoleCardContainer>
          </Route>
        </PageContainer>
      </TabletAndAbove>
      <MobileOnly>
        <Route exact path={routes.memberPage.path}>
          <PageContainer>
            <MobileMemberPage
              role={memberData.role}
              releaseBranch={releaseBranch}
              email={memberData.email}
              joinDate={memberData.joinDate}
              name={memberData.name || ''}
            />
          </PageContainer>
        </Route>
        <Switch>
          <Route path={routes.memberPage.memberDonationPage.path}>
            <ContentContainer>
              <MemberDonationPage releaseBranch={releaseBranch} />
            </ContentContainer>
          </Route>
          <Route path={routes.memberPage.memberEmailSubscriptionPage.path}>
            <ContentContainer>
              <EmailSubscription />
            </ContentContainer>
          </Route>
        </Switch>
      </MobileOnly>
    </div>
  )
}

MemberPage.propTypes = {
  releaseBranch: BRANCH_PROP_TYPES,
}

export default MemberPage
