/* eslint-disable react/no-multi-comp */

import React from 'react';
import Submit from '../src/Submit.react';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { jsdom } from 'jsdom';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('Submit', () => {
  const container = TestUtils.renderIntoDocument(
    <Submit disabled onClick={() => {}}>Send</Submit>
  );

  const submit = TestUtils.findRenderedComponentWithType(container, Submit);

  it('should have children prop', () => {
    assert.equal(submit.props.children, 'Send');
  });

  it('should have onClick in prop', () => {
    assert.typeOf(submit.props.onClick, 'function');
  });

  it('should have disabled in prop', () => {
    assert.isTrue(submit.props.disabled);
  });
});
