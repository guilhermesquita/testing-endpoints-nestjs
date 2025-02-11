/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidationParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value && metadata.type === 'param') {
      throw new BadRequestException('Invalid');
    }

    return value;
  }
}
