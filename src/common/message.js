import { Notification, MessageBox } from 'element-ui'

export const $notify = (
  title = '通知 Title',
  type = 'info',
  duration = 3000
) => {
  Notification({
    title,
    duration,
    type,
    position: 'bottom-left'
  })
}

export const $confirm = (
  title = '确认框 Title',
  message = '确认框 Message'
) => {
  return MessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '再想想',
    type: 'warning'
  })
    .then(() => true)
    .catch(() => false)
}
