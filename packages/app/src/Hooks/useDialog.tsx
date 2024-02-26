import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {Dialog, Portal} from 'react-native-paper';
import Text from '../Components/Text/Text';
import TextButton from '../Components/TextButton/TextButton';
import type {TextButtonProps} from '../Components/TextButton/TextButton.props';

export type DialogConfig = {
  title?: string;
  message?: string;
  content?: React.ReactNode;
  actions?: {
    label: string;
    type?: 'default' | 'cancel' | 'destructive' | 'success';
    props?: Partial<TextButtonProps>;
    onPress?: () => void | Promise<void>;
    hideOnPress?: boolean;
  }[];
};

export const DialogContext = createContext<{
  dialog?: DialogConfig | undefined;
  showDialog: (dialog: DialogConfig) => () => void;
  hideDialog: () => void;
}>({
  dialog: undefined,
  showDialog: () => () => {
    //
  },
  hideDialog: () => {
    //
  },
});
export const DialogProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [dialog, setDialog] = useState<DialogConfig>();

  const showDialog = useCallback((newDialog: DialogConfig) => {
    setDialog(newDialog);

    return () => {
      setDialog(undefined);
    };
  }, []);

  const hideDialog = useCallback(() => {
    setDialog(undefined);
  }, []);

  const dialogContext = useMemo(
    () => ({dialog, showDialog, hideDialog}),
    [dialog, showDialog, hideDialog],
  );

  return (
    <DialogContext.Provider value={dialogContext}>
      {children}

      {dialog ? (
        <Portal>
          <Dialog visible onDismiss={hideDialog}>
            {dialog.title ? (
              <Dialog.Title>
                <Text weight="bold" fontSize={22}>
                  {dialog.title}
                </Text>
              </Dialog.Title>
            ) : null}

            {dialog.content ? (
              dialog.content
            ) : (
              <Dialog.Content>
                <Text weight="medium" fontSize={16}>
                  {dialog.message}
                </Text>
              </Dialog.Content>
            )}

            {dialog.actions ? (
              <Dialog.Actions>
                {dialog.actions.map((action) => (
                  <TextButton
                    key={action.label}
                    weight="medium"
                    color={
                      (
                        {
                          default: 'text',
                          cancel: 'textLight',
                          destructive: 'error',
                          success: 'success',
                        } as const
                      )[action.type || 'default']
                    }
                    onPress={
                      action.type === 'cancel'
                        ? hideDialog
                        : async () => {
                            if (action.onPress) action.onPress();
                            if (action.hideOnPress) hideDialog();
                          }
                    }
                    {...action.props}
                  >
                    {action.label}
                  </TextButton>
                ))}
              </Dialog.Actions>
            ) : null}
          </Dialog>
        </Portal>
      ) : null}
    </DialogContext.Provider>
  );
};

export const useShowDialog = () => {
  return useContext(DialogContext).showDialog;
};

export const useHideDialog = () => {
  return useContext(DialogContext).hideDialog;
};
