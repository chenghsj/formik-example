import { Formik, FormikProps } from 'formik';
import * as uuid from 'uuid';
import { validationInfoSchema } from '../App';
import { InfoFormModal } from '../InfoFormModal';
import { IData, IInformation } from '../reduxSlice/dataSlice';

export interface INewInfoFormProps {
    newInfoRef: any;
    formikRef: any;
    selectedRowValues: IData;
    enableReinitialize: boolean;
    addInfoFomModalVisible: boolean;
    setAddInfoFomModalVisible: (bool: boolean) => void;
    setSelectedRowValues: (values: IData) => void;
    setEnableReinitialize: (bool: boolean) => void
}

export function NewInfoForm({
    newInfoRef,
    enableReinitialize,
    addInfoFomModalVisible,
    setAddInfoFomModalVisible,
    formikRef,
    selectedRowValues,
    setSelectedRowValues,
    setEnableReinitialize,
    ...props
}: INewInfoFormProps) {
    const handleAddInfoFormOk = (values: IInformation) => () => {
        console.log(values);
        setAddInfoFomModalVisible(false);
        const newInfo: IInformation = { ...values, id: uuid.v4() };
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

    const handleAddInfoFormCancel = () => {
        setAddInfoFomModalVisible(false);
    };

    return (
        <Formik
            innerRef={newInfoRef}
            enableReinitialize={enableReinitialize}
            initialValues={{
                id: "",
                age: 7,
                email: "",
                first_name: "",
                last_name: ""
            }}
            validationSchema={validationInfoSchema}
            onSubmit={(values) => { }}
            component={(props: FormikProps<IInformation>) => {
                const { values } = props;
                return (
                    <InfoFormModal
                        selectedInfoIdx={-1}
                        infoFormModalVisible={addInfoFomModalVisible}
                        handleInfoFormOk={handleAddInfoFormOk(values)}
                        handleInfoFormCancel={handleAddInfoFormCancel}
                        {...props}
                    />
                )
            }}
        />
    );
}
