import { currencyDb } from './index';

const createCurrency = async (props) => {
  const currency = await currencyDb.createCurrency(props);
  return currency;
};

const deleteCurrency = async (id) => {
  const currency = await currencyDb.getCurrency(id);

  if (!currency) {
    throw new NotFoundError('currency not found');
  }

  await currencyDb.deleteCurrency(id);
};

const listCurrencys = () => currencyDb.listCurrencies();

const searchCurrencies = async (query) => {
  const currencies = await currencyDb.searchCurrencies(query);
  const count = await currencyDb.getCurrenciesCount(query);

  return { currencies, count };
};

export const currencyServices = {
  createCurrency,
  deleteCurrency,
  listCurrencys,
  searchCurrencies,
};
