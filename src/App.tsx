import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Select, Button, Row } from 'antd';
import { RootState } from './store';
import { Formik, Form, FormikProps, FormikState } from 'formik';
import * as yup from 'yup';
import { updateRowDataAction, IData, IInformation } from './reduxSlice/dataSlice';
import * as uuid from 'uuid';
import './App.css';
import InfoTable from './InfoTable';
import NetFields from './formFields/NetFields';
import { useDispatch } from 'react-redux';
import { InfoFormModal } from './InfoFormModal';

const validationInfoSchema = yup.object({
  age: yup.number().required("Required"),
  email: yup.string().email("Email must be a valid").required("Required"),
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
});

const validationSchema = yup.object({
  ip_address: yup.string().required("Required"),
  mac_address: yup.string().required("Required"),
  domain_name: yup.string().required("Required"),
  information: yup.array(validationInfoSchema),
  newInfo: validationInfoSchema
});

function App() {
  const { data } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [selectedRowNum, setSelectedRowNum] = useState(1);
  const [selectedRowValues, setSelectedRowValues] = useState({} as IData);
  const [enableReinitialize, setEnableReinitialize] = useState(true);
  const [untouchedValues, setUntouchedValues] = useState({} as IData);
  const [untouchedValuesFlag, setUntouchedValuesFlag] = useState(false);
  const [addInfoFomModalVisible, setAddInfoFomModalVisible] = useState(false);
  const formikRef = useRef<any>(null);

  const handleAddInfoBtnClick = () => {
    setAddInfoFomModalVisible(true);
    formikRef.current.setFieldValue("newInfo", {} as IInformation);
  };

  const handleAddInfoFormOk = (values: IData, setErrors: (values: any) => void) => () => {
    setAddInfoFomModalVisible(false);
    const newInfo: IInformation = { ...values.newInfo!, id: uuid.v4() };
    formikRef.current.setValues({
      ...formikRef.current.values,
      information: selectedRowValues.information.concat(newInfo)
    });
    setSelectedRowValues({
      ...formikRef.current.values,
      information: selectedRowValues.information.concat(newInfo)
    });
    setEnableReinitialize(false);
  };

  const handleAddInfoFormCancel = (setErrors: (values: any) => void) => () => {
    setAddInfoFomModalVisible(false);
  };

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
    setUntouchedValuesFlag(false);
    formikRef.current.setTouched({});
    setEnableReinitialize(true);
  };

  const handleCancel = (setValues: (value: IData) => void) => () => {
    setValues(untouchedValues);
    setEnableReinitialize(true);
    setSelectedRowValues(untouchedValues);
  };

  useEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    formikRef.current.resetForm({ ...rowData, newInfo: {} as IInformation });
    setSelectedRowValues({ ...rowData, newInfo: {} as IInformation });
    setUntouchedValuesFlag(true);
  }, [data, selectedRowNum]);

  useEffect(() => {
    const rowData = data.find(el => el.row === selectedRowNum)!;
    setUntouchedValues(rowData!);
  }, [untouchedValuesFlag, selectedRowNum]);

  return (
    <div className="App">
      <Row style={{ width: "100%" }} align="middle" justify="space-between">
        <Select
          style={{ width: "100px", margin: "20px 0" }}
          defaultValue={1}
          onChange={handleSelectChange}>
          {data.map(item => (
            <Select.Option key={item.id} value={item.row}>{item.row}</Select.Option>
          ))}
        </Select>
      </Row>
      <Formik
        innerRef={formikRef}
        enableReinitialize={enableReinitialize}
        initialValues={selectedRowValues}
        validationSchema={addInfoFomModalVisible ? validationSchema.pick(['newInfo']) : validationSchema.omit(['newInfo'])}
        onSubmit={(values) => {
          setEnableReinitialize(true);
          alert(JSON.stringify(values, null, 2));
          dispatch(updateRowDataAction({ rowId: selectedRowValues.id, rowData: values as IData }));
          setUntouchedValuesFlag(false);
        }}
        component={(props: FormikProps<IData>) => {
          const { dirty, touched, handleSubmit, setValues, setErrors, values, errors } = props;
          let hasEmptyValue = false;
          let key: keyof typeof values;
          for (key in values) {
            if (values[key] === "") hasEmptyValue = true
          }
          const disabledApplyBtn = !dirty || !touched || hasEmptyValue
            || (Object.keys(errors).length > 0 && Object.keys(formikRef.current?.errors).length > 0);
            
          return (
            <>
              <Form
                onSubmit={handleSubmit}
                style={{ margin: '0 auto', width: "500px" }}>
                <NetFields />
                <Row justify='end'>
                  <Button
                    onClick={handleAddInfoBtnClick}
                  >
                    Add
                  </Button>
                </Row>
                <InfoFormModal
                  selectedInfoIdx={-1}
                  infoFormModalVisible={addInfoFomModalVisible}
                  handleInfoFormOk={handleAddInfoFormOk(values as IData, setErrors)}
                  handleInfoFormCancel={handleAddInfoFormCancel(setErrors)}
                  {...props}
                />
                <InfoTable
                  selectedRow={selectedRowValues}
                  setSelectedRowValues={setSelectedRowValues}
                  setEnableReinitialize={setEnableReinitialize}
                  {...props}
                />
                <Row>
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={handleCancel(setValues)}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    disabled={disabledApplyBtn}
                    htmlType="submit"
                  >
                    Apply
                  </Button>
                </Row>
              </Form>
            </>
          );
        }}
      >
      </Formik>
    </div >
  );
}

export default App;

