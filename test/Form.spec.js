import { mount } from 'enzyme';
import RPT from 'prop-types';
import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';

import * as actions from '../src/actions';
import connectField from '../src/connectField';
import Form from '../src/Form.react';
import reducer from '../src/reducer';
import { TextField } from './mocks';

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

describe('Form', () => {
  class Passthrough extends Component {
    static contextTypes = {
      onionFieldRegister: RPT.func,
      onionFormName: RPT.string,
      onionLiveValidate: RPT.func,
      onionOnSubmit: RPT.func
    }

    render() {
      return <div />;
    }
  }

  const isRequired = () => value => ((!value) ? 'required' : null);
  const onSubmit = jest.fn();
  const onError = jest.fn();
  const validations = {
    firstName: [isRequired()],
    lastName: [isRequired()]
  };

  const createContainer = (validations) => {
    const store = createStore((state, action) => ({ onionForm: reducer(state.onionForm, action) }), initial);
    return mount(
      <ReduxProvider store={store}>
        <Form name="OnionForm" validations={validations} onSubmit={onSubmit} onError={onError}>
          <Passthrough />
        </Form>
      </ReduxProvider>
    );
  };

  const container = createContainer(validations);
  const form = container.find(Form).instance();
  const passthrough = container.find(Passthrough).instance();
  const passthroughCtx = passthrough.context;

  it('should pass onionFormName in context to children', () => {
    expect(passthroughCtx.onionFormName).toBe('OnionForm');
  });

  it('should pass onionLiveValidate in context to children', () => {
    expect(typeof passthroughCtx.onionLiveValidate).toBe('function');
  });

  it('should pass onionLiveValidate in context to children', () => {
    expect(typeof passthroughCtx.onionLiveValidate).toBe('function');
  });

  it('should pass onionOnSubmit in context to children', () => {
    expect(typeof passthroughCtx.onionOnSubmit).toBe('function');
  });

  it('should pass onionFieldRegister in context to children', () => {
    expect(typeof passthroughCtx.onionFieldRegister).toBe('function');
  });

  it('should have validate()', () => {
    expect(typeof form.validate).toBe('function');
  });

  it('should have onSubmit()', () => {
    expect(typeof form.onSubmit).toBe('function');
  });

  it('should have liveValidate()', () => {
    expect(typeof form.liveValidate).toBe('function');
  });

  it('should have formValidate()', () => {
    expect(typeof form.formValidate).toBe('function');
  });

  it('should have fieldRegister()', () => {
    expect(typeof form.fieldRegister).toBe('function');
  });

  it('should dispatch right action on formValidate()', () => {
    expect(form.formValidate().type).toBe(actions.SET_ONION_FORM_MULTIPLE_FIELDS);
    expect(form.formValidate().property).toBe('error');
  });

  describe('_submit()', () => {
    const containerWithoutValidations = createContainer({});
    const formWithoutValidations = containerWithoutValidations.find(Form).instance();

    it('should call onSubmit() callback when form valid', () => {
      expect(formWithoutValidations._isValid()).toBe(true);
      expect(formWithoutValidations._submit()).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'OnionForm',
        values: {
          firstName: 'Foo',
          lastName: null
        }
      });
    });

    it('should call onError() callback when form not valid', () => {
      expect(form._isValid()).toBe(false);
      expect(form._submit()).toBe(false);
      expect(onError).toHaveBeenCalledWith({
        name: 'OnionForm',
        errors: {
          firstName: null,
          lastName: 'required'
        }
      });
    });
  });

  describe('formValidate()', () => {
    it('should validate fields', () => {
      expect(form.formValidate().values).toEqual({
        firstName: null,
        lastName: 'required'
      });
    });
  });

  describe('Validations on field level', () => {
    const failingValidation = () => 'ERROR';
    const passingValidation = () => null;
    const FirstName = connectField('firstName', {}, [isRequired()])(TextField);
    const LastName = connectField('lastName', {}, [isRequired()])(TextField);

    const createForm = (fields, formValidations) => {
      const store = createStore((state, action) => ({ onionForm: reducer(state.onionForm, action) }), initial);
      const wrapper = mount(
        <ReduxProvider store={store}>
          <Form name="OnionForm" onSubmit={onSubmit} onError={onError} validations={formValidations}>
            {fields}
          </Form>
        </ReduxProvider>
      );
      return wrapper.find(Form).instance();
    };

    it('should pass for valid fields', () => {
      const form = createForm(<FirstName />);
      expect(form._isValid()).toBe(true);
    });

    it('should fail for invalid fields', () => {
      const form = createForm(<FirstName validations={[failingValidation]} />);
      expect(form._isValid()).toBe(false);
    });

    it('should fail for invalid fields', () => {
      const form = createForm(<LastName />);
      expect(form._isValid()).toBe(false);
    });

    it('all three types of validations should be used', () => {
      const form = createForm(<LastName validations={[passingValidation]} />, { lastName: [failingValidation] });
      const errors = form._extractValidationsFromField('lastName');
      expect(Object.keys(errors).length).toBe(3);
    });
  });
});
