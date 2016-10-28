![Onion Form](https://github.com/blueberryapps/4finance-packages/raw/e673eadf594c2c8cd981c6057301528de74be439/packages/onion-form/onion-form.png)

> As a developer you are assigned with creating a registration form on Registration page
> with fields for first name, last name, e-mail and password, validate them and then
> send all these fields to API. Not again? This package will make your life easier by simplifying the dealing with forms.

```
npm install --save @blueberry/4finance-onion-form
```

This package is only meant to be used together with Redux!

## TLDR

```javascript
import { Form, Field, Submit } from '@blueberry/4finance-onion-form';

<Form
  name="signIn"
  validations={{ email: () => ((value && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) ? 'wrongFormat' : null) }}
  onSubmit={({ values }) => { console.log(values) }}
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
import { Form, Submit, connectField } from '@blueberry/4finance-onion-form';

// For validations look at 4finance-validations
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

  render() {
    return (
      <div>
        <h1>Registration</h1>
        <Form name="myRegistrationForm" onSubmit={this.onSubmit.bind(this)} validations={validations}>
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

### Redux

!You need to add onion form reducer to your reducers and it must be under `onionForm` first level key!

```javascript
// store.js
import { createStore, combineReducers } from 'redux';
import { reducer as onionForm } from '@blueberry/4finance-onion-form';

const store = createStore(combineReducers({ onionForm }), {})
```

## Action Creators

We have multiple action creators for communication with reducer:
`setMultipleFields`, `setFormFieldProperty`, `clearFormProperty`, `setFieldValue`,
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
`(props) => ({ label: props.msg('key.to.label') })` **this uses 4finance-translate**

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
`label`, `onBlur`, `onFocus`, `onChange`, `tooltip`, `hint`
They will be transferred to the decorated component.
Functions passed by props (`onFocus`, `onChange`, `onBlur`) will get called too, after onion form callbacks.

Passing order of props is: __DEFAULT_PROPS__ -> __FIELD_VALUES_FROM_STATE__ -> __ONION_PROPS__ -> __PASSED_PROPS__

## connectSubmit(DECORATED_COMPONENT)

You can use `connectSubmit` which will pass `onClick` and `disabled` as prop to the decorated component:

```js
// CustomSubmit.react.js
import { connectSubmit } from '@blueberry/4finance-onion-form';

const Button = ({ children, disabled, onClick }) => (
  <button disabled={disabled} onClick={onClick} type="submit">{children}</button>
);

export default const connectSubmit(Button);
```

## Translate

There is a ready-to-use integration for 4finance-translate:

```javascript
import translate from '@blueberry/4finance-translate';
import { connectField } from '@blueberry/4finance-onion-form';

const FirstName = translate(connectField('firstName')(BasicInput));
```

`msg` function is passed by wrapping the connected field in `translate`.
We use this function to resolve translations for the
`error`, `hint`, `label`, `tooltip` props.

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

# !For detailed documentation of all options do `npm run test`!

## NPM Commands
* __npm run test__: runs mocha tests
* __npm run test:watch__: runs mocha test with watch option
* __npm run coverage__: create code coverage report
