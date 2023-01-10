import { getConnectionMetadataStorage } from './connectionMetadataService';

export function OrderBy() {
  return (prototype: any, propertyKey: any) => {
    getConnectionMetadataStorage().collectOrderByMetadata({
      className: prototype.constructor.name,
      fieldName: propertyKey
    });
  };
}
