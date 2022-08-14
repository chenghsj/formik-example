import React from 'react';
import { Field } from 'formik';
import { AntInput, AntInputNumber } from '../CreateAntFields';

type Props = {};

export default function InfoFields({ }: Props) {
  return (
    <React.Fragment>
      <Field
        component={AntInputNumber}
        name="age"
        label="Age"
        hasFeedback
      />
      <Field
        component={AntInput}
        name="email"
        type="email"
        label="Email"
        hasFeedback
      />
      <Field
        component={AntInput}
        name="first_name"
        type="first_name"
        label="First Name"
      />
      <Field
        component={AntInput}
        name="last_name"
        type="last_name"
        label="Last Name"
      />
    </React.Fragment>
  );
}