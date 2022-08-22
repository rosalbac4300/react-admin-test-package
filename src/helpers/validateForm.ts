export const validateInput = (text: string) => {
  if (text === '') {
    return false
  } else {
    return true
  }
}

export const validateEmailInput = (email: string) => {
  if (email === '') {
    return false
  } else {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email.toLowerCase())
  }
}
