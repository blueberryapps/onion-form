import * as actions from '../src/actions';
import TestUtils from 'react-addons-test-utils';
import Form from '../src/Form.react';
import reducer from '../src/reducer';
import React, { Component } from 'react';
import sinon from 'sinon';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { assert } from 'chai';
import { Provider as ReduxProvider } from 'react-redux';

const initial = {
  onionForm: {
    fields: {
      OnionForm: {
        firstName: {
          customProperty: 'Hi Hello From State',
          value: 'Foo',
          error: 'required'
        },
        lastName: {}
      }
    }
  }
};

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;


describe('Form', () => {
  class Passthrough extends Component {
    static contextTypes = {
      onionFormName: React.PropTypes.string,
      onionLiveValidate: React.PropTypes.func,
      onionOnSubmit: React.PropTypes.func
    }

    render() {
      return <div />;
    }
  }

  const isRequired = () => (value) => ((!value) ? 'required' : null);
  const onSubmit = sinon.stub();
  const validations = {
    firstName: [isRequired()],
    lastName: [isRequired()]
  };

  const createContainer = (validations) => {
    const store = createStore((state, action) => ({ onionForm: reducer(state.onionForm, action) }), initial);
    return TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="OnionForm" validations={validations} onSubmit={onSubmit}>
          <Passthrough />
        </Form>
      </ReduxProvider>
    );
  };

  const container = createContainer(validations);
  const passthrough = TestUtils.findRenderedComponentWithType(container, Passthrough);
  const form = TestUtils.findRenderedComponentWithType(container, Form);
  const passthroughCtx = passthrough.context;

  it('should pass a onionFormName in context to childs', () => {
    assert.equal(passthroughCtx.onionFormName, 'OnionForm');
  });

  it('should pass a onionLiveValidate in context to childs', () => {
    assert.typeOf(passthroughCtx.onionLiveValidate, 'function');
  });

  it('should pass a onionLiveValidate in context to childs', () => {
    assert.typeOf(passthroughCtx.onionLiveValidate, 'function');
  });

  it('should pass a onionOnSubmit in context to childs', () => {
    assert.typeOf(passthroughCtx.onionOnSubmit, 'function');
  });

  it('should have validate()', () => {
    assert.typeOf(form.validate, 'function');
  });

  it('should have onSubmit()', () => {
    assert.typeOf(form.onSubmit, 'function');
  });

  it('should have liveValidate()', () => {
    assert.typeOf(form.liveValidate, 'function');
  });

  it('should have formValidate()', () => {
    assert.typeOf(form.formValidate, 'function');
  });

  it('should dispatch right action on formValidate()', () => {
    assert.equal(form.formValidate().type, actions.SET_ONION_FORM_MULTIPLE_FIELDS);
    assert.equal(form.formValidate().property, 'error');
  });

  describe('_submit()', () => {
    const containerWithoutValidations = createContainer({});
    const formWithoutValidations = TestUtils.findRenderedComponentWithType(containerWithoutValidations, Form);

    it('should call onSubmit() callback when form valid', () => {
      assert(formWithoutValidations._isValid(), 'Form should be valid');
      assert(formWithoutValidations._submit(), 'Form should be submitted');
      sinon.assert.calledWith(onSubmit, {
        name: 'OnionForm',
        values: {
          firstName: 'Foo',
          lastName: null
        }
      });
    });
  });

  describe('formValidate()', () => {
    it('should validate fields', () => {
      assert.deepEqual(form.formValidate().values, {
        firstName: null,
        lastName: 'required'
      });
    });
  });
});
