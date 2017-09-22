/* eslint-disable react/no-multi-comp */

import React from 'react';
import Button from '../src/Button.react';
import TestUtils from 'react-addons-test-utils';
import { jsdom } from 'jsdom';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('Button', () => {
  const container = TestUtils.renderIntoDocument(
    <Button disabled onClick={() => {}}>Send</Button>
  );
  const button = TestUtils.findRenderedComponentWithType(container, Button);

  it('should have children prop', () => {
    expect(button.props.children).toBe('Send');
  });

  it('should have onClick in prop', () => {
    expect(typeof button.props.onClick).toBe('function');
  });

  it('should have disabled in prop', () => {
    expect(button.props.disabled).toBe(true);
  });
});
