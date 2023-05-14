/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'filename' })
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;
}

