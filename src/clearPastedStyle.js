/* @flow */

import { EditorState, ContentState } from 'draft-js';
import { createContentBlock } from './replaceTextRegex';

const BLOCK_TYPES = ['header-three', 'unordered-list-item', 'ordered-list-item'];

export default function clearPastedStyle(editorState: EditorState): EditorState {
  const CS = editorState.getCurrentContent();
  const SS = editorState.getSelection();

  const blockMap = CS.getBlockMap().map(block => {
    if (BLOCK_TYPES.indexOf(block.type) === -1) {
      if (block.type.slice(0, 6) === 'header') {
        return createContentBlock(block, { type: 'header-three' });
      }
      return createContentBlock(block, { type: 'unstyled' });
    }
    return block;
  });
  const newCS: ContentState = new ContentState({ blockMap });
  const newEditorState = EditorState.createWithContent(newCS);
  const ES = EditorState.forceSelection(newEditorState, SS);

  return ES;
}
