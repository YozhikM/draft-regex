/* @flow */

import { EditorState, ContentState, ContentBlock } from 'draft-js';
import { createContentBlock } from './replaceTextRegex';

export default function clearPastedStyle(
  editorState: EditorState,
  options?: {
    blockTypes?: Array<string>,
    replaceHeader?: boolean,
    shiftHeader?: string,
    replaceList?: boolean,
    shiftList?: string,
  },
): EditorState {
  const CS = editorState.getCurrentContent();
  const SS = editorState.getSelection();
  const { blockTypes, replaceHeader, shiftHeader, replaceList, shiftList } = options || {};

  const blockMap = CS.getBlockMap().map((block: ContentBlock) => {
    if (blockTypes && blockTypes.indexOf(block.type) === -1) {
      return createContentBlock(block, { type: 'unstyled' });
    }
    if (replaceHeader && block.type.slice(0, 6) === 'header') {
      return createContentBlock(block, { type: shiftHeader });
    }

    if (replaceList && block.type.slice(-4) === 'item') {
      return createContentBlock(block, { type: shiftList });
    }
    return block;
  });
  const newCS: ContentState = new ContentState({ blockMap });
  const newEditorState = EditorState.createWithContent(newCS);
  const ES = EditorState.forceSelection(newEditorState, SS);

  return ES;
}
