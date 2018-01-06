/* @flow */

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';
import { clearPastedStyle } from '../src';
import { typoRules } from '../src/rules';

type Props = {};

type State = {
  editorState: EditorState,
};

const style = {
  border: '5px solid brown',
  width: '50%',
  margin: '50px auto',
  minHeight: '200px',
  padding: '10px',
};

class MyEditor extends React.Component<Props, State> {
  onChange: EditorState => void;

  constructor(props: Props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => {
      const ES = clearPastedStyle(editorState);
      this.setState({ editorState: ES });
    };
  }

  render() {
    return (
      <div style={style}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </div>
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
