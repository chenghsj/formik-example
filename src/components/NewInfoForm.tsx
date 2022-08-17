import { Formik, FormikProps } from 'formik';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import * as uuid from 'uuid';
import { InfoFormModal } from '../InfoFormModal';
import { IInformation } from '../reduxSlice/dataSlice';
import { validationInfoSchema } from '../validationSchema/validationSchema';

export interface INewInfoFormProps {
    formikRef: any;
    newInfoRef: any;
}

export default forwardRef(function NewInfoForm({
    formikRef,
    newInfoRef,
    ...props
}: INewInfoFormProps, ref) {
    const [addInfoFomModalVisible, setAddInfoFomModalVisible] = useState(false);
    const handleAddInfoFormOk = (values: IInformation) => () => {
        setAddInfoFomModalVisible(false);
        const newInfo: IInformation = { ...values, id: uuid.v4() };
        formikRef.current.setValues({
            ...formikRef.current.values,
            information: formikRef.current.values.information.concat(newInfo)
        });
    };

    const handleAddInfoFormCancel = () => {
        setAddInfoFomModalVisible(false);
        newInfoRef.current.resetForm();
    };

    useImperativeHandle(ref, () => ({
        setAddInfoFomModalVisible
    }))

    return (
        <Formik
            innerRef={newInfoRef}
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
})
