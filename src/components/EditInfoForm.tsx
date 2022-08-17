import { Formik, FormikHelpers, FormikProps, FormikState } from 'formik';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { InfoFormModal } from '../InfoFormModal';
import { IData } from '../reduxSlice/dataSlice';
import { validationSchema } from '../validationSchema/validationSchema';

export type EditInfoFormProps = {
    selectedInfoIdx: number;
    editInfoRef: any;
} & FormikState<any> & FormikHelpers<any>

export default forwardRef(function EditInfoForm({
    values,
    setValues,
    selectedInfoIdx,
    editInfoRef,
    ...props
}: EditInfoFormProps, ref) {
    const [editInfoFormModalVisible, setEditInfoFormModalVisible] = useState<boolean>(false);
    
    const handleInfoFormCancel = () => {
        setEditInfoFormModalVisible(false);
        editInfoRef.current.resetForm();
    };

    const handleInfoFormOk = (editedValues: IData) => () => {
        setEditInfoFormModalVisible(false);
        setValues(editedValues);
    };

    useImperativeHandle(ref, () => ({
        setEditInfoFormModalVisible
    }))

    return (
        <Formik
            innerRef={editInfoRef}
            enableReinitialize
            initialValues={values}
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
