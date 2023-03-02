import React, { useState } from 'react'
import styled from 'styled-components'
import mq from '../utils/media-query'

import { LogoHeader } from '@twreporter/react-components/lib/logo'
import Divider from '@twreporter/react-components/lib/divider'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { WEIGHT } from '@twreporter/react-components/lib/text/constants/font-weight'
import { Arrow } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

// TODO: move to react-components
import { Toggle, POSITION } from './Toggle'
import { Badge } from './Badge'
import { Checkbox } from './Checkbox'

// TODO: enum coding style?
const Step = Object.freeze({ Newsletter: 'newsletter', Category: 'category' })

const settings = {
  [Step.Newsletter]: {
    title: { text: '會員電子報', desc: '訂閱電子報，把《報導者》收進信箱' },
    options: [
      {
        text: '報導者精選',
        desc:
          '由《報導者》編輯台精選近兩週的最新報導，和我們一起看見世界上正在發生的、重要的事。',
        label: '雙週',
      },
      {
        text: '採訪幕後故事',
        desc:
          '總是好奇記者們如何深入現場，採訪過程中又有哪些不為人知的故事嗎？我們會不定期分享給你。',
        label: '不定期',
      },
      {
        text: '報導者營運手記',
        desc:
          '一路走來，各個決策有什麼背後故事，團隊又是過著怎樣的工作日常？一起來開箱報導者團隊！',
        label: '雙週',
      },
      {
        text: '活動資訊與最新動態',
        desc:
          '除了基金會最新消息，我們也會在第一時間通知你電影特映、專題座談、新書發表等活動報名資訊。',
        label: '不定期',
      },
    ],
  },
  [Step.Category]: {
    title: {
      text: '你感興趣的議題',
      desc: '請勾選你感興趣的議題，讓我們更了解你',
    },
    options: [
      '國際',
      '經濟',
      '藝術',
      '兩岸',
      '文化',
      '生活',
      '人權',
      '教育',
      '醫療',
      '社會',
      '政治',
      '體育',
    ],
  },
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  ${mq.tabletAndAbove`
    justify-content: center;
  `}
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px 24px;
`

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 24px;

  ${mq.mobileOnly`
    padding-left: 24px;
    padding-right: 24px;
  `}
`

const Content = styled.div`
  max-width: 432px;
  ${mq.mobileOnly`
max-width: 342px;
`}
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid ${colorGrayscale.gray300};
  border-radius: 8px;
`

const Control = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 24px;
`
const NewsletterOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 24px;
`
const CategoryContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  margin-bottom: 24px;
`

const CategoryOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
`

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 342px;
`

const OptionTitle = styled.div`
  display: flex;
  flex-direction: row;
`

const TitleContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
`

const Subscription = () => {
  const [step, setStep] = useState(Step.Newsletter)
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState(
    settings.newsletter.options.map(option => false)
  )
  const [categorySelections, setCategorySelections] = useState(
    settings.category.options.map(option => false)
  )

  const onClickNewsletterSubscriptions = index => {
    const subscriptions = [...newsletterSubscriptions]
    subscriptions[index] = !subscriptions[index]
    setNewsletterSubscriptions(subscriptions)
  }

  const onClickCategorySelections = index => {
    const selections = [...categorySelections]
    selections[index] = !selections[index]
    setCategorySelections(selections)
  }

  const onClickAllCategorySelections = () => {
    // TODO
  }

  const renderTitle = () => {
    const title = settings[step].title
    return title ? (
      <TitleContainer>
        <H4 text={title.text} />
        <P1 text={title.desc} />
      </TitleContainer>
    ) : null
  }

  const renderNewsletterOptions = () => {
    return settings[Step.Newsletter].options.map((option, index) => {
      return (
        <NewsletterOptionsContainer key={`newsletter-option-${index}`}>
          <OptionContent>
            <OptionTitle>
              <P1 text={option.text} weight={WEIGHT.bold} />
              <Badge text={option.label} style={{ marginLeft: '8px' }} />
            </OptionTitle>
            <P2 text={option.desc} />
          </OptionContent>
          <Toggle
            value={newsletterSubscriptions[index]}
            label={['訂閱', '未訂閱']}
            labelPosition={POSITION.top}
            onClick={index => onClickNewsletterSubscriptions(index)}
          />
        </NewsletterOptionsContainer>
      )
    })
  }

  const renderCategoryOptions = () => {
    return (
      <CategoryContent>
        <CategoryOptionsContainer>
          {settings[Step.Category].options.map((option, index) => (
            <Checkbox
              key={`category-option-${index}`}
              label={option}
              value={categorySelections[index]}
              onClick={index => onClickCategorySelections(index)}
            />
          ))}
        </CategoryOptionsContainer>
        <Checkbox
          label="以上皆是我感興趣的議題"
          value={false}
          onClick={onClickAllCategorySelections}
        />
      </CategoryContent>
    )
  }

  const goToCategorySettings = () => {
    setStep(Step.Category)
  }

  const backToNewsletterSettings = () => {
    setStep(Step.Newsletter)
  }

  const finishSettings = () => {
    // TODO: what to do?
    console.log(newsletterSubscriptions, categorySelections)
  }

  // TODO: handle releaseBranch prop
  const renderPageControl = () => {
    return (
      <Control>
        {step === Step.Newsletter ? (
          <React.Fragment>
            <StepContainer disabled={true} />
            <StepContainer onClick={goToCategorySettings}>
              <P1 text="下一步" />
              <Arrow direction="right" releaseBranch={'master'} />
            </StepContainer>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <StepContainer onClick={backToNewsletterSettings}>
              <Arrow direction="left" releaseBranch={'master'} />
              <P1 text="上一步" />
            </StepContainer>
            <StepContainer onClick={finishSettings}>
              <P1 text="完成" />
              <Arrow direction="right" releaseBranch={'master'} />
            </StepContainer>
          </React.Fragment>
        )}
      </Control>
    )
  }

  return (
    <Container>
      <Header>
        <LogoHeader />
      </Header>
      <Body>
        <Content>
          {renderTitle()}
          <Divider />
          {step === Step.Newsletter
            ? renderNewsletterOptions()
            : renderCategoryOptions()}
          <Divider />
          {renderPageControl()}
        </Content>
      </Body>
    </Container>
  )
}

export default Subscription
