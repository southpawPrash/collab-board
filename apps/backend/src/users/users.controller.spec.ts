import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = { id: 1, name: 'Alice', email: 'alice@test.com' };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn((id: number, fields: UpdateUserDto): User => {
      return { ...mockUser, ...fields } as User;
    }),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return an array of users', async () => {
    expect(await controller.findAll()).toEqual([mockUser]);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('findOne should return a single user', async () => {
    expect(await controller.findOne(1)).toEqual(mockUser);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('create should return the created user', async () => {
    expect(
      await controller.create({
        name: 'Alice',
        email: 'alice@test.com',
        password: '123456',
      }),
    ).toEqual(mockUser);
    expect(mockService.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      password: '123456',
    });
  });

  it('update should return the updated user', async () => {
    expect(
      await controller.update(1, { name: 'Alan', email: 'alan@test.com' }),
    ).toEqual({ id: 1, name: 'Alan', email: 'alan@test.com' });
    expect(mockService.update).toHaveBeenCalledWith(1, {
      name: 'Alan',
      email: 'alan@test.com',
    });
  });

  it('remove should return the removed user', async () => {
    const user = await controller.remove(1);
    expect(user).toEqual(mockUser);
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
