export const linebreakFormat = text => {
  if (text.indexOf('\n') !== -1) {
    return String(text)
      .replace(/\r\\n/g, '<br/>') // linux
      .replace(/\\n/g, '<br>') // windows
  }
  return text
}
