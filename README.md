
<img src="logo/aftermark-logo.png" style="width: 4rem;">

# Aftermark

Aftermark is a CLI-based HTML post-processor. Modify HTML files using JavaScript plugins. Currently the CLI requires a config to be defined in a [cosmic config-supported] config.

Example config:
```js
module.exports = {
  input: '', // define glob of files to process
  output: '', // if different from `input`
  plugins: [
    '': {
      
    }  
  ]
}
```

[@aftermark/funcdafy]() and [@aftermark/longlist-tagger]() are two plugins...
