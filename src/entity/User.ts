import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  constructor(email: string, password: string){
    this.email = email;
    this.password = password;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 50, unique: true})
  email: string;

  @Column({type: 'char', length: 60})
  password: string;

  @Column({type: 'varchar', length: 100, nullable: true})
  name: string;

  @Column({type: 'varchar', length: 10, nullable: true})
  cardId: string;
}