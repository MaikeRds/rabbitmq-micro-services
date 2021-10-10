import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() createUser: CreateUserDTO): string {
    this.userService.create(createUser);
    return 'User created';
  }
}
