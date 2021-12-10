import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import { isString } from "lodash";
import moment from "moment-timezone";

export const PLAIN_FORMAT = "YYYY-MM-DD";

export const PlainDateType = new GraphQLScalarType({
  name: "PlainDate",
  description:
    "Represents an abstract year, month and day and is not associated with a timezone or an instance of time. Used to return events in time that do you require instance resolution and which timezones are ignored. An example are Birthdays, which most people and institutions treat abstractly. String in ISO-8601 date format which is : YYYY-MM-DD",
  serialize: (value) => {
    if (moment.isMoment(value)) {
      return value.format(PLAIN_FORMAT);
    } else if (value instanceof Date) {
      return moment(value).format(PLAIN_FORMAT);
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
