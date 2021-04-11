import { Notification, MessageBox, Message } from 'element-ui'

export const $notify = ({
  title = '通知 Title',
  type = 'info',
  message = '',
  duration = 3000
} = {}) => {
  Notification({
    title,
    duration,
    message,
    type,
    position: 'bottom-left'
  })
}

export const $confirm = ({
  title = '确认框 Title',
  message = '确认框 Message',
  type = 'info',
  confirmText = '确定',
  cancelText = '再想想'
}) => {
  return MessageBox.confirm(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type
  })
    .then(() => true)
    .catch(() => false)
}

export const message = (msg, type) => {
  const options = { 
    message: msg,
    type: type
  }
  console.log('options', options)
  switch(options.type) {
    case 'success':
      Message.success(options)
      break
    case 'error':
      Message.error(options)
      break
    case 'info':
      Message.info(options)
      break
    case 'warning':
      Message.warning(options)
      break
    default:
      console.log('Not found command')
      break
  }
}
