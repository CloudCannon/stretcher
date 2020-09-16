---
layout: base
footer_markdown: >-
    [Github](https://github.com/cloudcannon/stretcher) /
    [Core](https://www.npmjs.com/package/stretcher) /
    [Webpack Loader](https://www.npmjs.com/package/stretcher-loader) /
    [SCSS Importer](https://www.npmjs.com/package/stretcher-importer) /
    [Rubygem](https://rubygems.org/gems/jekyll-stretcher)
---

# Stretcher Docs
Stretcher is a custom SCSS syntax for scaling values between two screen sizes.

## Demo
`font-size: 10px -> 25px;`
1. 🕺 `min:400px | max:1300px`
2. 🕺 `min:500px | max:1200px`
3. 🕺 `min:600px | max:1100px`
4. 🕺 `min:700px | max:1000px`
5. 🕺 `min:800px | max: 900px`

---

## Syntax
Stretcher lines look like this: `font-size: 12px -> 24px;`  
This means the following: 
- Below our minimum screen size, `font-size` should be `12px`
- Above our maximum screen size, `font-size` should be `24px`
- In between these screen sizes, `font-size` should scale smoothly from `12px` to `24px`

It works with any fixed values:
```
width: 10px -> 20px;
width: 1em -> 5em;
width: 3rem -> 9rem;
width: 100cm -> 1000cm;
```

However, variable values `(%, vw, vh, vmin, vmax)` aren't calculated correctly in CSS so don't yet work as expected.

---

## Configuration
Stretcher pulls the min and max screen sizes from the SCSS variables, `$stretcher-min` and `$stretcher-max`  
These can be defined at the global level:  
```
$stretcher-min: 375px;
$stretcher-max: 1440px;

@import 'all-styles'
```

You can also define these within blocks, for overrides. This will change the values within this scope, but not the global values:
```
$stretcher-min: 375px;
$stretcher-max: 1440px;

.c-heading {
    $stretcher-min: 800px;
    $stretcher-max: 1200px;

    font-size: 10px -> 20px; // Screen widths 800px and 1200px
}

.c-subheading {
    font-size: 20px -> 30px; // Screen widths 375px and 1440px
}
```

---

## Installation

### Jekyll
For jekyll usage, use the `jekyll-stretcher` gem. This will then support the stretcher syntax anywhere in the SCSS pipeline [site, theme, ...]
```
group :jekyll_plugins do
    gem "jekyll-stretcher", "~> 0.1"
end
```
You may also need the following in you `_config.yml`
```
plugins:
  - jekyll-stretcher
```


### Webpack
If you're transforming SCSS files through webpack, you can use the `stretcher-loader` npm package.
```
...
{
    test: /\.scss$/,
    use: [
        ...
        'stretcher-loader'
        ...
    ]
}
...
```
*If you're also compiling the SCSS through webpack, you'll need to use the importer below*

### Node Sass
For compiling SCSS anywhere that can use **node-sass**, you can use the `stretcher-importer` npm package. For example, in webpack:
```
...
{
    test: /\.scss$/,
    use: [
        ...
        {
            loader: 'sass-loader',
            options: {
                implementation: require("node-sass"),
                sassOptions: {
                    importer: require('stretcher-importer') // <--- here
                }
            }
        }
        ...
    ]
}
...
```


