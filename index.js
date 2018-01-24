'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = clearEmptyBlocks;

var _draftJs = require('draft-js');

function getEmptyCountBefore(contentState, key) {
  var block = contentState.getBlockBefore(key);
  if (block && block.getText() === '') {
    return 1 + getEmptyCountBefore(contentState, block.getKey());
  }
  return 0;
}

function getEmptyCountAfter(contentState, key) {
  var block = contentState.getBlockAfter(key);
  if (block && block.getText() === '') {
    return 1 + getEmptyCountAfter(contentState, block.getKey());
  }
  return 0;
}

function clearEmptyBlocks(editorState) {
  var maxEmptyLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var CS = editorState.getCurrentContent();
  var SS = editorState.getSelection();
  var currentKey = SS.getFocusKey();
  var currentBlock = CS.getBlockForKey(currentKey);

  var emptyBefore = getEmptyCountBefore(CS, currentKey);
  var emptyAfter = getEmptyCountAfter(CS, currentKey);

  // Be carefull, all checks are very important. And its order of checks also important.
  // 1. Check hole above current line
  // 2. Check hole below current line
  // 3. Check hole between two non-empty lines
  if (
    emptyBefore > maxEmptyLines ||
    emptyAfter > maxEmptyLines ||
    (emptyBefore + emptyAfter >= maxEmptyLines &&
      currentBlock.getText() === '' &&
      currentBlock !== CS.getLastBlock())
  ) {
    var keyForRemove = void 0;
    var keyForFocus = void 0;
    if (currentBlock.getText() === '') {
      keyForRemove = currentKey;
      keyForFocus = CS.getKeyBefore(currentKey);
    } else {
      keyForRemove = CS.getKeyBefore(currentKey);
      keyForFocus = currentKey;
    }

    var newBlockMap = CS.getBlockMap().delete(keyForRemove);
    var newCS = new _draftJs.ContentState({ blockMap: newBlockMap });
    var newEditorState = _draftJs.EditorState.createWithContent(newCS);
    var newSS = _draftJs.SelectionState.createEmpty(keyForFocus || newCS.getFirstBlock().getKey());
    var ES = _draftJs.EditorState.forceSelection(newEditorState, newSS);

    return ES;
  }

  return editorState;
}
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = clearPastedStyle;

var _draftJs = require('draft-js');

var _replaceTextRegex = require('./replaceTextRegex');

function clearPastedStyle(editorState, options) {
  var CS = editorState.getCurrentContent();
  var SS = editorState.getSelection();

  var _ref = options || {},
    blockTypes = _ref.blockTypes,
    replaceHeader = _ref.replaceHeader,
    shiftHeader = _ref.shiftHeader,
    replaceList = _ref.replaceList,
    shiftList = _ref.shiftList;

  var blockMap = CS.getBlockMap().map(function(block) {
    if (blockTypes && blockTypes.indexOf(block.type) === -1) {
      return (0, _replaceTextRegex.createContentBlock)(block, { type: 'unstyled' });
    }

    if (replaceHeader && block.type.slice(0, 6) === 'header') {
      return (0, _replaceTextRegex.createContentBlock)(block, { type: shiftHeader });
    }

    if (replaceList && block.type.slice(-4) === 'item') {
      return (0, _replaceTextRegex.createContentBlock)(block, { type: shiftList });
    }

    if (!blockTypes) return (0, _replaceTextRegex.createContentBlock)(block, { type: 'unstyled' });

    return block;
  });
  var newCS = new _draftJs.ContentState({ blockMap: blockMap });
  var newEditorState = _draftJs.EditorState.createWithContent(newCS);
  var ES = _draftJs.EditorState.forceSelection(newEditorState, SS);

  return ES;
}
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.clearPastedStyle = exports.replaceTextRegex = exports.clearEmptyBlocks = undefined;

var _clearEmptyBlocks = require('./clearEmptyBlocks');

