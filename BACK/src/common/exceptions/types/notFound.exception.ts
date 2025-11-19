import { HttpException, HttpStatus } from '@nestjs/common';
import { stringConstants } from 'src/utils/string.constant';

export class NotFoundCustomException extends HttpException {
  constructor(type: NotFoundCustomExceptionType) {
    let message;
    switch (type) {
      case NotFoundCustomExceptionType.USER:
        message = stringConstants.userNotFound;
        break;
      default:
        message = stringConstants.notFound;
    }
    super(message, HttpStatus.NOT_FOUND);
  }
}

export enum NotFoundCustomExceptionType {
  USER,
}
