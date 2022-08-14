import React, { useEffect } from "react";
import { Form, Input, Select, InputNumber } from "antd";
import { FormikProps, FieldProps } from 'formik';

type CreateAntFieldProps = {
  // field: any;
  // form: any;
  hasFeedback: boolean;
  label: string;
  type: string;
  selectOptions: any;
  style: any;
} & FormikProps<any> & FieldProps;

const CreateAntField = (AntComponent: any) => ({
  field,
  form,
  hasFeedback,
  label,
  type,
  selectOptions,
  style,
  ...props
}: CreateAntFieldProps) => {
  const touched = form.touched[field.name];
  const hasError = form.errors[field.name];
  const touchedError = hasError && touched;
  const onInputChange = ({ target: { value } }: any) => {
    form.setFieldValue(field.name, value);
  };
  const onChange = (value: any) => {
    form.setFieldValue(field.name, value);
  };

  const onBlur = () => form.setFieldTouched(field.name, true);
  return (
    <div className="field-container">
      <Form.Item
        label={label}
        hasFeedback={(hasFeedback && touched) ? true : false}
        help={touchedError ? hasError as string : false}
        validateStatus={touchedError ? "error" : "success"}
      >
        <AntComponent
          style={style}
          suffix={<span />}
          {...field}
          {...props}
          onBlur={onBlur}
          onChange={type ? onInputChange : onChange}
        >
          {selectOptions &&
            selectOptions.map((name: string) => <Select.Option key={name}>{name}</Select.Option>)}
        </AntComponent>
      </Form.Item>
    </div>
  );
};

export const AntSelect = CreateAntField(Select);
export const AntInput = CreateAntField(Input);
export const AntInputNumber = CreateAntField(InputNumber);