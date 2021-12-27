import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Book {
  @Field()
  title: string;
}

@Resolver(Book)
export class BookResolver {
  @Query((returns) => Book)
  async book() {
    return { title: "test" };
  }
}
