import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import mq from '../utils/media-query'

import { LogoHeader } from '@twreporter/react-components/lib/logo'
import Divider from '@twreporter/react-components/lib/divider'
import Toggle from './Toggle'

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
`

const Control = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.div``

const Desc = styled.div``

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
      <React.Fragment>
        <Title>{title.text}</Title>
        <Desc>{title.desc}</Desc>
      </React.Fragment>
    ) : null
  }

  const renderNewsletterOptions = () => {
    return settings[Step.Newsletter].options.map((option, index) => {
      return (
        <OptionContainer key={`newsletter-option-${index}`}>
          <OptionContent>
            <Title>{option.text}</Title>
            <Label>{option.label}</Label>
            <Desc>{option.desc}</Desc>
          </OptionContent>
          <Toggle
            value={newsletterSubscriptions[index]}
            text={['訂閱', '未訂閱']}
            onClick={index => onClickNewsletterSubscriptions(index)}
          />
        </OptionContainer>
      )
    })
  }

  const renderCategoryOptions = () => {
    return (
      <React.Fragment>
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
      </React.Fragment>
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
            <Next onClick={goToCategorySettings}>下一步</Next>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Previous onClick={backToNewsletterSettings}>上一步</Previous>
            <Next onClick={finishSettings}>完成</Next>
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
