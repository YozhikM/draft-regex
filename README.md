
# Draft Regex

[![Greenkeeper badge](https://badges.greenkeeper.io/YozhikM/draft-regex.svg)](https://greenkeeper.io/)

These plugins are written for Draft.js and React to improve TextEditor capabilities.

To use static typing, make sure [that you have installed Flow](https://flow.org/en/docs/install).

## Getting started

```
npm install draft-regex
```
or
```
yarn add draft-regex
```

## How to use

![Draft Regex](https://i.imgur.com/xzQyZpj.png)

## API

All plugin as an argument are taken by EditorState and options and returned EditorState.

### clearEmptyBlock

Prevents the ability to add blank lines more than 3 (varies in settings).

A second argument can take a `number` for remove blank lines (number + 1).

````js
function clearEmptyBlocks(editorState: EditorState, maxEmptyLines?: number = 2): EditorState
````

### replaceTextRegex

Apply regular expressions to the entire text, in the process of typing or after copy/pasting text.

A second argument can take an array of rules. `typoRules` is a set of basic rules that you can not use.

A third argument can take an object that can contain `options`, which you can expand to use the plugin is very flexible.

`extraSpaces` are simple regular expressions that forbid doing more than one space in a row.

All regular expressions are used once in the entire text. If you use a lot of regular expressions, the performance of the editor can drop noticeably.

````js
function replaceTextRegex(
  editorState: EditorState,
  rulesArray?: Array<Rule> = typoRules,
  options?: Options = { extraSpaces: true }
): EditorState
````

The rule looks like this: `{ reg: new RegExp(), shift: '' }`

### clearPastedStyle
Clears styles of copy/pasted text to those that you have.

A second argument can take an object that can contain `options`.

`blockTypes` is an array of strings that contains all the types of blocks that you use in your editor. This is useful if you want to clear all styles, except those you can already ask yourself.

If you do not want to use all six kinds of headings, you can bring the headers to the same view using `replaceHeader` and `shiftHeader`.

The same applies to lists.


````js
function clearPastedStyle(
  editorState: EditorState,
  options?: {
    blockTypes?: Array<string>,
    replaceHeader?: boolean,
    shiftHeader?: string,
    replaceList?: boolean,
    shiftList?: string,
  }
): EditorState
````

## Hints

To improve performance, use `clearPastedStyle` to `handlePastedText` method, and `replaceTextRegex` to save the text editor.
