import {PrismaClient} from 'database';

const prisma = new PrismaClient({log: ['query', 'info', 'warn', 'error']});

const hideField = <TField extends string, THiddenValue>(
  field: TField,
  hiddenValue: THiddenValue,
): {
  needs: Record<TField, true>;
  compute: <TData extends Record<TField, THiddenValue>>(
    data: TData,
  ) => (() => TData[TField]) & THiddenValue;
} => {
  const computeField = <TData extends Record<TField, THiddenValue>>(data: TData) => {
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

const extended = prisma
  .$extends({
    name: 'hideFields',
    result: {
      user: {
        password: hideField('password', ''),
        jtis: hideField('jtis', [] as string[]),
        email: hideField('email', ''),
      },
    },
  })
  .$extends({
    name: 'views',
    model: {},
  });

export default extended;
