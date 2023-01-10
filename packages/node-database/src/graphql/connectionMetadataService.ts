import { ConnectionMetadataStorage } from './ConnectionMetadataStorage';

let connectionMetadataStorage: ConnectionMetadataStorage;

export function getConnectionMetadataStorage(): ConnectionMetadataStorage {
  return connectionMetadataStorage || (connectionMetadataStorage = new ConnectionMetadataStorage());
}
