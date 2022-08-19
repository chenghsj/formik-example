import React from "react";
import { Form, Input, Select, InputNumber } from "antd";
import { FormikProps, FieldProps } from 'formik';
import { IData, IInformation } from "./reduxSlice/dataSlice";

type CreateAntFieldProps = {
  hasFeedback: boolean;
  label: string;
  type: string;
  disabled: boolean;
  selectOptions: string[];
  disabledOptions: string[];
  style: React.CSSProperties;
  selectedInfoIdx: number;
  min: number;
  max: number;
  resetValue: any;
} & FieldProps;

const CreateAntField = (AntComponent: any) => ({
  field,
  form,
  hasFeedback,
  label,
  style,
  type,
  disabled,
  selectOptions,
  disabledOptions,
  selectedInfoIdx,
  min,
  max,
  resetValue,
  ...props
}: CreateAntFieldProps) => {
  let touched: any;
  let hasError: any;
  const fieldName = field.name.split('.')[1];

  const resetValueFn = () => {
    if (resetValue) {
      for (let key in resetValue) {
        if (selectedInfoIdx >= 0) {
          form.setFieldValue(`information[${selectedInfoIdx}][${key}]`, resetValue[key])
        } else {
          form.setFieldValue(key, resetValue[key])
        }
      }
    }
  }

  if (selectedInfoIdx >= 0 && form.touched.information && form.errors.information) {
    touched = (form.touched.information as any)[selectedInfoIdx][fieldName];
    hasError = (form.errors.information as any)[selectedInfoIdx][fieldName];
  } else {
    touched = form.touched[field.name];
    hasError = form.errors[field.name];
  }

  const touchedError = hasError && touched;
  const handleInputChange = ({ target: { value } }: any) => {
    form.setFieldValue(field.name, value);
  };
  const handleSelectChange = (value: any) => {
    resetValueFn();
    form.setFieldValue(field.name, value)
  };

  const handleBlur = () => {
    resetValueFn();
    form.setFieldTouched(field.name, true)
  };
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
          onBlur={handleBlur}
          onChange={type ? handleInputChange : handleSelectChange}
          disabled={disabled}
        >
          {selectOptions &&
            selectOptions.map((name: string) =>
              <Select.Option
                disabled={disabledOptions?.includes(name)}
                key={name}
              >
                {name}
              </Select.Option>
            )}
        </AntComponent>
      </Form.Item>
    </div>
  );
};

export const AntSelect = CreateAntField(Select);
export const AntInput = CreateAntField(Input);
export const AntInputNumber = CreateAntField(InputNumber);