import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  colorBrand,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'

const Container = styled.div`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};
`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

const Switch = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  background: ${colorGrayscale.gray600};
  border-radius: 20px;
  padding: 4px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 20px;
    top: 50%;
    left: 2px;
    background: white;
    transform: translate(0, -50%);
  }
`

const Input = styled.input`
  opacity: 0;
  position: absolute;

  &:checked + ${Switch} {
    background: ${colorBrand.heavy};
    &:before {
      transform: translate(20px, -50%);
    }
  }
`

export const Position = Object.freeze({
  Top: 'top',
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
})
export const Toggle = ({
  value = false,
  label = ['', ''],
  labelPosition = Position.Left,
  theme = '',
  onClick = () => {},
  ...props
}) => {
  const labelStr = label && label.length >= 2 ? label[value ? 0 : 1] : ''
  const toggle = (
    <Label>
      <Input type="checkbox" onChange={() => {}} />
      <Switch />
    </Label>
  )

  return (
    <Container
      isVertical={
        labelPosition === Position.Top || labelPosition === Position.Bottom
      }
    >
      {labelPosition === Position.Top || labelPosition === Position.Left ? (
        <React.Fragment>
          {labelStr}
          {toggle}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {toggle}
          {labelStr}
        </React.Fragment>
      )}
    </Container>
  )
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  label: PropTypes.arrayOf(PropTypes.string),
  labelPosition: PropTypes.string,
  theme: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default { Toggle, Position }
