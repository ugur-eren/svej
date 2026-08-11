import {createElement, forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Modalize} from '@/Components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultModalData = Record<PropertyKey, any>;

export type ModalRef<TData extends DefaultModalData = DefaultModalData> = {
  modalRef: React.RefObject<Modalize | null>;
  open: (data: TData) => void;
  close: () => void;
};

export const createModal = <TData extends DefaultModalData = DefaultModalData>(
  render: React.FC<TData & {modalizeRef: React.RefObject<Modalize | null>}>,
) => {
  return forwardRef<ModalRef<TData>>((_, ref) => {
    const [data, setData] = useState<TData | null>(null);

    const modalizeRef = useRef<Modalize>(null);

    useImperativeHandle(ref, () => ({
      modalRef: modalizeRef,
      open: (newData) => {
        setData(newData);
        modalizeRef.current?.open();
      },
      close: () => {
        modalizeRef.current?.close();
      },
    }));

    const onModalClose = () => {
      setData(null);
    };

    return (
      <Modalize ref={modalizeRef} onClosed={onModalClose}>
        {data ? createElement(render, {...data, modalizeRef}) : null}
      </Modalize>
    );
  });
};
