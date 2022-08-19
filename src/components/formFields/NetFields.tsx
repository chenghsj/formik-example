import React from 'react';
import { Field } from 'formik';
import { AntInput } from '../../CreateAntFields';

type Props = {};

export default function NetFields({ }: Props) {
  return (
    <div style={{width: "50%"}}>
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
    </div>
  );
}