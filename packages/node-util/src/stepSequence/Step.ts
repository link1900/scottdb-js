import { uuid } from "../stringHelper";

export abstract class Step<Context> {
  id: string;

  constructor(id?: string) {
    this.id = id ?? uuid();
  }

  abstract run(context: Context): Context | Promise<Context>;
}
