import React, { useEffect, useState } from 'react';
import './App.css';
import { Table, Select, Button, Row } from 'antd';
import InfoTable from './InfoTable';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Formik, Form, Field, FormikProps } from 'formik';
import * as yup from 'yup';
import { IData } from './reduxSlice/infoSlice';
import { AntInput } from './CreateAntFields';
import NetFields from './formFields/NetFields';

const validationNetSchema = yup.object({
  ip_address: yup.string().required("Required"),
  mac_address: yup.string().required("Required"),
  domain_name: yup.string().required("Required")
});

function App() {
  const { data } = useSelector((state: RootState) => state);
  const [selectedRowNum, setSelectedRowNum] = useState<number>(1);
  const [initialNetValues, setInitialNetValues] = useState<IData>({} as IData);

  const handleSelectChange = (value: number) => {
    setSelectedRowNum(value);
  };
  useEffect(() => {
    const selectedRow = data.find(el => el.row === selectedRowNum)!;
    setInitialNetValues(selectedRow);
  }, [data, selectedRowNum]);

  return (
    <div className="App">
      <Select
        style={{ width: "100px", margin: "20px 0" }}
        defaultValue={1}
        onChange={handleSelectChange}>
        {data.map(item => (
          <Select.Option key={item.id} value={item.row}>{item.row}</Select.Option>
        ))}
      </Select>
      <Formik
        enableReinitialize
        initialValues={initialNetValues}
        validationSchema={validationNetSchema}
        onSubmit={() => { }}
        component={(props: FormikProps<IData>) => {
          const { dirty, errors, touched, handleSubmit } = props;
          console.log(`dirty: ${dirty},\nerrors: ${Object.keys(errors).length > 0 ? true : false},\ntouched ${Object.keys(touched).length > 0 ? true : false}
          `);
          return (
            <Form
              onSubmit={handleSubmit}
              style={{ margin: '0 auto', width: "500px" }}>
              <NetFields />
              <InfoTable
                selectedRowNum={selectedRowNum}
              />
              <Row>
                <Button style={{ marginRight: "10px" }}>Cancel</Button>
                <Button
                  type="primary"
                  disabled={!dirty || Object.keys(errors).length > 0 || !touched}
                  htmlType="submit"
                >
                  Apply
                </Button>
              </Row>
            </Form>
          );
        }}
      >
      </Formik>
    </div>
  );
}

export default App;
