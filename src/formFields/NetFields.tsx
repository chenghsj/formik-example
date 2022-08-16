import { Field } from 'formik';
import React from 'react';
import { AntInput } from '../CreateAntFields';

type Props = {};

export default function NetFields({ }: Props) {
  return (
    <React.Fragment>
      <Field
        component={AntInput}
        name="ip_address"
        type="ip_address"
        label="IP Address"
      />
      <Field
        component={AntInput}
        name="mac_address"
        type="mac_address"
        label="MAC Address"
      />
      <Field
        component={AntInput}
        name="domain_name"
        type="domain_name"
        label="Domain Name"
      />
    </React.Fragment>
  );
}