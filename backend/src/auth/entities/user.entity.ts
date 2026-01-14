import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //Email muss eindeutig sein > Index + unique
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  //Wir speichern nie das passwort im Klartext
  //Hier liegt nur der Hash(bcrypt)
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  //Automatisch gesetztes Erstellungsdatum
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
