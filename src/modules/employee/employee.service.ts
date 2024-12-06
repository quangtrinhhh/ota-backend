import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmployeeEntity } from "src/entities/employee.entity";
import { Employee } from "src/models/employee.model";
import { Repository } from "typeorm";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
    ) { }

    isPhoneExist = async (phoneNumber: string, hotel_id: number) => {
        const phone = await this.employeeRepository.findOne({
            where: { phoneNumber, hotel_id },
        });
        console.log(phone);

        if (phone) return true;
        return false;
    };


    async getEmployeesByHotelId(hotel_id: number): Promise<Employee[]> {
        const employees = await this.employeeRepository.find({ where: { hotel_id } });
        return employees.map(employee => new Employee(
            employee.id,
            employee.code,
            employee.name,
            employee.birthDate,
            employee.gender,
            employee.idCard,
            employee.position,
            employee.startDate,
            employee.user_id,
            employee.phoneNumber,
            employee.email,
            employee.facebook,
            employee.address,
            employee.notes,
            employee.img,
            employee.status,
            employee.hotel_id
        )
        );
    }

    async createEmployees(createEmployees: CreateEmployeeDto[]): Promise<any[]> {

        const employees = await Promise.all(createEmployees.map(async item => {
            console.log(item);

            if (await this.isPhoneExist(item.phoneNumber, item.hotel_id)) {
                throw new Error(`Số điện thoại ${item.phoneNumber} đã tồn tại trong cửa hàng`)
            }
            const employee = new Employee();
            employee.code = item.code;
            employee.name = item.name;
            employee.phoneNumber = item.phoneNumber;
            employee.hotel_id = item.hotel_id;

            return await this.employeeRepository.save(employee);
        }));

        return employees;
    }

    async updateEmployee(updateEmployee: UpdateEmployeeDto): Promise<Employee> {
        const { id, ...updateEmployeeData } = updateEmployee;

        const updateResult = await this.employeeRepository.update(id, updateEmployeeData);
        if (updateResult.affected === 0) {
            throw new Error(`Không tìm thấy nhân viên với ID: ${id}`);
        }

        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new Error(`Không tìm thấy nhân viên sau khi cập nhật, ID: ${id}`);
        }

        return new Employee(
            employee.id,
            employee.code,
            employee.name,
            employee.birthDate,
            employee.gender,
            employee.idCard,
            employee.position,
            employee.startDate,
            employee.user_id,
            employee.phoneNumber,
            employee.email,
            employee.facebook,
            employee.address,
            employee.notes,
            employee.img,
            employee.status,
            employee.hotel_id
        )
    }


    async deleteEmployees(id: number): Promise<string> {
        const result = await this.employeeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return `Delete employee ${id} success`;
    }

    async updateStatusEmployee(id: number) {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new Error('Employee not found');
        }
        const newStatus = employee.status === 'Working' ? 'Resigned' : 'Working';
        await this.employeeRepository.update(id, { status: newStatus });

        return { message: 'Employee status updated successfully', newStatus };
    }
}
