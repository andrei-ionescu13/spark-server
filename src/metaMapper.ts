import { Meta, MetaDoc } from './Meta';

export interface MetaDto {
  title: string;
  description: string;
  keywords: string[];
}

export interface MetaPersistance {
  title: string;
  description: string;
  keywords: string[];
}

export class MetaMapper {
  public static toDomain(entity: MetaDoc): Meta {
    const meta = Meta.reconstitute({
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    });

    return meta;
  }

  static toDto(entity: MetaDoc): MetaDto {
    return {
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    };
  }

  static toDtoList(entities: any[]): MetaDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Meta): MetaPersistance {
    return {
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    };
  }

  static domainToDto(entity: Meta): MetaDto {
    return {
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    };
  }
}
