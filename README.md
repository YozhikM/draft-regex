# Draft Regex

[![NPM version](http://img.shields.io/npm/v/draft-regex.svg)](https://www.npmjs.org/package/draft-regex)
[![npm](https://img.shields.io/npm/dt/draft-regex.svg)](http://www.npmtrends.com/draft-regex)
[![install size](https://packagephobia.now.sh/badge?p=draft-regex@1.2.3)](https://packagephobia.now.sh/result?p=draft-regex@1.2.3)
[![Greenkeeper badge](https://badges.greenkeeper.io/YozhikM/draft-regex.svg)](https://greenkeeper.io/)
![FlowType compatible](https://img.shields.io/badge/flowtype-compatible-brightgreen.svg)

These plugins are written for Draft.js and React to improve TextEditor capabilities.

To use static typing, make sure [that you have installed Flow](https://flow.org/en/docs/install).

## Requirements

* [draft-js](https://github.com/facebook/draft-js)
* [react](https://github.com/facebook/react)
* [react-dom](https://github.com/facebook/react)

## Getting started

```bash
npm install draft-regex
```

or

```bash
yarn add draft-regex
```

## How to use

```js
import * as React from 'react';
import { EditorState, Editor } from 'draft-js';
import { clearEmptyBlocks, clearPastedStyle, replaceTextRegex } from 'draft-regex';

type State = {
  editorState: EditorState,
};

class MyEditor extends React.Component<void, State> {
  state: State = {
    editorState: EditorState.createEmpty(),
  };

  onChange = (editorState: EditorState) => {
    this.setState({ editorState: clearEmptyBlocks(editorState) });
  };

  handlePastedText = (text: ?string, html: ?string, editorState: EditorState) => {
    this.setState({ editorState: clearPastedStyle(editorState) });
  };

  onSave = () => {
    const { editorState } = this.state;
    this.setState({ editorState: replaceTextRegex(editorState) });
  };

  render() {
    const { editorState } = this.state;
    return (
      <>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          handlePastedText={this.handlePastedText}
        />
        <button onClick={this.onSave}>Save</button>
      </>
    );
  }
}
```

## API

All plugin as an argument are taken by EditorState and options and returned EditorState.

### clearEmptyBlocks

Prevents the ability to add blank lines more than 3 (varies in settings).

A second argument can take a `number` for remove blank lines (number + 1).

```js
function clearEmptyBlocks(editorState: EditorState, maxEmptyLines?: number = 2): EditorState
```

### replaceTextRegex

Apply regular expressions to the entire text, in the process of typing or after copy/pasting text.

A second argument can take an array of rules. `typoRules` is a set of basic rules that you can not use.

All regular expressions are used once in the entire text. If you use a lot of regular expressions, the performance of the editor can drop noticeably.

```js
function replaceTextRegex(
  editorState: EditorState,
  rulesArray?: Array<Rule> = typoRules,
): EditorState
```

The rule looks like this: `{ reg: new RegExp(), shift: '' }`

### clearPastedStyle

Clears styles of copy/pasted text to those that you have.

A second argument can take an object that can contain `options`.

`blockTypes` is an array of strings that contains all the types of blocks that you use in your editor. This is useful if you want to clear all styles, except those you can already ask yourself.

A list of all types can be found [here](https://draftjs.org/docs/api-reference-content-block.html#content).

If you do not want to use all six kinds of headings, you can bring the headers to the same view using `shiftHeader`.

The same applies to lists.

```js
function clearPastedStyle(
  editorState: EditorState,
  options?: {
    blockTypes?: Array<string>,
    shiftHeader?: string,
    shiftList?: string,
  }
): EditorState
```

## Hints

To improve performance, use `clearPastedStyle` to `handlePastedText` method, and `replaceTextRegex` to save the text editor.
