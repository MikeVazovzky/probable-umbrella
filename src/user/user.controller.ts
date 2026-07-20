import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
create(@Body() createUserDto: CreateUserDto){
  return this.userService.create(createUserDto);
 }
@Patch(':id')
update(
  @Param('id', ParseIntPipe)id: number,
  @Body() UpdateUserDto: UpdateUserDto,
) {
  return this.userService.update(id, UpdateUserDto);
}
 
 @Get()
 findAll() {
  return this.userService.findAll();
 }
 @Get(':id')
 findone(@Param('id', ParseIntPipe)id: number){
  return this.userService.findOne(id);
}
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number){
  return this.userService.remove(id);
}
}