import { HttpException, HttpStatus } from '@nestjs/common';

export const throwServerError = (error: string) => {
  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
