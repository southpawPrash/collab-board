import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
  ) {}

  async create(user: User, dto: CreateProjectDto) {
    const project = this.repo.create({ ...dto, owner: user });
    return this.repo.save(project);
  }

  async findAll(user: User) {
    return this.repo.find({ where: { owner: { id: user.id } } });
  }

  async findOne(user: User, id: number) {
    const project = await this.repo.findOne({
      where: { id, owner: { id: user.id } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(user: User, id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(user, id);
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async remove(user: User, id: number) {
    const project = await this.findOne(user, id);
    return this.repo.remove(project);
  }
}
