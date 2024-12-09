import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "src/entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity,
        RoleEntity,
    ])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }