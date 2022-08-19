import { Formik, FormikHelpers, FormikProps, FormikState } from 'formik';
import { forwardRef, RefObject, useImperativeHandle, useState } from 'react';
import { InfoFormModal } from '../InfoFormModal';
import { IData } from '../reduxSlice/dataSlice';
import { validationSchema } from '../validationSchema/validationSchema';
import { trimObj } from './AddInfoForm';

export type EditInfoFormProps = {
    editInfoRef: RefObject<FormikProps<IData>>;
    formikRef: RefObject<FormikProps<IData>>;
    selectedInfoIdx: number;
}

export default forwardRef(function EditInfoForm({
    formikRef,
    editInfoRef,
    selectedInfoIdx,
    ...props
}: EditInfoFormProps, ref) {
    const [editInfoFormModalVisible, setEditInfoFormModalVisible] = useState<boolean>(false);

    const handleInfoFormCancel = () => {
        setEditInfoFormModalVisible(false);
        editInfoRef.current!.resetForm();
    };

    const handleInfoFormOk = (editedValues: IData) => () => {
        setEditInfoFormModalVisible(false);
        editInfoRef.current!.setValues(trimObj(editedValues));
        formikRef.current!.setValues(trimObj(editedValues));
    };

    useImperativeHandle(ref, () => ({
        setEditInfoFormModalVisible
    }))

    return (
        <Formik
            innerRef={editInfoRef}
            enableReinitialize
            initialValues={formikRef.current?.values as IData}
            validationSchema={validationSchema.pick(['information'])}
            onSubmit={() => { }}
            component={(props: FormikProps<IData>) => {
                const { values: editedValues } = props;
                return (
                    <InfoFormModal
                        selectedInfoIdx={selectedInfoIdx}
                        infoFormModalVisible={editInfoFormModalVisible}
                        handleInfoFormOk={handleInfoFormOk(editedValues)}
                        handleInfoFormCancel={handleInfoFormCancel}
                        {...props}
                    />
                );
            }}
        />
    );
})
