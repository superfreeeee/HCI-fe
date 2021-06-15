export const linebreakFormat = text => {
  if (text.indexOf('\\n') !== -1) {
    return String(text)
      .replace(/\r\\n/g, '<br/>') // windows
      .replace(/\\n/g, '<br/>') // linux
  }
  return text
}
