import React from 'react';
import { Field } from 'formik';
import { AntInput, AntInputNumber } from '../CreateAntFields';

type Props = {
  selectedInfoIdx: number;
};

export default function InfoFields({ selectedInfoIdx }: Props) {
  return (
    <React.Fragment>
      <Field
        component={AntInputNumber}
        name={`information[${selectedInfoIdx}].age`}
        label="Age"
        hasFeedback
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntInput}
        name={`information[${selectedInfoIdx}].email`}
        type="email"
        label="Email"
        hasFeedback
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntInput}
        name={`information[${selectedInfoIdx}].first_name`}
        type="first_name"
        label="First Name"
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntInput}
        name={`information[${selectedInfoIdx}].last_name`}
        type="last_name"
        label="Last Name"
        selectedInfoIdx={selectedInfoIdx}
      />
    </React.Fragment>
  );
}