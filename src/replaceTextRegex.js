/* @flow */

import {
  CharacterMetadata,
  EditorState,
  SelectionState,
  ContentState,
  ContentBlock,
} from 'draft-js';

type Rule = { reg: RegExp, shift: string };

const typoRules: Array<Rule> = [
  { reg: new RegExp(/"([^"]+)"/g), shift: '«$1»' },
  { reg: new RegExp(/(^|[^!?:;,.…]) ([!?:;,.…])(?!\))/g), shift: '$1$2' },
  { reg: new RegExp(/([A-Z][,.!?;…–])+?([A-Z])/gi), shift: '$1 $2' },
  { reg: new RegExp(/\s+/g), shift: ' ' },
];

function createSelectionState(key: string, start: number = 0, end?: number): SelectionState {
  return new SelectionState({
    anchorKey: key,
    anchorOffset: start,
    focusKey: key,
    focusOffset: end || start,
  });
}

export function createContentBlock(
  block: ContentBlock,
  options?: {
    text?: string,
    key?: string,
    type?: string,
    characterList?: Array<CharacterMetadata>,
  }
): ContentBlock {
  const { text, key, type, characterList } = options || {};

  return new ContentBlock({
    text: text || block.getText(),
    key: key || block.getKey(),
    type: type || block.getType(),
    characterList: characterList || block.getCharacterList(),
  });
}

function replaceText(text: string, rule: Rule): string {
  const { reg, shift } = rule || {};

  if (text.match(reg)) return text.replace(reg, shift);
  return text;
}

function getRecordBlock(rules: Array<Rule>, currentContentBlock: ContentBlock): ContentBlock {
  let text = currentContentBlock.getText().slice();
  for (let i = 0; i < rules.length; i + 1) {
    text = replaceText(text, rules[i]);
  }
  return createContentBlock(currentContentBlock, {
    text,
    key: currentContentBlock.getKey(),
  });
}

function applyMatchedRules(rules: Array<Rule>, editorState: EditorState): EditorState {
  const contentState = editorState.getCurrentContent();
  const anchorKey = editorState.getSelection().getAnchorKey();

  const newBlockMap: Map<string, ContentBlock> = contentState
    .getBlockMap()
    .map((block: ContentBlock) => getRecordBlock(rules, block));

  const currentBlock = contentState.getBlockForKey(anchorKey);
  const newCurrentBlock = newBlockMap.get(anchorKey);

  const anchorOffset = editorState.getSelection().getAnchorOffset();
  let diffInLengths = currentBlock.getLength() || 0;
  if (newCurrentBlock) {
    diffInLengths = currentBlock.getLength() - newCurrentBlock.getLength();
  }

  const newSelectionState = createSelectionState(anchorKey, anchorOffset - diffInLengths);
  const newContentState: ContentState = new ContentState({
    blockMap: newBlockMap,
  });
  const newEditorState = EditorState.createWithContent(newContentState);
  const forcedEditorState = EditorState.forceSelection(newEditorState, newSelectionState);

  if (forcedEditorState.getCurrentContent().getPlainText() !== contentState.getPlainText()) {
    return forcedEditorState;
  }
  return editorState;
}

export default function replaceTextRegex(
  editorState: EditorState,
  rulesArray?: Array<Rule> = typoRules
): EditorState {
  return applyMatchedRules(rulesArray, editorState);
}
