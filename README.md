# wc-dropdown

[![published][wc-image]][wc-url]
[![coverage][coverage-image]][coverage-url]
[![npm](https://img.shields.io/npm/v/wc-dropdown.svg?style=flat-square)](https://www.npmjs.com/package/wc-dropdown)
[![npm](https://img.shields.io/npm/dm/wc-dropdown.svg?style=flat-square)](https://www.npmjs.com/package/wc-dropdown)
[![GitHub issues](https://img.shields.io/github/issues/yishiashia/wc-dropdown.svg?style=flat-square)](https://github.com/yishiashia/wc-dropdown/issues)
![license](https://img.shields.io/npm/l/wc-dropdown.svg?style=flat-square)

[![NPM](https://nodei.co/npm/wc-dropdown.png?mini=true)](https://www.npmjs.com/package/wc-dropdown)

Dropdown menu web component.


## Install

    $ npm install wc-dropdown

## Syntax

```html
<script src="dropdown.js"></script>

<form action="#" method="POST">
    <dropdown-menu
      placeholder="Please select one"
      maxitems="5"
      name="city"
      options="[
        {&quot;name&quot;: &quot;option 1&quot;, &quot;value&quot;:&quot;A01&quot;},
        {&quot;name&quot;: &quot;option 2&quot;, &quot;value&quot;:&quot;A02&quot;},
        {&quot;name&quot;: &quot;option 3&quot;, &quot;value&quot;:&quot;A03&quot;},
        {&quot;name&quot;: &quot;option 4&quot;, &quot;value&quot;:&quot;A04&quot;}
      ]"
    ></dropdown-menu>
    <input type="submit" value="submit" />
</form>
```

## Demo page
The demo page: https://yishiashia.github.io/dropdown.html
## Usage

If you want to customize this web component, you can import the library and
implement your new class by extend `Dropdown`.

```js
import Dropdown from "wc-dropdown";

class customizedDropdown extends Dropdown {
    // override here
}

```

### Options
 - [placeholder](#placeholder)
 - [maxitems](#maxitems)
 - [name](#name)
 - [options](#options-1)

#### placeholder
`String` type. The hint words of dropdown menu.

#### maxitems
`Number` type. The max length of displayed items at one time in the dropdown menu.

#### name
`String` typs. The name of input, it would be the POST parameter name.

#### options
Array of option item. Each option item include at least `name` and `value` fields.

example:
```json
[
  {"name": "option 1", "value": "a1"},
  {"name": "option 2", "value": "a2"},
  {"name": "option 3", "value": "a3"}
]
```

When passing `options` as element attribute, it must escape the quotes mark, for example:

```html
[
  {&quot;name&quot;: &quot;option 1&quot;, &quot;value&quot;: &quot;a1&quot;},
  {&quot;name&quot;: &quot;option 2&quot;, &quot;value&quot;: &quot;a2&quot;},
  {&quot;name&quot;: &quot;option 3&quot;, &quot;value&quot;: &quot;a3&quot;}
]
```

Another way to set options is using javascript:
```js
let menuElement = document.querySelector('dropdown-menu')

menuElement.options = [
  {name: "option 1", value: "option_1"},
  {name: "option 2", value: "option_2"},
  {name: "option 3", value: "option_3"}
]
```

### Event

#### change event
When user choose one option, a `change` event will be dispatch, and you can bind an event listener to handle it:

```js
let menuElement = document.querySelector('dropdown-menu')

menuElement.addEventListener('change', function(option) {
  console.log(option.detail)
  /*
    output example:
      { name: "option 2", value: "option_2" }
   */
})
```

[wc-image]: https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square
[wc-url]: https://www.webcomponents.org/element/wc-dropdown

[coverage-image]: https://img.shields.io/endpoint?style=flat-square&url=https%3A%2F%2Fgist.githubusercontent.com%2Fyishiashia%2Fdee60aefdce58a7559baeb7c5deb3a8b%2Fraw%2Fwc-dropdown__heads_master.json
[coverage-url]: https://gist.githubusercontent.com/yishiashia/dee60aefdce58a7559baeb7c5deb3a8b/raw/wc-dropdown__heads_master.json

[js-image]: https://img.shields.io/badge/ES-6%2B-ff69b4.svg?style=flat-square
[js-url]: https://www.ecma-international.org/ecma-262/6.0/

[ts-image]: https://img.shields.io/badge/TypeScript-^4.7.4-blue?style=flat-square
[ts-url]: https://www.typescriptlang.org/
