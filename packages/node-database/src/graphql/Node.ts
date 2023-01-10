import { VersionColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Field, ID, InterfaceType } from 'type-graphql';
import { OrderBy } from './OrderBy';
import { Filter } from './Filter';

@InterfaceType()
export abstract class Node {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @OrderBy()
  @Filter((type) => ID)
  id: string;

  @Index()
  @CreateDateColumn({ precision: 3 })
  @Field()
  @OrderBy()
  @Filter((type) => Date)
  createdAt: Date;

  @Index()
  @UpdateDateColumn({ precision: 3 })
  @Field()
  @OrderBy()
  @Filter((type) => Date)
  updatedAt: Date;

  @VersionColumn() public version: number;
}
