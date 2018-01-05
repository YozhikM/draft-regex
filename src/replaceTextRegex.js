/* @flow */

import {
  CharacterMetadata,
  EditorState,
  SelectionState,
  ContentState,
  ContentBlock,
} from 'draft-js';

export type Rule = { reg: RegExp, shift: string };

type Options = {
  [key: string]: boolean,
};

type OptionsObj = { [key: string]: Array<Rule> };

const optionRules: OptionsObj = {
  extraSpaces: [
    { reg: new RegExp(/\s+/g), shift: ' ' }, // "Лишние пробелы"
    { reg: new RegExp(/(^\s*)|(\s*)$/g), shift: '' },
  ],
  spacesAfterPunctuationMarks: [{ reg: new RegExp(/(,|\.)(\S)/g), shift: '$1 $2' }],
};

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

function prepareOptionableRules(options: Options): Array<Rule> {
  const acc: Array<Rule> = [];
  Object.keys(options).forEach(key => {
    acc.push(...optionRules[key]);
    return acc;
  });
  if (acc.length > 0) return acc;
  return [];
}

export default function replaceTextRegex(editorState: EditorState, rulesArray: Array<Rule>, options?: Options): EditorState {
  const CS = editorState.getCurrentContent();
  const CSMap = CS.getBlockMap();
  const CSText = CS.getPlainText();

  const optionableRules: Array<Rule> = [];
  if (options) {
    const preparedRules = prepareOptionableRules(options);
    optionableRules.push(...preparedRules);
  }
  const rules = options ? rulesArray.concat(optionableRules) : rulesArray;

  let rule;
  const match = rules.some(typoRule => {
    rule = typoRule;
    return typoRule && typoRule.reg.exec(CSText);
  });

  if (match) {
    const { reg, shift } = rule || {};

    const SS = editorState.getSelection();
    const key = SS.getAnchorKey();
    const anchorOffset = SS.getAnchorOffset();
    const currentContentBlock = CS.getBlockForKey(key);
    const text = currentContentBlock.getText().replace(reg, shift);
    const newBlock = createContentBlock(currentContentBlock, {
      text,
      key,
    });

    const diffInLengths = currentContentBlock.getLength() - newBlock.getLength();
    const newSS = createSelectionState(key, anchorOffset - diffInLengths);

    const newBlockMap = CSMap.set(key, newBlock);
    const newCS: ContentState = new ContentState({ blockMap: newBlockMap });
    const ES = EditorState.createWithContent(newCS);
    const forceES = EditorState.forceSelection(ES, newSS);
    const forceESText = forceES.getCurrentContent().getPlainText();

    if (forceESText !== CSText) {
      return forceES;
    }
    return editorState;
  }
  return editorState;
}
