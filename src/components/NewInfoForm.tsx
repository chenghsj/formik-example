import { Formik, FormikProps } from 'formik';
import { useRef } from 'react';
import * as uuid from 'uuid';
import { InfoFormModal } from '../InfoFormModal';
import { IInformation } from '../reduxSlice/dataSlice';
import { validationInfoSchema } from '../validationSchema/validationSchema';

export interface INewInfoFormProps {
    formikRef: any;
    newInfoRef: any;
    enableReinitialize: boolean;
    addInfoFomModalVisible: boolean;
    setAddInfoFomModalVisible: (bool: boolean) => void;
    setEnableReinitialize: (bool: boolean) => void;
}

export function NewInfoForm({
    formikRef,
    newInfoRef,
    enableReinitialize,
    addInfoFomModalVisible,
    setAddInfoFomModalVisible,
    setEnableReinitialize,
    ...props
}: INewInfoFormProps) {
    const handleAddInfoFormOk = (values: IInformation) => () => {
        setAddInfoFomModalVisible(false);
        const newInfo: IInformation = { ...values, id: uuid.v4() };
        formikRef.current.setValues({
            ...formikRef.current.values,
            information: formikRef.current.values.information.concat(newInfo)
        });
        setEnableReinitialize(false);
    };

    const handleAddInfoFormCancel = () => {
        setAddInfoFomModalVisible(false);
        newInfoRef.current.resetForm();
    };

    return (
        <Formik
            innerRef={newInfoRef}
            enableReinitialize={enableReinitialize}
            initialValues={{} as IInformation}
            validationSchema={validationInfoSchema}
            onSubmit={() => { }}
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
                );
            }}
        />
    );
}
