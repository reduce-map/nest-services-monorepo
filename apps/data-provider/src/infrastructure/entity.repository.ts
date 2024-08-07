import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Schema } from '@nestjs/mongoose';

@Schema()
class MongooseSchema {}

export class EntityRepository<EntitySchema extends MongooseSchema> {
  constructor(protected readonly model: Model<EntitySchema>) {}

  create(entity: EntitySchema): Promise<EntitySchema> {
    return this.model.create(entity);
  }

  update(id: string, entity: UpdateQuery<EntitySchema>): Promise<EntitySchema | null> {
    const query = this.model.findByIdAndUpdate(id, entity, { new: true });
    return query.exec();
  }

  findById(id: string, populatePaths?: string[]): Promise<EntitySchema | null> {
    let query = this.model.findById(id);
    if (populatePaths) {
      populatePaths.forEach((path: string) => {
        query = query.populate(path) as any;
      });
    }
    return query.exec();
  }

  find(filter: FilterQuery<EntitySchema>, populatePaths?: string[]): Promise<EntitySchema | null> {
    let query = this.model.findOne(filter).lean();
    if (populatePaths) {
      populatePaths.forEach((path: string) => {
        query = query.populate(path) as any;
      });
    }
    return query.exec() as Promise<EntitySchema | null>;
  }

  deleteById(id: string): Promise<EntitySchema | null> {
    const query = this.model.findByIdAndDelete(id);
    return query.exec();
  }

  findByRange(
    limit: number,
    offset: number,
    filter: FilterQuery<EntitySchema>,
    sortOptions?: Record<string, 1 | -1>,
    populatePaths?: string[],
  ): Promise<EntitySchema[]> {
    let query = this.model.find(filter).sort(sortOptions).skip(offset).limit(limit);
    if (populatePaths) {
      populatePaths.forEach((path: string) => {
        query = query.populate(path) as any;
      });
    }
    return query.exec();
  }

  findMany(filter: FilterQuery<EntitySchema>, populatePaths?: string[]): Promise<EntitySchema[]> {
    let query = this.model.find(filter);
    if (populatePaths) {
      populatePaths.forEach((path: string) => {
        query = query.populate(path) as any;
      });
    }
    return query.exec();
  }

  getCountDocuments(filter?: FilterQuery<EntitySchema>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
