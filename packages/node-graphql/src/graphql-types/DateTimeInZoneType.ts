import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import moment from "moment-timezone";
import { isString } from "@link1900/node-util";

export const DateTimeInZoneType = new GraphQLScalarType({
  name: "DateTimeInZone",
  description:
    "Represents a date time in a timezone. String is formatted is full ISO-8601 which is the format: YYYY-MM-DDTHH:mm:ss+HH:MM with timezone always included.",
  serialize: (value) => {
    if (moment.isMoment(value)) {
      return value.toISOString(true);
    } else if (value instanceof Date) {
      return moment(value).toISOString(true);
    } else if (isString(value)) {
      return value;
    } else {
      return null;
    }
  },
  parseValue: (value) => {
    return moment(value);
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Error: can only parse strings got a: ${ast.kind}`,
        [ast]
      );
    }
    return moment(ast.value);
  },
});
