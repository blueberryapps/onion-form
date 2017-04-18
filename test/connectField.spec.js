/* eslint-disable react/no-multi-comp */

import connectField from '../src/connectField';
import Form from '../src/Form.react';
import React, { Component } from 'react';
import reducer from '../src/reducer';
import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import { assert } from 'chai';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';

const initial = {
  fields: {
    fooForm: {
      firstName: {
        customProperty: 'Hi Hello From State First Name',
        value: 'Bar',
        error: 'isRequired'
      },
      acceptAgreement: {
        customProperty: 'Hi Hello From State',
        value: false,
        error: 'isRequired'
      }
    }
  }
};

const store = createStore(() => ({ onionForm: reducer(initial) }));

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('connectField()', () => {
  class TextField extends Component {
    render() {
      return (
        <input type="text" {...this.props} />
      );
    }
  }

  class CheckBox extends Component {
    render() {
      return (
        <input type="checkbox" {...this.props} />
      );
    }
  }

  const FirstName = connectField('firstName', { customOverrideProp: 'Overriden props' })(TextField);
  const LastName = connectField('lastName', { customOverrideProp: 'Overriden props' })(TextField);
  const AcceptAgreement = connectField('acceptAgreement', { customOverrideProp: 'Overriden props' })(CheckBox);

  function createStubs(customProps = {}) {
    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <FirstName {...customProps} />
          <LastName />
          <AcceptAgreement {...customProps} />
        </Form>
      </ReduxProvider>
    );

    const fields = TestUtils.scryRenderedComponentsWithType(container, TextField);
    return {
      textField: fields[0],
      lastNameField: fields[1],
      checkBox: TestUtils.findRenderedComponentWithType(container, CheckBox)
    };
  }

  const { textField, lastNameField, checkBox } = createStubs({});

  it('Text Field should have name prop', () => {
    assert.equal(textField.props.name, 'firstName');
  });

  it('Text Field should have value prop', () => {
    assert.equal(textField.props.value, 'Bar');
  });

  it('Text Field should have empty value when state has NULL', () => {
    assert.equal(lastNameField.props.value, '');
  });

  describe('Custom props', () => {
    it('Text Field should have label prop set', () => {
      assert.equal(
        createStubs({ label: 'LabelFoo' }).textField.props.label,
        'LabelFoo'
      );
    });

    it('Text Field should have name overriden', () => {
      const { textField: { props: { name, value, customProperty } } } = createStubs({ name: 'acceptAgreement' });
      assert.equal(name, 'acceptAgreement');
      assert.equal(value, false);
      assert.equal(customProperty, 'Hi Hello From State');
    });

    it('Text Field should have onFocus prop set', () => {
      assert.equal(
        createStubs({ onFocus: ({ name }) => (`hi from ${name}`) }).textField.props.onFocus(),
        'hi from firstName'
      );
    });

    it('Text Field should have tooltip prop set', () => {
      assert.equal(
        createStubs({ tooltip: 'TooltipFoo' }).textField.props.tooltip,
        'TooltipFoo'
      );
    });

    it('Text Field should have hint prop set', () => {
      assert.equal(
        createStubs({ hint: 'HintFoo' }).textField.props.hint,
        'HintFoo'
      );
    });

    it('Text Field decorated with translate (msg given) should have hint translated', () => {
      assert.equal(
        createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.hint,
        'Translated form.fooForm.firstName.hint'
      );
    });

    it('Text Field decorated with translate (msg given) should have label translated', () => {
      assert.equal(
        createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.label,
        'Translated form.fooForm.firstName.label'
      );
    });

    it('Text Field decorated with translate (msg given) have tooltip translated', () => {
      assert.equal(
        createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.tooltip,
        'Translated form.fooForm.firstName.tooltip'
      );
    });

    it('Text Field decorated with translate (msg given) should have error translated', () => {
      assert.equal(
        createStubs({ msg: (key) => `Translated ${key[1]}` }).textField.props.error,
        'Translated form.errors.isRequired'
      );
    });

    it('Text Field should call onChange prop with {name and value}', () => {
      const onChange = sinon.stub();
      createStubs({ onChange }).textField.props.onChange({ value: 'Bar' });
      sinon.assert.calledWith(
        onChange,
        { name: 'firstName', value: 'Bar' }
      );
    });

    it('Text Field should call onBlur prop with {name and value}', () => {
      const onBlur = sinon.stub();
      createStubs({ onBlur }).textField.props.onBlur();
      sinon.assert.calledWith(
        onBlur,
        { name: 'firstName' }
      );
    });
  });

  it('Text Field should have onChange prop with given value', () => {
    assert.deepEqual(
      textField.props.onChange({ value: 'Bar' }),
      {
        type: 'SET_ONION_FORM_FIELD_PROPERTY',
        form: 'fooForm',
        field: 'firstName',
        property: 'value',
        value: 'Bar'
      }
    );
  });

  it('CheckBox should have onChange prop with given true value', () => {
    assert.deepEqual(
      checkBox.props.onChange({ value: true }),
      {
        type: 'SET_ONION_FORM_FIELD_PROPERTY',
        form: 'fooForm',
        field: 'acceptAgreement',
        property: 'value',
        value: true
      }
    );
  });

  it('CheckBox should have onChange prop with given false value', () => {
    assert.deepEqual(
      checkBox.props.onChange({ value: false }),
      {
        type: 'SET_ONION_FORM_FIELD_PROPERTY',
        form: 'fooForm',
        field: 'acceptAgreement',
        property: 'value',
        value: false
      }
    );
  });

  it('Text Field should have custom properties from state send as props', () => {
    assert.deepEqual(textField.props.customProperty, 'Hi Hello From State First Name');
  });

  it('Text Field should have custom properties from override props send as props', () => {
    assert.deepEqual(textField.props.customOverrideProp, 'Overriden props');
  });

  it('Text Field should have onChange prop with given value in target', () => {
    assert.deepEqual(
      textField.props.onChange({ target: { value: 'Bar' } }).value,
      'Bar'
    );
  });

  it('Text Field should have onChange prop with given checkbox in target', () => {
    assert.deepEqual(
      textField.props.onChange({ target: { type: 'checkbox', checked: true } }).value,
      true
    );

    assert.deepEqual(
      textField.props.onChange({ target: { type: 'checkbox', checked: false } }).value,
      false
    );
  });

  it('Text Field should have onChange prop with given value in target', () => {
    assert.deepEqual(
      textField.props.onChange({ target: { type: 'radio', value: 'Bar', checked: true } }).value,
      'Bar'
    );
  });

  it('Text Field should have onBlur prop', () => {
    assert.deepEqual(
      textField.props.onBlur({ value: 'Bar' }),
      {
        type: 'SET_ONION_FORM_FIELD_PROPERTY',
        form: 'fooForm',
        field: 'firstName',
        property: 'liveValidation',
        value: true
      }
    );
  });

  it('Text Field should have onion form name prop', () => {
    assert.equal(textField.props.onionFormName, 'fooForm');
  });

  describe('dynamic default props', () => {
    const DynamicFirstName = connectField('firstName', ({ msg, name }) => ({ label: `${msg('text')} ${name}` }))(TextField);
    const msg = (key) => (`translated.${key}`);
    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <DynamicFirstName msg={msg} name="foo" />
        </Form>
      </ReduxProvider>
    );

    const stub = TestUtils.findRenderedComponentWithType(container, TextField);

    it('process dynamic default props and passes computed label prop to TextField', () => {
      assert.equal(stub.props.label, 'translated.text foo');
    });
  });
});
