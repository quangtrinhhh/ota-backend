import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { User } from "src/models/user.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async getUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users.map(user => new User(user.id, user.user_name, user.password, user.email, user.phone, user.role_id));
    }
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new UserEntity();
        user.user_name = createUserDto.user_name;
        user.password = createUserDto.password;
        user.email = createUserDto.email;
        user.phone = createUserDto.phone;
        user.role_id = createUserDto.role_id;

        await this.userRepository.save(user);
        return new User(user.id, user.user_name, user.password, user.email, user.phone, user.role_id);
    }

    async getDetailUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } })
        return new User(user.id, user.user_name, user.password, user.email, user.phone, user.role_id);
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<string> {
        const { id, ...updateData } = updateUserDto;
        await this.userRepository.update(id, updateData)

        return "Update success";
    }

    async deleteUser(id: number): Promise<string> {
        await this.userRepository.delete(id);
        return `Delete user ${id} success`;
    }
}