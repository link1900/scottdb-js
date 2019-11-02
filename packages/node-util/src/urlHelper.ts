import queryString from 'query-string';
import { InternalServerError } from '@link1900/node-error';
import { isString } from 'lodash';
import { isUri } from '@link1900/node-validation';

export function buildUrl(url: string, queryParameters = {}): string {
  if (!isString(url)) {
    throw new InternalServerError(`Cannot build url for invalid url of '${url}'`);
  }
  let urlString = encodeURI(url);
  const paramString = queryParameters ? queryString.stringify(queryParameters) : '';
  if (paramString.length > 0) {
    urlString = `${urlString}?${paramString}`;
  }
  if (!isUri(urlString)) {
    throw new InternalServerError(`Cannot build url for invalid url of '${url}'`);
  }
  return urlString;
}
