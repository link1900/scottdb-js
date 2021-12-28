import { uuid } from "../stringHelper";

export abstract class Step<Context> {
  id: string;
  enabled: boolean;

  constructor(id?: string, enabled?: boolean) {
    this.id = id ?? uuid();
    this.enabled = enabled ?? true;
  }

  applies(context: Context): boolean | Promise<boolean> {
    return this.enabled;
  }

  abstract run(context: Context): Context | Promise<Context>;
}
