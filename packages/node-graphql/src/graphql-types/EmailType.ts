import { GraphQLError, GraphQLScalarType, GraphQLString } from "graphql";
import { isEmail } from "@link1900/node-validation";

export const EmailType = new GraphQLScalarType({
  name: "Email",
  description: "Represents a valid email according to RFCs 5321 and 5322",
  serialize: (value) => {
    const result = GraphQLString.serialize(value);
    if (!isEmail(result)) {
      return null;
    }
    return result;
  },
  parseValue: (value) => {
    const result = GraphQLString.parseValue(value);
    if (!isEmail(result)) {
      throw new GraphQLError(`Error: Not a valid email: ${result}`);
    }
    return result;
  },
  parseLiteral: (ast, variables) => {
    const result = GraphQLString.parseLiteral(ast, variables);
    if (!isEmail(result)) {
      throw new GraphQLError("Error: Not a valid email", [ast]);
    }
    return result;
  },
});
