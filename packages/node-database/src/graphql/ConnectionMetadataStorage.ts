export interface OrderByMetadata {
  className: string;
  fieldName: string;
}

export interface FilterMetadata {
  className: string;
  fieldName: string;
  kind: any;
}

export class ConnectionMetadataStorage {
  public orderBys: OrderByMetadata[] = [];
  public filters: FilterMetadata[] = [];

  collectOrderByMetadata(definition: OrderByMetadata) {
    this.orderBys.push(definition);
  }

  collectFilterMetadata(definition: FilterMetadata) {
    this.filters.push(definition);
  }
}
