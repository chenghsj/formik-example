import React from 'react';
import { Field } from 'formik';
import { AntInput, AntInputNumber } from '../CreateAntFields';

type Props = {
  selectedInfoIdx: number;
};

export default function InfoFields({ selectedInfoIdx }: Props) {
  const fieldName = {
    age: selectedInfoIdx < 0 ? `age` : `information[${selectedInfoIdx}].age`,
    email: selectedInfoIdx < 0 ? `email` : `information[${selectedInfoIdx}].email`,
    first_name: selectedInfoIdx < 0 ? `first_name` : `information[${selectedInfoIdx}].first_name`,
    last_name: selectedInfoIdx < 0 ? `last_name` : `information[${selectedInfoIdx}].last_name`
  }
  return (
    <React.Fragment>
      <Field
        component={AntInputNumber}
        name={fieldName.age}
        label="Age"
        hasFeedback
        selectedInfoIdx={selectedInfoIdx}
        min={7}
        max={90}
      />
      <Field
        component={AntInput}
        name={fieldName.email}
        type="email"
        label="Email"
        hasFeedback
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntInput}
        name={fieldName.first_name}
        type="first_name"
        label="First Name"
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntInput}
        name={fieldName.last_name}
        type="last_name"
        label="Last Name"
        selectedInfoIdx={selectedInfoIdx}
      />
    </React.Fragment>
  );
}