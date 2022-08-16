import * as yup from 'yup';

export const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
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