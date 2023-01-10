import { Field } from "type-graphql";
import { Column, Entity, Index } from "typeorm";
import { Filter } from "../graphql/Filter";
import { OrderBy } from "../graphql/OrderBy";
import { Node } from "../graphql/Node";

@Entity()
export class Example extends Node {
  @Column()
  @Field()
  @Index()
  @OrderBy()
  @Filter(type => String)
  name: string;
}
