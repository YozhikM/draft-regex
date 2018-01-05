/* @flow */

import * as React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Editor, EditorState } from 'draft-js';
import { replaceTextRegex } from '../src';
import { typoRules } from '../src/rules';

type Props = {};

type State = {
  editorState: EditorState,
};

const Wrapper = styled.div`
  border: 5px solid brown;
  width: 50%;
  margin: 50px auto;
  min-height: 200px;
  padding: 10px;
`;

class MyEditor extends React.Component<Props, State> {
  onChange: EditorState => void;

  constructor(props: Props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => {
      const ES = replaceTextRegex(editorState, typoRules);
      this.setState({ editorState: ES });
    };
  }

  render() {
    return (
      <Wrapper>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </Wrapper>
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
