import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  mobileNumber: string;

  @Column()
  language: string;
  @Column()
  botID: string;

  // Progress tracking fields
  @Column({ nullable: true })
  topic: string;

  @Column({ nullable: true })
  difficulty: string;

  @Column({ default: 0 })
  currentquesindex: number;

  @Column({ default: 0 })
  setNumber: number;

  @Column({ default: 0 })
  score: number;
}
