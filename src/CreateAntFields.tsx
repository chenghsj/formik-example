import React, { useEffect } from "react";
import { Form, Input, Select, InputNumber } from "antd";
import { FormikProps, FieldProps, FormikTouched, FormikErrors } from 'formik';
import { IData, IInformation } from "./reduxSlice/dataSlice";

type CreateAntFieldProps = {
  hasFeedback: boolean;
  label: string;
  type: string;
  selectOptions: any[];
  style: React.CSSProperties;
  selectedInfoIdx: number;
  min: number;
  max: number;
} & FormikProps<IData | IInformation> & FieldProps;

const CreateAntField = (AntComponent: any) => ({
  field,
  form,
  hasFeedback,
  label,
  type,
  selectOptions,
  style,
  selectedInfoIdx,
  min,
  max,
  ...props
}: CreateAntFieldProps) => {
  let touched: any;
  let hasError: any;
  const fieldName = field.name.split('.')[1];

  if (selectedInfoIdx >= 0 && form.touched.information && form.errors.information) {
    touched = (form.touched.information as any)[selectedInfoIdx][fieldName];
    hasError = (form.errors.information as any)[selectedInfoIdx][fieldName];
  } else {
    touched = form.touched[field.name];
    hasError = form.errors[field.name];
  }

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
          min={min}
          max={max}
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