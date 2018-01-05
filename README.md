
# Draft Regex

[![Greenkeeper badge](https://badges.greenkeeper.io/YozhikM/draft-regex.svg)](https://greenkeeper.io/)

These plugins are written for Draft.js and React to improve TextEditor capabilities.

## In details

1. `git clone https://github.com/YozhikM/draft-regex.git`
2. `npm install` *or* `yarn install`
3. `npm start` *or* `yarn start` for demo
4. `npm run build` *or* `yarn build` for build of modules

To use static typing, make sure [that you have installed Flow](https://flow.org/en/docs/install).

## How to use

![Draft Regex](https://i.imgur.com/xzQyZpj.png)

## API

All plugin as an argument are taken by EditorState and options and returned EditorState.

#### `clearEmptyBlock`
Prevents the ability to add blank lines more than 3 (varies in settings).
A second argument can take a number for remove blank lines (number + 1).

`function clearEmptyBlocks(editorState: EditorState, maxEmptyLines?: number = 2): EditorState`

#### `replaceTextRegex`
Apply regular expressions to the entire text, in the process of typing or after copy/pasting text.
A second argument can take an array of rules. TypoRules is a set of basic rules that you can not use.
A third argument can take an object that can contain options, which you can expand to use the plugin is very flexible.
ExtraSpaces are simple regular expressions that forbid doing more than one space in a row.

`function replaceTextRegex(
  editorState: EditorState,
  rulesArray?: Array<Rule> = typoRules,
  options?: Options = { extraSpaces: true }
): EditorState`

The rule looks like this: `{ reg: new RegExp(), shift: '' }`

#### `clearPastedStyle`
Clears styles of copy/pasted text to those that you have.
A second argument can take an object that can contain options.

`function clearPastedStyle(
  editorState: EditorState,
  options?: {
    blockTypes?: Array<string>,
    replaceHeader?: boolean,
    shiftHeader?: string,
    replaceList?: boolean,
    shiftList?: string,
  }
): EditorState`
