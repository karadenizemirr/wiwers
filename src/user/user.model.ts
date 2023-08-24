import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuid4} from 'uuid';
import { Raffle } from "../raffle/raffle.model";
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid4();

  @Column()
  name:string

  @Column()
  surname:string

  @Column()
  email:string

  @Column()
  phone_number:string

  @Column()
  password:string

  @Column({default: 'user'})
  role:string

  @CreateDateColumn()
  created_at:Date

  @UpdateDateColumn()
  updated_at:Date

  @Column({default: false})
  isActive: boolean;

  @OneToMany(() => Raffle, (raffle) => raffle.user)
  raffles:Raffle[]

}