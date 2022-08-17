import * as React from 'react';
import { Modal } from 'antd';
import InfoFields from './formFields/InfoFields';
import { FormikProps } from 'formik';

export type InfoFormModalProps = {
    infoFormModalVisible: boolean;
    selectedInfoIdx: number;
    handleInfoFormOk: () => void;
    handleInfoFormCancel: () => void;
} & FormikProps<any>;

export function InfoFormModal({
    values,
    dirty,
    errors,
    touched,
    handleInfoFormOk,
    handleInfoFormCancel,
    infoFormModalVisible,
    selectedInfoIdx,
    ...props
}: InfoFormModalProps) {
    const disabledOkButton = !dirty || Object.keys(errors).length > 0;

    return (
        <Modal
            title={`${selectedInfoIdx < 0 ? "Add " : "Edit "}Information`}
            visible={infoFormModalVisible}
            okButtonProps={{
                disabled: disabledOkButton
            }}
            onOk={handleInfoFormOk}
            onCancel={handleInfoFormCancel}
        >
            <InfoFields
                errors={errors} 
                touched={touched} 
                dirty={dirty} 
                values={values}
                selectedInfoIdx={selectedInfoIdx}
                {...props} />
        </Modal>
    );
}
