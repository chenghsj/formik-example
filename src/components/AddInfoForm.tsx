import { Formik, FormikProps } from 'formik';
import { forwardRef, RefObject, useImperativeHandle, useState } from 'react';
import * as uuid from 'uuid';
import { InfoFormModal } from '../InfoFormModal';
import { IData, IInformation } from '../reduxSlice/dataSlice';
import { validationInfoSchema } from '../validationSchema/validationSchema';

export function trimObj(obj: any) {
    if (!Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function (acc, key) {
      (acc as any)[key.trim()] = typeof (obj as any)[key] == 'string' ? (obj as any)[key].trim() : trimObj((obj as any)[key]);
      return acc;
    }, Array.isArray(obj) ? [] : {});
  }

export interface IAddInfoFormProps {
    formikRef: RefObject<FormikProps<IData>>;
    addInfoRef: RefObject<FormikProps<IInformation>>;
}

export default forwardRef(function AddInfoForm({
    formikRef,
    addInfoRef,
    ...props
}: IAddInfoFormProps, ref) {
    const [addInfoFomModalVisible, setAddInfoFomModalVisible] = useState(false);
    const handleAddInfoFormOk = (values: IInformation) => () => {
        setAddInfoFomModalVisible(false);
        const newInfo: IInformation = { ...values, id: uuid.v4() };
        formikRef.current!.setValues(trimObj({
            ...formikRef.current!.values,
            information: formikRef.current!.values.information.concat(newInfo)
        }));
    };

    const handleAddInfoFormCancel = () => {
        setAddInfoFomModalVisible(false);
        addInfoRef.current!.resetForm();
    };

    useImperativeHandle(ref, () => ({
        setAddInfoFomModalVisible
    }))

    return (
        <Formik
            innerRef={addInfoRef}
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
