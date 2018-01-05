/* @flow */

import { EditorState, SelectionState, ContentState } from 'draft-js';

function getEmptyCountBefore(contentState: ContentState, key: string): number {
  const block = contentState.getBlockBefore(key);
  if (block && block.getText() === '') {
    return 1 + getEmptyCountBefore(contentState, block.getKey());
  }
  return 0;
}

function getEmptyCountAfter(contentState: ContentState, key: string): number {
  const block = contentState.getBlockAfter(key);
  if (block && block.getText() === '') {
    return 1 + getEmptyCountAfter(contentState, block.getKey());
  }
  return 0;
}

export default function clearEmptyBlocks(editorState: EditorState): EditorState {
  const CS = editorState.getCurrentContent();
  const SS = editorState.getSelection();
  const currentKey = SS.getFocusKey();
  const currentBlock = CS.getBlockForKey(currentKey);

  const emptyBefore = getEmptyCountBefore(CS, currentKey);
  const emptyAfter = getEmptyCountAfter(CS, currentKey);

  const MAX_EMPTY_LINES = 2;

  // Be carefull, all checks are very important. And its order of checks also important.
  // 1. Check hole above current line
  // 2. Check hole below current line
  // 3. Check hole between two non-empty lines
  if (
    emptyBefore > MAX_EMPTY_LINES ||
    emptyAfter > MAX_EMPTY_LINES ||
    (emptyBefore + emptyAfter >= MAX_EMPTY_LINES &&
      currentBlock.getText() === '' &&
      currentBlock !== CS.getLastBlock())
  ) {
    let keyForRemove;
    let keyForFocus;
    if (currentBlock.getText() === '') {
      keyForRemove = currentKey;
      keyForFocus = CS.getKeyBefore(currentKey);
    } else {
      keyForRemove = CS.getKeyBefore(currentKey);
      keyForFocus = currentKey;
    }

    const newBlockMap = CS.getBlockMap().delete(keyForRemove);
    const newCS: ContentState = new ContentState({ blockMap: newBlockMap });
    const newEditorState = EditorState.createWithContent(newCS);
    const newSS = SelectionState.createEmpty(keyForFocus || newCS.getFirstBlock().getKey());
    const ES = EditorState.forceSelection(newEditorState, newSS);

    return ES;
  }

  return editorState;
}
