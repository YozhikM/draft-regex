
# Draft Regex

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

#### `replaceTextRegex`
Apply regular expressions to the entire text, in the process of typing or after copy/pasting text.

#### `clearPastedStyle`
Clears styles of copy/pasted text to those that you have.
