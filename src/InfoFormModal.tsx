import * as React from 'react';
import { Modal } from 'antd';
import InfoFields from './formFields/InfoFields';

export type IInfoFormModalProps = {
    infoFormModalVisible: boolean;
    selectedInfoIdx: number;
    handleInfoFormOk: () => void;
    handleInfoFormCancel: () => void;
    dirty: any;
    errors: any;
    touched: any;
};

export function InfoFormModal({
    infoFormModalVisible,
    dirty,
    errors,
    touched,
    handleInfoFormOk,
    handleInfoFormCancel,
    selectedInfoIdx,
    ...props
}: IInfoFormModalProps) {
    console.log(dirty, errors, touched);
    return (
        <Modal
            title={`${selectedInfoIdx < 0 ? "Add " : ""}Information`}
            visible={infoFormModalVisible}
            okButtonProps={{
                disabled: !dirty || Object.keys(errors).length > 0 || !touched
            }}
            onOk={handleInfoFormOk}
            onCancel={handleInfoFormCancel}
        >
            <InfoFields selectedInfoIdx={selectedInfoIdx} />
        </Modal>
    );
}
