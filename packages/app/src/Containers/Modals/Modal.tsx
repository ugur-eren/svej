import {createElement, forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Modalize} from '@/Components';

type DefaultModalData = Record<string, unknown>;

export type ModalRef<TData extends DefaultModalData = DefaultModalData> = {
  modalRef: React.RefObject<Modalize | null>;
  open: (data: TData) => void;
  close: () => void;
};

/**
 * Creates a modal component that can be opened and closed programmatically with its ref.
 * The modal component will receive the data passed to the `open` method as props,
 * also a `modalizeRef` prop that can be used to access the underlying Modalize component.
 *
 * @template TData - The type of data that the modal will receive as props when opened.
 * @param render - A React functional component that renders the modal content. It receives the data passed to the `open` method as props, along with a `modalizeRef` prop.
 * @returns A React functional component that can be used as a modal.
 */
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
