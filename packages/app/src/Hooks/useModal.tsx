import {createContext, useContext} from 'react';
import type {ModalHandlers} from '@/Containers/Modals/ModalProvider';

export const ModalContext = createContext<{
  openModal: ModalHandlers;
}>({
  openModal: () => () => {
    //
  },
});
export const useOpenModal = () => {
  return useContext(ModalContext).openModal;
};
