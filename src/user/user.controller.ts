import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 @Get()
 findAll() {
  return this.userService.findAll();
}

 @Get(':id')
 findone(@Param('id', ParseIntPipe)id: number){
  return this.userService.findOne(id);
}

@Post()
create(@Body() createUserDto: CreateUserDto){
  return this.userService.create(createUserDto);
 }

@Patch(':id')
update(
  @Param('id', ParseIntPipe)id: number,
  @Body() updateUserDto: UpdateUserDto,
) {
  return this.userService.update(id, updateUserDto);
}

@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number){
  return this.userService.remove(id);
}
}