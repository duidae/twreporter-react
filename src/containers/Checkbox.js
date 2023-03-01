import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'

const Container = styled.div`
  display: flex;
  flex-direction: 'row';
`

export const Checkbox = ({
  key = '',
  label = '',
  value = false,
  onClick = () => {},
}) => {
  return (
    <Container key={key}>
      <input type="checkbox" checked={value} onChange={onClick} />
      <P1 text={label} />
    </Container>
  )
}

Checkbox.propTypes = {
  value: PropTypes.bool.isRequired,
  key: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default { Checkbox }
