/* eslint-disable react/no-multi-comp */

import connectField from '../src/connectField';
import Form from '../src/Form.react';
import React from 'react';
import reducer from '../src/reducer';
import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import { createStore } from 'redux';
import { jsdom } from 'jsdom';
import { Provider as ReduxProvider } from 'react-redux';
import { TextField, CheckBox } from './mocks';

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

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('connectField()', () => {
  const FirstName = connectField('firstName', { customOverrideProp: 'Overriden props' })(TextField);
  const LastName = connectField('lastName', { customOverrideProp: 'Overriden props' })(TextField);
  const AcceptAgreement = connectField('acceptAgreement', { customOverrideProp: 'Overriden props' })(CheckBox);

  function createStubs(customProps = {}, initialState = initial) {
    const store = createStore((state = { onionForm: initialState }, action) => ({ onionForm: reducer(state.onionForm, action) }));
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
      store,
      textField: fields[0],
      lastNameField: fields[1],
      checkBox: TestUtils.findRenderedComponentWithType(container, CheckBox)
    };
  }

  const { textField, lastNameField, checkBox } = createStubs({});

  it('Text Field should have name prop', () => {
    expect(textField.props.name).toBe('firstName');
  });

  it('Text Field should have value prop', () => {
    expect(textField.props.value).toBe('Bar');
  });

  it('Text Field should have empty value when state has NULL', () => {
    expect(lastNameField.props.value).toBe('');
  });

  describe('Custom props', () => {
    it('Text Field should have label prop set', () => {
      expect(createStubs({ label: 'LabelFoo' }).textField.props.label).toBe('LabelFoo');
    });

    it('Text Field should have name overriden', () => {
      const { textField: { props: { name, value, customProperty } } } = createStubs({ name: 'acceptAgreement' });
      expect(name).toBe('acceptAgreement');
      expect(value).toBe('');
      expect(customProperty).toBe('Hi Hello From State');
    });

    it('Text Field should have onFocus prop set', () => {
      expect(createStubs({ onFocus: ({ name }) => (`hi from ${name}`) }).textField.props.onFocus())
        .toBe('hi from firstName');
    });

    it('Text Field should have tooltip prop set', () => {
      expect(createStubs({ tooltip: 'TooltipFoo' }).textField.props.tooltip)
        .toBe('TooltipFoo');
    });

    it('Text Field should set defaultValue to state', () => {
      const { store: { getState } } = createStubs({ defaultValue: 'TooltipFoo' }, {});
      expect(getState().onionForm.fields.getIn(['fooForm', 'firstName', 'value']))
        .toBe('TooltipFoo');
    });

    it('Text Field should not set defultValue to state when value is present', () => {
      const { store: { getState } } = createStubs({ defaultValue: 'TooltipFoo' });
      expect(getState().onionForm.fields.getIn(['fooForm', 'firstName', 'value'])).toBe('Bar');
    });

    it('Text Field should have hint prop set', () => {
      expect(createStubs({ hint: 'HintFoo' }).textField.props.hint)
        .toBe('HintFoo');
    });

    it('Text Field decorated with translate (msg given) should have hint translated', () => {
      expect(createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.hint)
        .toBe('Translated form.fooForm.firstName.hint');
    });

    it('Text Field decorated with translate (msg given) should have label translated', () => {
      expect(createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.label)
        .toBe('Translated form.fooForm.firstName.label');
    });

    it('Text Field decorated with translate (msg given) have tooltip translated', () => {
      expect(createStubs({ msg: (key) => `Translated ${key[0]}` }).textField.props.tooltip)
        .toBe('Translated form.fooForm.firstName.tooltip');
    });

    it('Text Field decorated with translate (msg given) should have error translated', () => {
      expect(createStubs({ msg: (key) => `Translated ${key[1]}` }).textField.props.error)
        .toBe('Translated form.errors.isRequired');
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
    expect(
      textField.props.onChange({ value: 'Bar' })
    ).toEqual(
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
    expect(
      checkBox.props.onChange({ value: true })
    ).toEqual(
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
    expect(
      checkBox.props.onChange({ value: false })
    ).toEqual(
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
    expect(textField.props.customProperty).toBe('Hi Hello From State First Name');
  });

  it('Text Field should have custom properties from override props send as props', () => {
    expect(textField.props.customOverrideProp).toBe('Overriden props');
  });

  it('Text Field should have onChange prop with given value in target', () => {
    expect(textField.props.onChange({ target: { value: 'Bar' } }).value)
      .toBe('Bar');
  });

  it('Text Field should have onChange prop with given checkbox in target', () => {
    expect(textField.props.onChange({ target: { type: 'checkbox', checked: true } }).value)
      .toBe(true);
    expect(textField.props.onChange({ target: { type: 'checkbox', checked: false } }).value)
      .toBe(false);
  });

  it('Text Field should have onChange prop with given value in target', () => {
    expect(textField.props.onChange({ target: { type: 'radio', value: 'Bar', checked: true } }).value)
      .toBe('Bar');
  });

  it('Text Field should have onBlur prop', () => {
    expect(
      textField.props.onBlur({ value: 'Bar' })
    ).toEqual(
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
    expect(textField.props.onionFormName).toBe('fooForm');
  });

  describe('dynamic default props', () => {
    const DynamicFirstName = connectField('firstName', ({ msg, name }) => ({ label: `${msg('text')} ${name}` }))(TextField);
    const msg = (key) => (`translated.${key}`);
    const store = createStore((state = { onionForm: initial }, action) => ({ onionForm: reducer(state.onionForm, action) }));
    const container = TestUtils.renderIntoDocument(
      <ReduxProvider store={store}>
        <Form name="fooForm">
          <DynamicFirstName msg={msg} name="foo" />
        </Form>
      </ReduxProvider>
    );

    const stub = TestUtils.findRenderedComponentWithType(container, TextField);

    it('process dynamic default props and passes computed label prop to TextField', () => {
      expect(stub.props.label).toBe('translated.text foo');
    });
  });
});