var _clearEmptyBlocks2 = _interopRequireDefault(_clearEmptyBlocks);

var _replaceTextRegex = require('./replaceTextRegex');

var _replaceTextRegex2 = _interopRequireDefault(_replaceTextRegex);

var _clearPastedStyle = require('./clearPastedStyle');

var _clearPastedStyle2 = _interopRequireDefault(_clearPastedStyle);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.clearEmptyBlocks = _clearEmptyBlocks2.default;
exports.replaceTextRegex = _replaceTextRegex2.default;
exports.clearPastedStyle = _clearPastedStyle2.default;
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createContentBlock = createContentBlock;
exports.default = replaceTextRegex;

var _draftJs = require('draft-js');

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

var optionRules = {
  extraSpaces: [
    { reg: new RegExp(/\s+/g), shift: ' ' }, // "Extra spaces"
    { reg: new RegExp(/(^\s*)|(\s*)$/g), shift: '' },
  ],
  spacesAfterPunctuationMarks: [{ reg: new RegExp(/(,|\.)(\S)/g), shift: '$1 $2' }],
};

function createSelectionState(key) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments[2];

  return new _draftJs.SelectionState({
    anchorKey: key,
    anchorOffset: start,
    focusKey: key,
    focusOffset: end || start,
  });
}

function createContentBlock(block, options) {
  var _ref = options || {},
    text = _ref.text,
    key = _ref.key,
    type = _ref.type,
    characterList = _ref.characterList;

  return new _draftJs.ContentBlock({
    text: text || block.getText(),
    key: key || block.getKey(),
    type: type || block.getType(),
    characterList: characterList || block.getCharacterList(),
  });
}

function prepareOptionableRules(options) {
  var acc = [];
  Object.keys(options).forEach(function(key) {
    acc.push.apply(acc, _toConsumableArray(optionRules[key]));
    return acc;
  });
  if (acc.length > 0) return acc;
  return [];
}

function replaceTextRegex(editorState) {
  var rulesArray =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _rules2.default;
  var options =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { extraSpaces: true };

  var CS = editorState.getCurrentContent();
  var CSMap = CS.getBlockMap();
  var CSText = CS.getPlainText();

  var optionableRules = [];
  if (options) {
    var preparedRules = prepareOptionableRules(options);
    optionableRules.push.apply(optionableRules, _toConsumableArray(preparedRules));
  }
  var rules = options ? rulesArray.concat(optionableRules) : rulesArray;

  var rule = void 0;
  var match = rules.some(function(typoRule) {
    rule = typoRule;
    return typoRule && typoRule.reg.exec(CSText);
  });

  if (match) {
    var _ref2 = rule || {},
      _reg = _ref2.reg,
      _shift = _ref2.shift;

    var SS = editorState.getSelection();
    var _key = SS.getAnchorKey();
    var anchorOffset = SS.getAnchorOffset();
    var currentContentBlock = CS.getBlockForKey(_key);
    var text = currentContentBlock.getText().replace(_reg, _shift);
    var newBlock = createContentBlock(currentContentBlock, {
      text: text,
      key: _key,
    });

    var diffInLengths = currentContentBlock.getLength() - newBlock.getLength();
    var newSS = createSelectionState(_key, anchorOffset - diffInLengths);

    var newBlockMap = CSMap.set(_key, newBlock);
    var newCS = new _draftJs.ContentState({ blockMap: newBlockMap });
    var ES = _draftJs.EditorState.createWithContent(newCS);
    var forceES = _draftJs.EditorState.forceSelection(ES, newSS);
    var forceESText = forceES.getCurrentContent().getPlainText();

    if (forceESText !== CSText) {
      return forceES;
    }
    return editorState;
  }
  return editorState;
}
('use strict');

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var typoRules = [
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
];

exports.default = typoRules;

//# sourceMappingURL=index.js.map
