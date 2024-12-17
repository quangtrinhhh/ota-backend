import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceEntity } from "src/entities/service.entity";
import { Service } from "src/models/service.model";
import { Like, Not, Repository } from "typeorm";
import { CreateServiceDto } from "./dto/createService.dto";
import { UpdateServiceDto } from "./dto/updateService.dto";

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>
    ) { }

    async getServices(): Promise<Service[]> {
        const services = await this.serviceRepository.find();
        return services.map(service => new Service(service.id, service.name, service.description, service.unit_price, service.category_id));
    }

    async findOneService(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            return null;
        }
        return new Service(service.id, service.name, service.description, service.unit_price, service.category_id);
    }

    async createService(createServiceDto: CreateServiceDto): Promise<Service> {
        const service = new Service();
        service.name = createServiceDto.name;
        service.description = createServiceDto.description;
        service.unit_price = createServiceDto.unit_price;
        service.category_id = createServiceDto.category_id;

        await this.serviceRepository.save(service);
        return new Service(service.id, service.name, service.description, service.unit_price, service.category_id);

    }

    async updateService(updateServiceDto: UpdateServiceDto): Promise<Service> {
        const { id, ...updateServiceData } = updateServiceDto;

        await this.serviceRepository.update(id, updateServiceData);

        const service = await this.serviceRepository.findOne({ where: { id } })
        return new Service(service.id, service.name, service.description, service.unit_price, service.category_id);
    }

    async deleteService(id: number): Promise<string> {
        await this.serviceRepository.delete(id);
        return `Delete service ${id} success`;
    }

    async deleteServices(id: number[]): Promise<string> {
        await this.serviceRepository.delete(id);
        return `Delete service ${id} success`;
    }

    async getServicesByHotelId(hotel_id: number): Promise<Service[]> {
        const services = await this.serviceRepository.find({
            where: { category: { hotel_id }, status: Not('out_of_business') },
            relations: ['category', 'category.hotel'],
        });

        return services.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
            unit_price: service.unit_price,
            category: {
                id: service.category.id,
                name: service.category.name,
                description: service.category.description,
                hotel_id: service.category.hotel_id,
            }
        }));
    }

    async getServicesByHotelIdAdmin(
        hotel_id: number,
        currentPage: number,
        pageSize: number,
        status: string,
        search: string,
        name_category: string,
    ) {
        const skip = (currentPage - 1) * pageSize
        const status_ = status === 'all' ? undefined : status as 'in_business' | 'out_of_business';
        const name_category_ = name_category === 'all' ? undefined : name_category;

        const whereCondition: any = {
            category: { hotel_id },
        }

        if (status_) {
            whereCondition.status = status_
        }
        if (search) {
            whereCondition.name = Like(`%${search}%`)
        }
        if (name_category) {
            whereCondition.category = { name: name_category_ }
        }

        const [services, count] = await this.serviceRepository.findAndCount(
            {
                where: whereCondition,
                relations: ['category', 'category.hotel'],
                skip,
                take: pageSize
            }
        )

        const totalPages = Math.ceil(count / pageSize);

        return {
            count: totalPages,
            services: services.map(service => ({
                ...service,
                category: {
                    id: service.category.id,
                    name: service.category.name,
                    description: service.category.description,
                    hotel_id: service.category.hotel_id,
                }
            }))
        };
    }

    async updateStatus(id: number) {
        const service = await this.serviceRepository.findOne({ where: { id } })

        const newStatus = service.status === 'in_business' ? 'out_of_business' : 'in_business'
        await this.serviceRepository.update(id, { status: newStatus })
        return 'service status updated successfully' + newStatus
    }
}