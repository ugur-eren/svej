import {prisma} from '@svej/database';

const hideField = <TField extends string, THiddenValue>(
  field: TField,
  hiddenValue: THiddenValue,
): {
  needs: {[key in TField]: true};
  compute: <TData extends {[key in TField]: THiddenValue}>(
    data: TData,
  ) => (() => TData[TField]) & THiddenValue;
} => {
  const computeField = <TData extends {[key in TField]: THiddenValue}>(data: TData) => {
    const getField = () => data[field];
    getField.toString = () => hiddenValue;

    return getField as (() => TData[TField]) & THiddenValue;
  };
  computeField.toString = () => hiddenValue;

  return {
    needs: {
      [field]: true,
    } as Record<TField, true>,
    compute: computeField,
  };
};

const extended = prisma.$extends({
  name: 'hideFields',
  result: {
    user: {
      password: hideField('password', ''),
      email: hideField('email', ''),
    },
  },
});

export default extended;
