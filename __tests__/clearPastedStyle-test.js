/* @flow */

import { describe, it, expect } from 'jest';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { pastedHTMLWOOptions, pastedHTMLBlockTypes } from '../mocks/pastedHTML';
import clearPastedStyle from '../src/clearPastedStyle';

describe('clearPastedStyle', () => {
  it('clearPastedStyle WO options', () => {
    const blocks = convertFromHTML(pastedHTMLWOOptions);
    if (!blocks || !Array.isArray(blocks) || !blocks.length) return;
    const contentState = ContentState.createFromBlockArray(blocks);
    const editorState = EditorState.createWithContent(contentState);

    const types = [];
    editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        types.push(block.getType());
      });

    expect(types).toEqual(['unordered-list-item', 'unordered-list-item']);

    const clearEditorState = clearPastedStyle(editorState);

    const newTypes = [];
    clearEditorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        newTypes.push(block.getType());
      });

    expect(newTypes).toEqual(['unstyled', 'unstyled']);
  });

  it('clearPastedStyle with blockTypes', () => {
    const blocks = convertFromHTML(pastedHTMLBlockTypes);
    if (!blocks || !Array.isArray(blocks) || !blocks.length) return;
    const contentState = ContentState.createFromBlockArray(blocks);
    const editorState = EditorState.createWithContent(contentState);

    const types = [];
    editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        types.push(block.getType());
      });

    expect(types).toEqual(['header-three', 'code-block', 'unstyled']);

    const clearEditorState = clearPastedStyle(editorState, {
      blockTypes: ['header-three'],
    });

    const newTypes = [];
    clearEditorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        newTypes.push(block.getType());
      });

    expect(newTypes).toEqual(['header-three', 'unstyled', 'unstyled']);
  });

  it('clearPastedStyle with replaceHeader', () => {
    const blocks = convertFromHTML(pastedHTMLBlockTypes);
    if (!blocks || !Array.isArray(blocks) || !blocks.length) return;
    const contentState = ContentState.createFromBlockArray(blocks);
    const editorState = EditorState.createWithContent(contentState);

    const types = [];
    editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        types.push(block.getType());
      });

    expect(types).toEqual(['header-three', 'code-block', 'unstyled']);

    const clearEditorState = clearPastedStyle(editorState, {
      replaceHeader: true,
      shiftHeader: 'header-one',
    });

    const newTypes = [];
    clearEditorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        newTypes.push(block.getType());
      });

    expect(newTypes).toEqual(['header-one', 'unstyled', 'unstyled']);
  });

  it('clearPastedStyle with replaceList', () => {
    const blocks = convertFromHTML(pastedHTMLWOOptions);
    if (!blocks || !Array.isArray(blocks) || !blocks.length) return;
    const contentState = ContentState.createFromBlockArray(blocks);
    const editorState = EditorState.createWithContent(contentState);

    const types = [];
    editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        types.push(block.getType());
      });

    expect(types).toEqual(['unordered-list-item', 'unordered-list-item']);

    const clearEditorState = clearPastedStyle(editorState, {
      replaceList: true,
      shiftList: 'ordered-list-item',
    });

    const newTypes = [];
    clearEditorState
      .getCurrentContent()
      .getBlockMap()
      .forEach(block => {
        newTypes.push(block.getType());
      });

    expect(newTypes).toEqual(['ordered-list-item', 'ordered-list-item']);
  });
});
