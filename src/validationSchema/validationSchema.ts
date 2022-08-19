import * as yup from 'yup';

export enum source_type {
  Salary = "Salary",
  Allowance = "Allowance",
  Pension = "Pension"
}

const is_income_salary = yup.string().when(
  "income_source",
  {
    is: (val: string) => val === source_type.Salary,
    then: yup.string().required("Required")
  })

export const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
  income_source: yup.string().required("Required")
    .test(
      'Validate income sources',
      'Please reselect the value',
      function (value: string | undefined) {
        const { age } = this.parent;
        if (age < 18) {
          return value === source_type.Allowance;
        }
        else if (age > 65) {
          return value === source_type.Pension;
        } else {
          return value === source_type.Salary;
        }
      }
    ),
  job_title: is_income_salary,
  company: is_income_salary,
  email: yup.string().email("Email must be a valid").required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
});

export const validationSchema = yup.object({
  ip_address: yup.string().required("Required")
    .matches(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IP address."),
  mac_address: yup.string().required("Required")
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
  domain_name: yup.string().required("Required"),
  information: yup.array(validationInfoSchema)
});