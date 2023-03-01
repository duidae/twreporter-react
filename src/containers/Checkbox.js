import React from 'react'
import PropTypes from 'prop-types'
// import styled from 'styled-components'

export const Checkbox = ({
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

export default { Checkbox }
