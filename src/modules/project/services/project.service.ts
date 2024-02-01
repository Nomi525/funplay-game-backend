import { Injectable } from '@nestjs/common';
import ProjectRepository from '../repository/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}
}
