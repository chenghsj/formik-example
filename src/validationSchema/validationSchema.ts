import * as yup from 'yup';

const is_income_salary = yup.string().when("age", {
  is: (age: number) => age >= 23 && age <= 65,
  then: yup.string().required("Required")
}).when("income_source", {
  is: (val: string) => val === "Salary",
  then: yup.string().required("Required")
})

export const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
  income_source: yup.string().required("Required"),
  job_title: is_income_salary,
  company: is_income_salary,
  email: yup.string().email("Email must be a valid").required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
});

export const validationSchema = yup.object({
  ip_address: yup.string().required("Required"),
  mac_address: yup.string().required("Required"),
  domain_name: yup.string().required("Required"),
  information: yup.array(validationInfoSchema)
});