/* eslint-disable react/no-multi-comp */

import React from 'react';
import Button from '../src/Button.react';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { jsdom } from 'jsdom';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('Button', () => {
  const container = TestUtils.renderIntoDocument(
    <Button disabled onClick={() => {}}>Send</Button>
  );
  const button = TestUtils.findRenderedComponentWithType(container, Button);

  it('should have children prop', () => {
    assert.equal(button.props.children, 'Send');
  });

  it('should have onClick in prop', () => {
    assert.typeOf(button.props.onClick, 'function');
  });

  it('should have disabled in prop', () => {
    assert.isTrue(button.props.disabled);
  });
});
