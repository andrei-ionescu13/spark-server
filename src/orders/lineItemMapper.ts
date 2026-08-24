import { MappingValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { LineItem } from './lineItem';
import { LineItemDoc, OrderDoc } from './model';

export interface LineItemDto {
  _id: string;
  product: string;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
}

export class LineItemMapper {
  static toDomain(doc: LineItemDoc): Result<LineItem, MappingValidationError> {
    const lineItemOrError = LineItem.create({
      _id: doc._id,
      product: doc.product,
      finalLinePrice: doc.finalLinePrice,
      finalPrice: doc.finalPrice,
      originalPrice: doc.originalPrice,
      originalLinePrice: doc.originalLinePrice,
      quantity: doc.quantity,
    });
    if (lineItemOrError.isErr())
      return Result.fail(new MappingValidationError(lineItemOrError.error.message));

    return Result.ok(lineItemOrError.value);
  }

  static toDomainList(docs: LineItemDoc[]): Result<LineItem[], MappingValidationError> {
    const results = docs.map((doc) => LineItemMapper.toDomain(doc));
    const combinedResult = Result.combine(results);
    if (combinedResult.isErr())
      return Result.fail(new MappingValidationError(combinedResult.error.message));

    const lineItems = Result.getValues(results);
    return Result.ok(lineItems);
  }

  static toDto(doc: LineItemDoc): LineItemDto {
    return {
      _id: doc._id,
      product: doc.product,
      finalLinePrice: doc.finalLinePrice,
      finalPrice: doc.finalPrice,
      originalPrice: doc.originalPrice,
      originalLinePrice: doc.originalLinePrice,
      quantity: doc.quantity,
    };
  }

  static toDtoList(docs: LineItemDoc[]): LineItemDto[] {
    return docs.map((doc) => LineItemMapper.toDto(doc));
  }
}
