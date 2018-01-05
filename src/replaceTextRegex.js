/* @flow */

import {
  CharacterMetadata,
  EditorState,
  SelectionState,
  ContentState,
  ContentBlock,
} from 'draft-js';

type Rule = { reg: RegExp, shift: string };

type Options = {
  [key: string]: boolean,
};

type OptionsObj = { [key: string]: Array<Rule> };

const typoRules: Array<Rule> = [
  { reg: new RegExp(/"([^"]+)"/g), shift: '«$1»' },
  { reg: new RegExp(/(\() +/g), shift: '(' }, // "Удаление лишних пробелов
  { reg: new RegExp(/ +\)/g), shift: ')' }, // после открывающей и перед закрывающей скобкой"
  { reg: new RegExp(/(\d)( |\u00A0)(%|‰|‱)/g), shift: '$1$3' }, // "Удаление пробела перед %, ‰ и ‱"
  { reg: new RegExp(/\(r\)/gi), shift: '®' },
  { reg: new RegExp(/(copyright )?\((c|с)\)/gi), shift: '©' },
  { reg: new RegExp(/\(tm\)/gi), shift: '™' }, // "(c) → ©, (tm) → ™, (r) → ®"
  { reg: new RegExp(/<[^>]+>/g), shift: '' }, // "Удаление HTML-тегов"
  { reg: new RegExp(/(^|\D)1\/2(\D|$)/g), shift: '$1½$2' },
  { reg: new RegExp(/(^|\D)1\/4(\D|$)/g), shift: '$1¼$2' },
  { reg: new RegExp(/(^|\D)3\/4(\D|$)/g), shift: '$1¾$2' }, // "1/2 → ½, 1/4 → ¼, 3/4 → ¾"
  { reg: new RegExp(/!=/g), shift: '≠' },
  { reg: new RegExp(/<=/g), shift: '≤' },
  { reg: new RegExp(/(^|[^=])>=/g), shift: '$1≥' },
  { reg: new RegExp(/<</g), shift: '≪' },
  { reg: new RegExp(/>>/g), shift: '≫' },
  { reg: new RegExp(/~=/g), shift: '≅' },
  { reg: new RegExp(/(^|[^+])\+-/g), shift: '$1±' },
  { reg: new RegExp(/([!?]) (?=[!?])/g), shift: '$1' },
  // { reg: new RegExp(/(^|[^!?:;,.…]) ([!?:;,.])(?!\))/g), shift: '$1$2' },
  // { reg: new RegExp(/\n[ \t]+/g), shift: '\n' },
  { reg: new RegExp(/(^|[^.])(\.\.\.|…),/g), shift: '$1…' },
  { reg: new RegExp(/(!|\?)(\.\.\.|…)(?=[^.]|$)/g), shift: '$1..' }, // "«?…» → «?..», «!…» → «!..», «…,» → «…»"
  { reg: new RegExp(/([а-яё])(\.\.\.|…)([А-ЯЁ])/g), shift: '$1$2 $3' },
  // { reg: new RegExp(/([?!]\.\.)([а-яёa-z])/gi), shift: '$1 $2' }, // "Пробел после «...», «!..» и «?..»"
  { reg: new RegExp(/[«'"„“]([^"'“]*(?:«»[^'"“]*)*)['"»“„]/g), shift: '«$1»' },
  // { reg: new RegExp(), shift: '' },
];

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

export default function replaceTextRegex(editorState: EditorState, options?: Options): EditorState {
  const CS = editorState.getCurrentContent();
  const CSMap = CS.getBlockMap();
  const CSText = CS.getPlainText();

  const optionableRules: Array<Rule> = [];
  if (options) {
    const preparedRules = prepareOptionableRules(options);
    optionableRules.push(...preparedRules);
  }
  const rules = options ? typoRules.concat(optionableRules) : typoRules;

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
