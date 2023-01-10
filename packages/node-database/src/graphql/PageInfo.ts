import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
  @Field() hasPreviousPage: boolean;

  @Field() hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string;

  @Field({ nullable: true })
  startCursor?: string;

  @Field() total: number;

  @Field() pageSize: number;
}
