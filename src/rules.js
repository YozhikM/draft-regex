/* @flow */

import type { Rule } from './replaceTextRegex';

export const typoRules: Array<Rule> = [
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
