import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

const Switch = styled.div`
  position: relative;
  width: 50px;
  height: 28px;
  background: #b3b3b3;
  border-radius: 32px;
  padding: 4px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: white;
    transform: translate(0, -50%);
  }
`

const Input = styled.input`
  opacity: 0;
  position: absolute;

  &:checked + ${Switch} {
    background: green;
    &:before {
      transform: translate(32px, -50%);
    }
  }
`

const Toggle = ({
  value = false,
  text = ['', ''],
  theme = '',
  onClick = () => {},
  ...props
}) => {
  return (
    <Label>
      {text && text.length >= 2 ? text[value ? 0 : 1] : ''}
      <Input type="checkbox" onChange={() => {}} />
      <Switch />
    </Label>
  )
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  text: PropTypes.array,
  theme: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default Toggle
