import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import moment from "moment-timezone";

const timezoneList = moment.tz.names();

export const TimezoneGraphqlType = new GraphQLScalarType({
  name: "Timezone",
  description:
    "Represents a timezone location. string is formatted in a IANA tz database format.",
  serialize: (value: any) => {
    if (timezoneList.includes(value)) {
      return value;
    } else {
      return null;
    }
  },
  parseValue: (value: any) => {
    if (timezoneList.includes(value)) {
      return value;
    } else {
      throw new GraphQLError(`Error: invalid timezone string: ${value}`);
    }
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Error: can only parse strings got a: ${ast.kind}`,
        [ast]
      );
    }
    if (timezoneList.includes(ast.value)) {
      return ast.value;
    } else {
      throw new GraphQLError(`Error: invalid timezone string: ${ast.value}`, [
        ast,
      ]);
    }
  },
});
