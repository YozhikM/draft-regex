
# Draft Regex

These plugins are written for Draft.js and React to improve TextEditor capabilities.

## Usage

1. `git clone https://github.com/YozhikM/draft-regex.git`
2. `npm install` *or* `yarn install`
3. `npm start` *or* `yarn start`
4. `npm test` *or* `yarn test`

To use static typing, make sure [that you have installed Flow](https://flow.org/en/docs/install).

## API

All plugin as an argument are taken by EditorState and returned it.

#### `clearEmptyBlock`
Prevents the ability to add blank lines more than 3 (varies in settings).

#### `replaceTextRegex`
Apply regular expressions to the entire text, in the process of typing or after copy/pasting text.

#### `clearPastedStyle`
Clears styles of copy/pasted text to those that you have.
