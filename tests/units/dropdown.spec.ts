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

    const customElement = document.querySelector('dropdown-menu');
    if (customElement !== null && customElement.shadowRoot !== null) {
      const thirdOptionElement = customElement.shadowRoot.querySelector('.select-option:nth-child(3)') as HTMLElement
      const resultElement = customElement.shadowRoot.querySelector('.select-result') as HTMLElement
      if (thirdOptionElement !== null) {
        // thirdOptionElement.click()
        await fireEvent.click(thirdOptionElement, {
          bubbles: true,
          cancelable: true,
        })
        if (resultElement !== null) {
          expect(resultElement.textContent).toBe(options[2].name)
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
});
