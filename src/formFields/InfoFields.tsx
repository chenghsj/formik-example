import React from 'react';
import { Field, FormikProps } from 'formik';
import { AntInput, AntInputNumber, AntSelect } from '../CreateAntFields';
import { IData, IInformation } from '../reduxSlice/dataSlice';
import { info } from 'console';

type Props = {
  selectedInfoIdx: number;
} & FormikProps<any>;

export default function InfoFields({
  selectedInfoIdx,
  values,
  errors
}: Props) {
  let fieldName = {} as IInformation
  const fieldNameArr = [
    "age",
    "email",
    "first_name",
    "last_name",
    "income_source",
    "job_title",
    "company"
  ]
  const getFieldName = (fieldName: string) => {
    return selectedInfoIdx < 0 ? fieldName : `information[${selectedInfoIdx}].${fieldName}`
  }
  fieldNameArr.forEach(name => {
    (fieldName as any)[name] = getFieldName(name)
  })

  const infoValues = selectedInfoIdx < 0 ? values as IInformation : (values as IData).information[selectedInfoIdx]

  const isChildren = infoValues.age < 18;
  const isAdult = infoValues.age >= 18 && infoValues.age <= 65
  const isElder = infoValues.age > 65;
  const isRetired = infoValues.income_source === "Pension"
  const isWorking = infoValues.income_source === "Salary"

  return (
    <React.Fragment>
      <Field
        component={AntInputNumber}
        name={fieldName.age}
        label="Age"
        selectedInfoIdx={selectedInfoIdx}
        min={7}
        max={90}
      />
      <Field
        component={AntInput}
        name={fieldName.email}
        type="email"
        label="Email"
        selectedInfoIdx={selectedInfoIdx}
      />
      <Field
        component={AntSelect}
        name={fieldName.income_source}
        label="Main Income Source"
        disabled={!infoValues.age}
        selectedInfoIdx={selectedInfoIdx}
        selectOptions={["", "Allowance", "Salary", "Pension"]}
        disabledOptions={isChildren ? ["Salary", "Pension"] : ["Allowance"]}
      />
      {isWorking &&
        <>
          <Field
            component={AntSelect}
            name={fieldName.job_title}
            label="Job Title"
            selectedInfoIdx={selectedInfoIdx}
            selectOptions={Object.keys(jobTitle)}
          />
          <Field
            component={AntInput}
            name={fieldName.company}
            type="company"
            label="Company"
            selectedInfoIdx={selectedInfoIdx}
          />
        </>
      }
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

enum jobTitle {
  Computer_Scientist = "Computer Scientest",
  IT_Professional = "IT Professional",
  UX_Designer = "UX Designer",
  UI_Developer = "UI Developer",
  SQL_Developer = "SQL Developer",
  Web_Designer = "Web Designer",
  Web_Developer = "Web Developer",
  Software_Engineer = "Software Engineer",
  Data_Entry = "Data Entry",
  DevOps_Engineer = "Devops Engineer",
  Computer_Programmer = "Computer Programmer",
  Network_Administrator = "Network Administrator",
  Information_Security_Analyst = "Information Security",
  Artificial_Intelligence_Engineer = "Artificial Intelligence Engineer",
  Cloud_Architect = "Cloud Architect",
  IT_Manager = "IT Manager",
  Technical_Specialist = "Technical Specialist",
  Application_Developer = "Application Developer",
  Chief_Technology_Officer = "Chief Technology Officer(CTO)",
  Chief_Information_Officer = "Chief Information Officer(CIO)"
}