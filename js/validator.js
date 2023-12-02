function validator(options) {
  const formEl = document.querySelector(options.form)
  const selectorRules = {}

  if (formEl) {
    formEl.onsubmit = (e) => {
      e.preventDefault()

      let isFormValid = true
      options.rules.forEach((rule) => {
        const inputEl = formEl.querySelector(rule.selector)
        if (inputEl) {
          const isValid = !validate(rule, inputEl)
          if (!isValid) {
            isFormValid = false
          }
        }
      })

      // Lấy value từ form
      if (isFormValid) {
        if (typeof options.onSubmit === 'function') {
          const enableInputs = formEl.querySelectorAll('[name]')
          const formValues = Array.from(enableInputs).reduce(
            (values, input) => {
              switch (input.type) {
                case 'radio':
                  values[input.name] = formEl.querySelector(
                    'input[name="' + input.name + '"]:checked',
                  ).value
                  break
                case 'checkbox':
                  if (!Array.isArray(values[input.name])) {
                    values[input.name] = []
                  }

                  if (input.matches(':checked')) {
                    values[input.name].push(input.value)
                  }

                  if (values[input.name].length === 0) {
                    values[input.name] = ''
                  }
                  break
                case 'file':
                  values[input.name] = input.files
                  break
                default:
                  values[input.name] = input.value
              }
              return values
            },
            {},
          )
          options.onSubmit(formValues)
        } else {
          formEl.submit()
        }
      }
    }

    options.rules.forEach((rule) => {
      // Lưu lại rule cho mỗi input
      if (!Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector] = []
      }
      selectorRules[rule.selector].push(rule.test)

      const inputEls = formEl.querySelectorAll(rule.selector)
      Array.from(inputEls).forEach((inputEl) => {
        const formGroupEl = getParent(inputEl, options.formGroupSelector)
        const errorEl = formGroupEl.querySelector(options.errorSelector)
        if (inputEl) {
          inputEl.onblur = () => {
            validate(rule, inputEl)
          }

          inputEl.onchange = () => {
            validate(rule, inputEl)
          }

          inputEl.oninput = () => {
            errorEl.innerText = ''
            formGroupEl.classList.remove('invalid')
          }
        }
      })
    })
  }

  function validate(rule, inputEl) {
    const formGroupEl = getParent(inputEl, options.formGroupSelector)
    const errorEl = formGroupEl.querySelector(options.errorSelector)
    const rules = selectorRules[rule.selector]
    let errorMessage

    // Lặp qua rules và kiểm tra
    for (let i = 0; i < rules.length; i++) {
      switch (inputEl.type) {
        case 'radio':
          errorMessage = rules[i](
            formGroupEl.querySelector(rule.selector + ':checked'),
          )
          break
        case 'checkbox':
          errorMessage = rules[i](
            formGroupEl.querySelectorAll(rule.selector + ':checked'),
          )
          break
        default:
          errorMessage = rules[i](inputEl.value)
      }
      if (errorMessage) break
    }

    if (errorMessage) {
      errorEl.innerText = errorMessage
      formGroupEl.classList.add('invalid')
    } else {
      errorEl.innerText = ''
      formGroupEl.classList.remove('invalid')
    }

    return !!errorMessage
  }

  function getParent(el, selector) {
    while (el.parentElement) {
      if (el.parentElement.matches(selector)) {
        return el.parentElement
      }
      el = el.parentElement
    }
  }
}

// Rules
validator.isRequired = (selector, message) => {
  return {
    selector,
    test(value) {
      return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
    },
  }
}

validator.isEmail = (selector, message) => {
  return {
    selector,
    test(value) {
      if (!value) {
        return undefined
      }
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regex.test(value) ? undefined : message || 'Email không hợp lệ'
    },
  }
}

validator.isPhoneNumber = (selector, message) => {
  return {
    selector,
    test(value) {
      if (!value) {
        return undefined
      }
      const regex = /^0\d{9}$/
      return regex.test(value)
        ? undefined
        : message || 'Số điện thoại không hợp lệ'
    },
  }
}

validator.minLength = (selector, min, message) => {
  return {
    selector,
    test(value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`
    },
  }
}

validator.maxLength = (selector, max, message) => {
  return {
    selector,
    test(value) {
      return value.length <= max
        ? undefined
        : message || `Vui lòng nhập tối đa ${max} ký tự`
    },
  }
}

validator.isConfirmed = (selector, getConfirmValue, message) => {
  return {
    selector,
    test(value) {
      return value === getConfirmValue()
        ? undefined
        : message || 'Giá trị nhập vào không chính xác'
    },
  }
}

validator.isSelected = (selector, message) => {
  return {
    selector,
    test(value) {
      if (value instanceof NodeList) {
        return value.length > 0
          ? undefined
          : message || 'Vui lòng chọn tùy chọn phù hợp'
      }
      return value ? undefined : message || 'Vui lòng chọn tùy chọn phù hợp'
    },
  }
}

validator.minChecked = (selector, min, message) => {
  return {
    selector,
    test(value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng chọn tối thiểu ${min} lựa chọn`
    },
  }
}

validator.maxChecked = (selector, max, message) => {
  return {
    selector,
    test(value) {
      return value.length <= max
        ? undefined
        : message || `Vui lòng chọn tối đa ${max} lựa chọn`
    },
  }
}
