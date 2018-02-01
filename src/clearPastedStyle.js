/* @flow */

import { EditorState, ContentState, ContentBlock } from 'draft-js';
import { createContentBlock } from './replaceTextRegex';

export default function clearPastedStyle(
  editorState: EditorState,
  options?: {
    blockTypes?: Array<string>,
    shiftHeader?: string,
    shiftList?: string,
  }
): EditorState {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const { blockTypes, shiftHeader, shiftList } = options || {};

  const blockMap = contentState.getBlockMap().map((block: ContentBlock) => {
    if (shiftHeader && block.type.slice(0, 6) === 'header') {
      return createContentBlock(block, { type: shiftHeader });
    }
    if (shiftList && block.type.slice(-4) === 'item') {
      return createContentBlock(block, { type: shiftList });
    }
    if (blockTypes && blockTypes.indexOf(block.type) === -1) {
      return createContentBlock(block, { type: 'unstyled' });
    }
    if (!blockTypes) return createContentBlock(block, { type: 'unstyled' });

    return block;
  });
  const newContentState: ContentState = new ContentState({ blockMap });
  const newEditorState = EditorState.createWithContent(newContentState);
  const finalEditorState = EditorState.acceptSelection(newEditorState, selectionState);

  return finalEditorState;
}
