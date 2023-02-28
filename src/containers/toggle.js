import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
`

const Toggle = ({
  value = false,
  theme = '',
  onClick = () => {},
  ...props
}) => {
  return (
    <Label>
      <input type="checkbox" checked={value} onChange={onClick} />
      <span />
    </Label>
  )
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  theme: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default Toggle
