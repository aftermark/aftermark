# @aftermark/longlist-tagger

You might want to style `<ul>` and `<ol>` elements differently depending on the number of child `<li>` elements they contain. For example, you might want a long list to be styled into multiple columns, but a multi-column layout might look weird with only a handful of list items.

With this plugin you can apply a special CSS class to `<ul>` and `<ol>` elements containing at least a certain number of child elements. For example, to apply the class `long-list` to lists containing at least 6 list items, you can configure this plugin like this:

```js
// aftermark.config.js

module.exports = {
...
}
```
