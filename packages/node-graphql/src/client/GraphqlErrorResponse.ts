export interface GraphqlErrorResponse {
  message: string;
  locations?: Array<{ [key: string]: number }>;
  path?: string[];
  extensions?: { [key: string]: any };
}
