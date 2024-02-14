import {useContext} from 'react';
import {View} from 'react-native';
import {ToastContext} from '../../Hooks/useToast';
import {AnimatedToast} from './AnimatedToast';
import styles from './ToastContainer.styles';

const ToastContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {toasts} = useContext(ToastContext);

  return (
    <>
      {children}

      <View style={styles.container}>
        {toasts.map((toast) => (
          <AnimatedToast key={toast.key} toast={toast} />
        ))}
      </View>
    </>
  );
};

export default ToastContainer;
