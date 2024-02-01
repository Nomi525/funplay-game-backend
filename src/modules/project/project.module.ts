import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './controllers/project.controller';
import { Project } from './entities/project.entity';
import ProjectRepository from './repository/project.repository';
import { ProjectService } from './services/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
  exports: [],
})
export class ProjectModule {}
