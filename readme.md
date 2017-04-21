![Onion Form](https://raw.githubusercontent.com/blueberryapps/onion-form/master/onion-form.png)
[![CircleCI](https://circleci.com/gh/blueberryapps/onion-form.svg?style=svg&circle-token=354f9bfd4c09ed529e4ff20019fc6668d03d9aa1)](https://circleci.com/gh/blueberryapps/onion-form)

> As a developer you are assigned with creating a registration form on Registration page
> with fields for first name, last name, e-mail and password, validate them and then
> send all these fields to API. Not again? This package will make your life easier by simplifying the dealing with forms.

```
yarn add --save onion-form
```

This package is only meant to be used together with Redux!

## TLDR

```javascript
import { Form, Field, Submit } from 'onion-form';

<Form
  name="signIn"
  onError={({ errors }) => { console.log(errors) }}
  onSubmit={({ values }) => { console.log(values) }}
  validations={{ email: (value) => [((value && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) ? 'wrongFormat' : null)]}}
>
  <Field name='email' type='email' />
  <Field name='password' type='password' />
  <Submit>Sign In</Submit>
</Form>
```

## Usage

```javascript
// Registration.react.js
import React, { Component } from 'react';
import { Form, Submit, connectField } from 'onion-form';

// validations
const isRequired = (value) => ((!value) ? 'required' : null);
const emailNeedsToContainName = (_, otherValues) => ((!otherValues.email || otherValues.email.indexOf(otherValues.name) === -1) ? 'invalidEmail' : null);
const needLetters = (value) => (value && !value.match(/[a-zA-Z]+/i ? 'needLetters' : null);
const needNumbers = (value) => (value && !value.match(/\d+/i) ? 'needNumbers' : null);

const validations = {
  lastName: [isRequired],
  email: [emailNeedsToContainName],
  password: [needLetters, needNumbers]
};

// You need to have a component which will receive all data by props
// error, hint, label, name, onBlur, onChange, onFocus, onionFormName, tooltip
const BasicInput = (props) => (<input type="text" {...props} />);

// Create your fields (can be used in different forms)
const FirstName = connectField('firstName')(BasicInput);
const LastName  = connectField('lastName')(BasicInput);
const Email     = connectField('email', { type: 'email' })(BasicInput);
const Password  = connectField('password', { type: 'password' })(BasicInput);

export default class RegistrationPage extends Component {

  onSubmit({ values: { firstName, lastName, email, password } }) {
    // apiCall('POST', { firstName, lastName, email, password })
  }

  onError({ errors: { firstName, lastName, email, password } }) {
    // alert, show flash message what ever you need to do when use tryies to
    // submit form and gets validation errors
  }

  render() {
    return (
      <div>
        <h1>Registration</h1>
        <Form
          name="myRegistrationForm"
          onSubmit={this.onSubmit.bind(this)}
          onError={this.onError.bind(this)}
          validations={validations}
        >
          <FirstName label="Your first name" />
          <LastName />
          <Email />
          <Password />
          <Submit>Register</Submit>
        </Form>
      </div>
    )
  }
}
```

### Validations
There are three ways how you can add validations to your form:

1. Pass an object with validations to the `Form` component as props (see examples above)
2. Pass an array of validations to the `connectField` function: `connectField('password', null, [isRequired(), password()])`
3. Specify the validations when the field component is being used:

```js
export default class MyForm extends Component {
  render() {
    return (
      <Form name="myForm">
        <Email validations={[isRequired(), email()]} />
        <Password validations={[isRequired(), password()]}/>
        <Submit>Login</Submit>
      </Form>
    )
  }
}
```

All validations you specify will be used.

### Redux

!You need to add onion form reducer to your reducers and it must be under `onionForm` first level key!

```javascript
// store.js
import { createStore, combineReducers } from 'redux';
import { reducer as onionForm } from 'onion-form';

const store = createStore(combineReducers({ onionForm }), {})
```

## Action Creators

We have multiple action creators for communication with reducer:
`setMultipleFields`, `setFormFieldProperty`, `clearForm`, `clearFormProperty`, `setFieldValue`,
`setFieldLiveValidation`, `setFieldError`, `setFieldApiError`
All these actions accept `formName` as the first parameter which needs to match FORM_NAME in `<Form name=`FORM_NAME`/>`.

> All connected fields get __formName__ from __context__.

But sometimes you need to communicate with fields from your code and repeating
name of the form can be exhausting, so we provide `createFormActions(formName)`
which returns all the actions with `formName` set.

## connectField(FIELD_NAME, DEFAULT_PROPS)(DECORATED_COMPONENT)

__DEFAULT_PROPS__:
can be a plain __{}__ or a function which receives props as
the first parameter and needs to return __{}__. This function gets resolves in render on every rerender.
`(props) => ({ label: props.msg('key.to.label') })`

__FIELD_VALUES_FROM_STATE__:
By default we store these values in redux state:
```javascript
{
  value: '',
  liveValidation: false,
  error: null,
  apiError: null
}
```
But you can use
`setMultipleFields(form, property, values)` or
`setFormFieldProperty(form, field, property, value)`
to set custom properties which will be then passed to the decorated component as well.

__ONION_PROPS:__
`error`, `hint`, `label`, `name`, `onBlur`, `onChange`, `onFocus`, `onionFormName`, `tooltip`

When you initialize a component in `render` you can pass the following PASSED_PROPS:

__PASSED_PROPS__
`label`, `onBlur`, `onFocus`, `onChange`, `tooltip`, `hint`, `defaultValue`
They will be transferred to the decorated component.
Functions passed by props (`onFocus`, `onChange`, `onBlur`) will get called too, after onion form callbacks.

Passing order of props is: __DEFAULT_PROPS__ -> __FIELD_VALUES_FROM_STATE__ -> __ONION_PROPS__ -> __PASSED_PROPS__

You can pass `defaultValue` to component by (PROPS or __DEFAULT_PROPS__) to set that value to state on componentDid mount when field has no value already set.

## connectSubmit(DECORATED_COMPONENT)

You can use `connectSubmit` which will pass `onClick`, `valid`, `hasValues`, `hasErrors` and `disabled` as prop to the decorated component:

```js
// CustomSubmit.react.js
import { connectSubmit } from 'onion-form';

const Button = ({ children, disabled, onClick }) => (
  <button disabled={disabled} onClick={onClick} type="submit">{children}</button>
);

export default const connectSubmit(Button);
```

- `onClick`: callback function for submitting form
- `valid`: returns true/false based on fields validations runned against state (errors doesn't need to be in store)
- `hasErrors`: returns true if form is invalid (based on state from Redux)

## Translations

You need to pass to component function `msg('keypath') => string`.

Implemetation is your thing but it needs to follow:
```
msg('key.foo') // returns translation for key.foo
msg(['foo', 'bar']) // returns translation for foo if exists else bar
```

We use this function to resolve translations for the
`error`, `hint`, `label`, `tooltip`, `placeholder` props.

__error__ is specific because we are trying to get text by:
```javascript
const error = field.error || field.apiError;
const errorText = error
  ? msg([`form.${formName}.errors.${error}`, `form.errors.${error}`, `errors.${error}`])
  : '';
```

others are easier, for example __label__:
```javascript
const labelText = label || defaultProps.label || msg([`form.${formName}.${fieldName}.label`, `form.${fieldName}.label`, `${fieldName}.label`]);
```

# !For detailed documentation of all options do `yarn test`!

## Commands
* __yarn test__: runs mocha tests
* __yarn test:watch__: runs mocha test with watch option
* __yarn coverage__: create code coverage report

## Made with love by
[![](https://camo.githubusercontent.com/d88ee6842f3ff2be96d11488aa0d878793aa67cd/68747470733a2f2f7777772e676f6f676c652e636f6d2f612f626c75656265727279617070732e636f6d2f696d616765732f6c6f676f2e676966)](https://www.blueberry.io)
