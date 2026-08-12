import {useCallback, useMemo, useRef} from 'react';
import {ModalContext} from '@/Hooks/useModal';
import {UnionToIntersection} from '@/Types';
import AllModals from '.';
import type {ModalRef} from './Modal';

// For each modal export, get the `Modal` component's ref prop
// and extract the type of the data using infer.
// This will create a mapping of modal keys to their respective data types.
type ModalKeyToDataMap = {
  [K in keyof typeof AllModals]: NonNullable<
    React.ComponentPropsWithRef<(typeof AllModals)[K]['Modal']>['ref']
  > extends React.Ref<ModalRef<infer TData>>
    ? TData
    : never;
};

// Create a union type of all modal data types,
// and define a function type that takes a modal key and its corresponding data type
// returning a function that closes the modal.
type ModalHandlerUnion = {
  [K in keyof ModalKeyToDataMap]: (type: K, data: ModalKeyToDataMap[K]) => () => void;
}[keyof ModalKeyToDataMap];

// Convert the union type to an intersection type, resulting in a single function type
// that can handle all modal types and their respective data.
export type ModalHandlers = UnionToIntersection<ModalHandlerUnion>;

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const modalRefs =
    useRef<{[K in keyof ModalKeyToDataMap]?: ModalRef<ModalKeyToDataMap[K]> | null}>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = useCallback<ModalHandlers>((type, data: any) => {
    const refs = modalRefs.current;

    refs?.[type]?.open(data);

    return () => {
      refs?.[type]?.close();
    };
  }, []);

  const contextValue = useMemo(() => ({openModal}), [openModal]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {Object.keys(AllModals).map((key) => {
        const ModalComponent = AllModals[key].Modal;

        return (
          <ModalComponent
            key={key}
            ref={(node: ModalRef | null) => {
              if (!modalRefs.current) {
                modalRefs.current = {};
              }

              const refs = modalRefs.current;
              refs[key] = node;

              return () => {
                delete refs[key];
              };
            }}
          />
        );
      })}
    </ModalContext.Provider>
  );
};
