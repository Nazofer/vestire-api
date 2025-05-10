import { B2BClient } from '@prisma/client';

export default class FindAllUsersDto {
  filters: {
    skip?: number;
    limit?: number;
    search?: string;
    sorted?: string;
    total: number;
    received: number;
  };
  data: B2BClient[];
}
