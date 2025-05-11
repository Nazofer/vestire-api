import { PaginationResponseDto } from '@/types/pagination';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class FindAllUsersDto {
  @ApiProperty({
    description: 'Фільтри для пагінації',
  })
  filters: PaginationResponseDto;

  @ApiProperty({
    description: 'Список користувачів',
    type: [User],
  })
  data: User[];
}
