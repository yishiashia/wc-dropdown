import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import Dropdown from '../../src/dropdown'

describe('Dropdown.vue', () => {
  window.customElements.define('dropdown-menu', Dropdown);
  // Render test cases
  test('Must render props.placeholder when passed', () => {
    const placeholder = 'this is placeholder';
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    expect(customElement === null).toBeFalsy();
    if(customElement !== null && customElement.shadowRoot !== null) {
      const resultRef = customElement.shadowRoot.querySelector('.select-result')
      if (resultRef !== null) {
        expect(resultRef.textContent === placeholder)
      } else {
        fail("shadow dom not mount")
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('Must render props.options when passed', () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if(customElement !== null && customElement.shadowRoot !== null) {
      const optionItems = customElement.shadowRoot.querySelectorAll('.select-option')
      expect(optionItems.length).toBe(options.length)
    } else {
      fail("shadow dom not mount")
    }
  });

  test('Test expand dropdown menu', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
      { name: 'option 5', value: 'A05' },
      { name: 'option 6', value: 'A06' },
      { name: 'option 7', value: 'A07' },
      { name: 'option 8', value: 'A08' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const inputElement = customElement.shadowRoot.querySelector('input') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      const optionsRef = customElement.shadowRoot.querySelector('#optionsRef') as HTMLElement
      if (inputElement !== null) {
        await fireEvent.click(inputElement, {
          bubbles: true,
          cancelable: true,
        })
        const firstOptionElement = customElement.shadowRoot.querySelector('.select-option')
        if (firstOptionElement !== null) {
          if (optionsRef !== null) {
            expect(getComputedStyle(optionsRef).display !== 'none').toBeTruthy()
            if (menuRef !== null) {
              expect(menuRef).toHaveClass('expand')
            } else {
              fail('The .custom-select element nust be rendered')
            }
          } else {
            fail('The menu (.select-options) shouldn\'t be null');
          }
        } else {
          fail('The menu option should be rendered');
        }
      } else {
        fail('The menu result block (.select-result) should be existed');
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('Test items length less than maxitems', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const inputElement = customElement.shadowRoot.querySelector('input') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      const optionsRef = customElement.shadowRoot.querySelector('#optionsRef') as HTMLElement
      if (inputElement !== null) {
        await fireEvent.click(inputElement, {
          bubbles: true,
          cancelable: true,
        })
        if (optionsRef !== null) {
          expect(optionsRef.style.overflowY === 'hidden')
        } else {
          fail('The menu (.select-options) shouldn\'t be null');
        }
      } else {
        fail('The menu result block (.select-result) should be existed');
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('Test choose the third option in the menu', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
      { name: 'option 5', value: 'A05' },
      { name: 'option 6', value: 'A06' },
      { name: 'option 7', value: 'A07' },
      { name: 'option 8', value: 'A08' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `

    const customElement = document.querySelector('dropdown-menu') as Dropdown;
    if (customElement !== null && customElement.shadowRoot !== null) {
      const thirdOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(3)') as HTMLElement
      const fifthOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(5)') as HTMLElement
      const resultElement = customElement.shadowRoot.querySelector('.select-result>.result-text') as HTMLElement
      if (thirdOptionElement !== null) {
        // thirdOptionElement.click()
        await fireEvent.click(thirdOptionElement, {
          bubbles: true,
          cancelable: true,
        })
        if (resultElement !== null) {
          expect(resultElement.textContent).toBe(options[2].name)
          expect(customElement.value).toBe(options[2].value)
        } else {
          fail('The menu result block (.select-result) should be existed');
        }
        await fireEvent.click(fifthOptionElement, {
          bubbles: true,
          cancelable: true,
        })
        if (resultElement !== null) {
          expect(resultElement.textContent).toBe(options[4].name)
        } else {
          fail('The menu result block (.select-result) should be existed');
        }
      } else {
        fail("the third option item should be existed")
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('Test hide menu', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
      { name: 'option 5', value: 'A05' },
      { name: 'option 6', value: 'A06' },
      { name: 'option 7', value: 'A07' },
      { name: 'option 8', value: 'A08' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const inputElement = customElement.shadowRoot.querySelector('input') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      const optionsRef = customElement.shadowRoot.querySelector('#optionsRef') as HTMLElement
      menuRef.classList.add('expand')
      if (inputElement !== null) {
        await fireEvent.click(inputElement, {
          bubbles: true,
          cancelable: true,
        })
        const firstOptionElement = customElement.shadowRoot.querySelector('.select-option')
        if (firstOptionElement !== null) {
          if (optionsRef !== null) {
            expect(getComputedStyle(optionsRef).display === 'hidden')
            if (menuRef !== null) {
              expect(menuRef).not.toHaveClass('expand')
            } else {
              fail('The .custom-select element nust be rendered')
            }
          } else {
            fail('The menu (.select-options) shouldn\'t be null');
          }
        } else {
          fail('The menu option should be rendered');
        }
      } else {
        fail('The menu result block (.select-result) should be existed');
      }
    }
  });

  test('setCursor with keyboard arrow down', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const thirdOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(3)') as HTMLElement
      const resultElement = customElement.shadowRoot.querySelector('.select-result>.result-text') as HTMLElement
      if (rootRef !== null) {
        const arrowDownKeycode = {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          charCode: 40
        }
        await fireEvent.keyDown(rootRef, arrowDownKeycode)
        await fireEvent.keyDown(rootRef, arrowDownKeycode)
        await fireEvent.keyDown(rootRef, arrowDownKeycode)
        if (thirdOptionElement !== null) {
          expect(thirdOptionElement).toHaveClass('hover')
        } else {
          fail("the third option item should be existed")
        }
        await fireEvent.keyDown(rootRef, arrowDownKeycode)
        await fireEvent.keyDown(rootRef, arrowDownKeycode)
        await fireEvent.keyDown(rootRef, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          charCode: 13
        })
        if (resultElement !== null) {
          expect(resultElement.textContent).toBe(options[4%options.length].name)
        } else {
          fail('.text-result element is null')
        }
      } else {
        fail('root element in shadowRoot should be existed')
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('setCursor with keyboard arrow up', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const thirdOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(3)') as HTMLElement
      const resultElement = customElement.shadowRoot.querySelector('.select-result>.result-text') as HTMLElement
      if (rootRef !== null) {
        const arrowUpKeycode = {
          key: "ArrowUp",
          code: "ArrowUp",
          keyCode: 38,
          charCode: 38
        }
        await fireEvent.keyDown(rootRef, arrowUpKeycode)
        await fireEvent.keyDown(rootRef, arrowUpKeycode)
        await fireEvent.keyDown(rootRef, arrowUpKeycode)
        if (thirdOptionElement !== null) {
          expect(thirdOptionElement).toHaveClass('hover')
        } else {
          fail("the third option item should be existed")
        }
      } else {
        fail('root element in shadowRoot should be existed')
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('test escape keypress', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      if (menuRef !== null) {
        menuRef.classList.add('expand')
        await fireEvent.keyDown(rootRef, {
          key: "Escape",
          code: "Escape",
          keyCode: 27,
          charCode: 27
        })
        expect(menuRef).not.toHaveClass('expand')
      } else {
        fail(".custom-select element not existed")
      }
    } else {
      fail("shadow dom not mount")
    }
  })

  test('setCursor with mouse hover (mouse enter)', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'option 1', value: 'A01' },
      { name: 'option 2', value: 'A02' },
      { name: 'option 3', value: 'A03' },
      { name: 'option 4', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="5"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const thirdOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(3)') as HTMLElement
      const resultElement = customElement.shadowRoot.querySelector('.select-result>.result-text') as HTMLElement
      if (thirdOptionElement !== null) {
        // thirdOptionElement.click()
        await fireEvent.mouseEnter(thirdOptionElement, {
          bubbles: true,
          cancelable: true,
        })
        expect(thirdOptionElement).toHaveClass('hover')
      } else {
        fail("the third option item should be existed")
      }
    } else {
      fail("shadow dom not mount")
    }
  });

  test('scrollToIndex when a keycode of first char is detected', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'AA', value: 'A01' },
      { name: 'BB', value: 'A02' },
      { name: 'CC', value: 'A03' },
      { name: 'DD', value: 'A04' },
      { name: 'EE', value: 'A05' },
      { name: 'FF', value: 'A06' },
      { name: 'GG', value: 'A07' },
      { name: 'HH', value: 'A08' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const optionsRef = customElement.shadowRoot.querySelector('#optionsRef') as HTMLElement
      const inputElement = customElement.shadowRoot.querySelector('input') as HTMLElement
      if (inputElement !== null) {
        await fireEvent.click(inputElement, {
          bubbles: true,
          cancelable: true,
        })
        if (rootRef !== null) {
          const element = rootRef.querySelector('.select-option') as HTMLElement
          if (element !== null) {
            const style = window.getComputedStyle(element)
            const singleOptionHeight =
              Number(style.height.replace('px', '')) +
              Number(style.paddingTop.replace('px', '')) +
              Number(style.paddingBottom.replace('px', '')) +
              Number(style.borderTopWidth.replace('px', '')) +
              Number(style.borderBottomWidth.replace('px', ''))
            await fireEvent.keyDown(rootRef, {
              key: "c",
              code: "KeyC",
              keyCode: 67,
              charCode: 67
            })
            if (optionsRef !== null) {
              // TODO: check scrollTop with e2e test
              console.log('TODO: check scrollTop with e2e test')
            } else {
              fail('#optionsRef element not found')
            }
          } else {
            fail('select-option element not found')
          }
        } else {
          fail('root element in shadowRoot should be existed')
        }
      } else {
        fail("input element not found")
      }
    } else {
      fail("shadow dom not mount")
    }
  })

  test('get / set options', () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'AA', value: 'A01' },
      { name: 'BB', value: 'A02' },
      { name: 'CC', value: 'A03' },
      { name: 'DD', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu') as Dropdown;
    if (customElement !== null && customElement.shadowRoot !== null) {
      // test getter
      expect(JSON.stringify(customElement.options)).toBe(JSON.stringify(options))
      // test setter
      const newOption = [
        {name: 'aa', value: 'a'},
        {name: 'bb', value: 'b'},
        {name: 'cc', value: 'c'}
      ]
      customElement.options = newOption
      expect(JSON.stringify(customElement.options)).toBe(JSON.stringify(newOption))
    } else {
      fail("shadow dom not mount")
    }
  })

  test('get value must be empty if not choose any option yet', () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'AA', value: 'A01' },
      { name: 'BB', value: 'A02' },
      { name: 'CC', value: 'A03' },
      { name: 'DD', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu') as Dropdown;
    if (customElement !== null && customElement.shadowRoot !== null) {
      expect(customElement.value).toBe('')
    } else {
      fail("shadow dom not mount")
    }
  })

  test('test focus / blur on component', () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'AA', value: 'A01' },
      { name: 'BB', value: 'A02' },
      { name: 'CC', value: 'A03' },
      { name: 'DD', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu') as Dropdown;
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const inputElement = customElement.shadowRoot.querySelector('input') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      if (inputElement !== null) {
        inputElement.focus()
        if (menuRef !== null) {
          expect(menuRef).toHaveClass('focused')
          if (rootRef !== null) {
            rootRef.blur()
            expect(menuRef).not.toHaveClass('focused')
            expect(menuRef).not.toHaveClass('expand')
          } else {
            fail('root element is not existed')
          }
        } else {
          fail('.custom-select element is not existed')
        }
      } else {
        fail('input field is not existed')
      }
    } else {
      fail("shadow dom not mount")
    }
  })

  test('press enter key to expand menu', async () => {
    const placeholder = 'this is placeholder';
    const options = [
      { name: 'AA', value: 'A01' },
      { name: 'BB', value: 'A02' },
      { name: 'CC', value: 'A03' },
      { name: 'DD', value: 'A04' },
    ];
    document.body.innerHTML = `
      <dropdown-menu
        placeholder="${placeholder}"
        maxitems="3"
        name="city"
        options="${JSON.stringify(options).replaceAll('"', '&quot;')}"
      ></dropdown-menu>
    `
    const customElement = document.querySelector('dropdown-menu') as Dropdown;
    if (customElement !== null && customElement.shadowRoot !== null) {
      const rootRef = customElement.shadowRoot.querySelector('.container') as HTMLElement
      const menuRef = customElement.shadowRoot.querySelector('.custom-select') as HTMLElement
      if (rootRef !== null) {
        // fire enter key event
        await fireEvent.keyDown(rootRef, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          charCode: 13
        })
        if (menuRef !== null) {
          expect(menuRef).toHaveClass('expand')
          await fireEvent.keyUp(rootRef, {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            charCode: 13
          })
        } else {
          fail('.custom-select element is not existed')          
        }
      } else {
        fail('root element is not existed')
      }
    } else {
      fail("shadow dom not mount")
    }
  })

});
