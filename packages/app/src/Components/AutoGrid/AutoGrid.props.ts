import {ViewProps} from 'react-native';

export type AutoGridProps = ViewProps & {
  itemSize: number;
  gap: number;
  children: React.ReactNode;
};

export type AutoGridSubComponents = {
  Element: React.FC<AutoGridElementProps>;
};

export type AutoGridElementProps = ViewProps & {
  children?: React.ReactNode;
};
