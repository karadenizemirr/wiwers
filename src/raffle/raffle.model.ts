import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuid4} from 'uuid'
import { User } from "../user/user.model";
@Entity()
export class Raffle {

  @PrimaryGeneratedColumn('uuid')
  id:string = uuid4()

  @Column()
  name:string

  @Column()
  winner_number:string

  @Column({nullable:true})
  winner_user:string

  @Column()
  spares_number:string

  @Column()
  hashtag_number:string

  @Column()
  comment_keyword:string

  @Column()
  block_keyword:string

  @Column({nullable:true})
  is_like:boolean

  @Column({nullable:true})
  is_comment:boolean

  @Column({default: false})
  is_active:boolean

  @Column()
  post_query:string

  @CreateDateColumn()
  created_at:Date

  @UpdateDateColumn()
  updated_at:Date

  @ManyToOne(() => User , (user) => user.raffles)
  user:User

}