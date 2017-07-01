import React from 'react'
import Proptypes from 'prop-types'

const Notification = ({values, className}) => {
  const getNotificationText = () => {
    return values.map((value, i) => {
      return (<p key={i}> {value} </p>)
    })
  }

  const notificationText = getNotificationText()
  return (
    <div className={className}>
      {notificationText}
    </div>
  )
}

Notification.propTypes = {
  values: Proptypes.array,
  className: Proptypes.string
}

export default Notification
