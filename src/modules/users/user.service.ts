import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { User } from "src/models/user.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { hashPasswordHelper } from "src/helpers/util";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    isUserNameExist = async (user_name: string, hotel_id: number) => {
        const user = await this.userRepository.findOne({ where: { user_name, hotel_id } })
        if (user) return true;
        return false;
    }

    isEmailExist = async (email: string, hotel_id: number) => {
        const user = await this.userRepository.findOne({ where: { email, hotel_id } })
        if (user) return true;
        return false;
    }
    isPhoneExist = async (phone: string, hotel_id: number) => {
        const user = await this.userRepository.findOne({ where: { phone, hotel_id } })
        if (user) return true;
        return false;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users.map(user => new User(user.id, user.user_name, user.password, user.email, user.phone, user.hotel_id, user.role_id));
    }
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const hashPassword = await hashPasswordHelper(createUserDto.password);
        const user = new UserEntity();
        user.user_name = createUserDto.user_name;
        user.password = hashPassword;
        user.email = createUserDto.email;
        user.phone = createUserDto.phone;
        user.hotel_id = createUserDto.hotel_id;
        user.role_id = createUserDto.role_id;

        if (user.email && await this.isEmailExist(user.email, user.hotel_id)) {
            throw new Error('Email đã được đăng kí trong khách sạn');
        }
        if (user.phone && await this.isPhoneExist(user.phone, user.hotel_id)) {
            throw new Error('Số điện thoại đã được đăng kí trong khách sạn');
        }
        if (user.user_name && await this.isUserNameExist(user.user_name, user.hotel_id)) {
            throw new Error('Tên người dùng đã được đăng kí trong khách sạn');
        }


        await this.userRepository.save(user);
        return new User(user.id, user.user_name, user.password, user.email, user.phone, user.hotel_id, user.role_id);
    }

    async getDetailUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } })
        return new User(user.id, user.user_name, user.password, user.email, user.phone, user.hotel_id, user.role_id);
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<string> {
        const { id, hotel_id, ...updateData } = updateUserDto;

        if (updateData.email && await this.isEmailExist(updateData.email, hotel_id)) {
            throw new Error('Email đã được đăng kí trong khách sạn');
        }
        if (updateData.phone && await this.isPhoneExist(updateData.phone, hotel_id)) {
            throw new Error('Số điện thoại đã được đăng kí trong khách sạn');
        }
        if (updateData.user_name && await this.isUserNameExist(updateData.user_name, hotel_id)) {
            throw new Error('Tên người dùng đã được đăng kí trong khách sạn');
        }

        if (updateData.password) {
            updateData.password = await hashPasswordHelper(updateData.password);
        }
        await this.userRepository.update(id, updateData)

        return "Update success";
    }

    async deleteUser(id: number): Promise<string> {
        await this.userRepository.delete(id);
        return `Delete user ${id} success`;
    }
}