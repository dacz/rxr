import {
  CLIENTS_DATA_URL,
} from '../utils/constants';
import asyncFetchDataRx from '../utils/asyncFetchDataRx';

export const loadClientsAsync = (obs, notifyLoading, receivedData) =>
  obs
    .map(() => notifyLoading(Date.now()))
    .flatMap((url = CLIENTS_DATA_URL) => asyncFetchDataRx(url))
    .map(val => {
      const ts = Date.now();
      const error = (val instanceof Error) ? val.message : undefined;
      const data = error ? undefined : val;
      return receivedData({ data, error, ts });
    });
