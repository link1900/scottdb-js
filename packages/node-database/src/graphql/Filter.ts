import { getConnectionMetadataStorage } from './connectionMetadataService';
import { ReturnTypeFunc } from 'type-graphql/dist/decorators/types';

export function Filter(returnTypeFunction: ReturnTypeFunc) {
  return (prototype: any, propertyKey: any) => {
    getConnectionMetadataStorage().collectFilterMetadata({
      className: prototype.constructor.name,
      fieldName: propertyKey,
      kind: returnTypeFunction()
    });
  };
}
