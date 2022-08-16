import * as React from 'react';
import { Modal } from 'antd';
import InfoFields from './formFields/InfoFields';
import { FormikProps } from 'formik';

export type IInfoFormModalProps = {
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
}: IInfoFormModalProps) {
    const disabledOkButton = !dirty || Object.keys(errors).length > 0;
    console.log(selectedInfoIdx);
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
            <InfoFields selectedInfoIdx={selectedInfoIdx} />
        </Modal>
    );
}
