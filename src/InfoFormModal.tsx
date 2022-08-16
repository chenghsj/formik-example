import * as React from 'react';
import { Modal } from 'antd';
import InfoFields from './formFields/InfoFields';
import { IData, IInformation } from './reduxSlice/dataSlice';

export type IInfoFormModalProps = {
    dirty: any;
    errors: any;
    touched: any;
    values: any;
    infoFormModalVisible: boolean;
    selectedInfoIdx: number;
    handleInfoFormOk: () => void;
    handleInfoFormCancel: () => void;
};

export function InfoFormModal({
    infoFormModalVisible,
    dirty,
    errors,
    touched,
    handleInfoFormOk,
    handleInfoFormCancel,
    selectedInfoIdx,
    values,
    ...props
}: IInfoFormModalProps) {
    // let hasEmptyValue: boolean = false;
    // if (values.newInfo && Object.keys(values.newInfo).length === 0) hasEmptyValue = true
    const disabledOkButton = !dirty || Object.keys(errors).length > 0 || !touched
    // console.log(values, dirty, errors, touched);
    return (
        <Modal
            title={`${selectedInfoIdx < 0 ? "Add " : ""}Information`}
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
