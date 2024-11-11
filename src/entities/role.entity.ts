import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}
