import { Reflector } from '@nestjs/core';

export const UserTypes = Reflector.createDecorator<number[]>();
