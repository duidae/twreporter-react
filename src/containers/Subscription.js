import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import mq from '../utils/media-query'

import { LogoHeader } from '@twreporter/react-components/lib/logo'
import Divider from '@twreporter/react-components/lib/divider'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { WEIGHT } from '@twreporter/react-components/lib/text/constants/font-weight'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { Toggle, POSITION } from './Toggle'

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
  justify-content: center;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Body = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Content = styled.div`
  max-width: 432px;
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

const CategoryOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
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

const TitleContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`

const Label = styled.div``

const Checkbox = ({
  key = '',
  label = '',
  value = false,
  onClick = () => {},
}) => {
  return (
    <div key={key}>
      <input type="checkbox" checked={value} onChange={onClick} />
      <label>{label}</label>
    </div>
  )
}

Checkbox.propTypes = {
  value: PropTypes.bool.isRequired,
  key: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

const Previous = styled.div``

const Next = styled.div``

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
            <P1 text={option.text} weight={WEIGHT.bold} />
            <Label>{option.label}</Label>
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
      <CategoryOptionsContainer>
        {settings[Step.Category].options.map((option, index) => (
          <Checkbox
            key={`category-option-${index}`}
            label={option}
            value={categorySelections[index]}
            onClick={index => onClickCategorySelections(index)}
          />
        ))}
        <Checkbox
          label="以上皆是我感興趣的議題"
          value={false}
          onClick={onClickAllCategorySelections}
        />
      </CategoryOptionsContainer>
    )
  }

  const renderOptions = () => {
    return step === Step.Newsletter
      ? renderNewsletterOptions()
      : renderCategoryOptions()
  }

  const goToCategorySettings = () => {
    setStep(Step.Category)
  }

  const backToNewsletterSettings = () => {
    setStep(Step.Newsletter)
  }

  const finishSettings = () => {
    // TODO: what to do?
  }

  const renderPageControl = () => {
    return (
      <Control>
        {step === Step.Newsletter ? (
          <React.Fragment>
            <Previous disabled={true} />
            <Next onClick={goToCategorySettings}>
              <P1 text="下一步" />
            </Next>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Previous onClick={backToNewsletterSettings}>
              <P1 text="上一步" />
            </Previous>
            <Next onClick={finishSettings}>
              <P1 text="完成" />
            </Next>
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
          {renderOptions()}
          <Divider />
          {renderPageControl()}
        </Content>
      </Body>
    </Container>
  )
}

export default Subscription
