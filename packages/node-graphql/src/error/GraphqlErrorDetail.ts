export type GraphqlErrorDetail = {
  message: string;
  originalError: unknown;
  extensions: Record<string, any>;
};
