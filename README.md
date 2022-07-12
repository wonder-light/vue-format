# vue-format 扩展

用于vue文件的格式化扩展

## 说明

为Vue文件提供一个格式化命令
可以格式化\<template>，\<script>,\<style>中的内容
可以单独配置 html, javascript, css 功能

## 使用

在文本编辑器中，打开右键菜单，选择“格式化vue”即可格式化文件

## 快捷键
- win: `Ctrl + Alt + P`
- mac: `Ctrl + Cmd + p`

## 配置

```json
{
    "vue-format.javascript.disabled": false,    //"禁用 vue-format.javascript"
    "vue-format.javascript.eol": "auto",    //"默认行尾字符"
    "vue-format.javascript.format": {  //javascript的格式化配置 (详情查看js-beautify)
        "indent_size": "4",
        "indent_char": " ",
        "preserve_newlines": true,
        "max_preserve_newlines": "2",
        "keep_array_indentation": true,
        "break_chained_methods": false,
        "indent_scripts": "separate",
        "brace_style": "none",
        "space_before_conditional": true,
        "unescape_strings": true,
        "jslint_happy": true,
        "end_with_newline": false,
        "wrap_line_length": "160",
        "indent_inner_html": false,
        "comma_first": false,
        "e4x": true,
        "indent_empty_lines": true
    },


    "vue-format.html.disabled": false,    //"禁用 vue-format.html"
    "vue-format.html.eol": "auto",    //"默认行尾字符"
    "vue-format.html.wrap_attributes": "auto",
    "vue-format.html.format": {
        "indent_size": "2",
        "indent_char": " ",
        "preserve_newlines": true,
        "max_preserve_newlines": "2",
        "wrap_line_length": "160",
        "indent_scripts": "separate",
        "indent_empty_lines": true,
        "brace_style": "none",
        "indent_inner_html": false,
        "indent_handlebars": false,
        "end_with_newline": false
    },



    "vue-format.css.disabled": false,    //"禁用 vue-format.css"
    "vue-format.css.eol": "auto",    //"默认行尾字符"
    "vue-format.css.wrap_attributes": "auto",
    "vue-format.css.format": {
        "indent_size": "4",
        "indent_char": " ",
        "preserve_newlines": true,
        "max_preserve_newlines": "2",
        "wrap_line_length": "160",
        "indent_scripts": "separate",
        "indent_empty_lines": true,
        "brace_style": "none",
        "indent_inner_html": false,
        "end_with_newline": false,
        "selector_separator_newline": false,
        "newline_between_rules": false,
        "space_around_selector_separator": true,
        "space_around_combinator": true
    },
}

```