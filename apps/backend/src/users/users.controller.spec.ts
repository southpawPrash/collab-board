import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = { id: 1, name: 'Alice', email: 'alice@test.com' };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
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
    expect(await controller.findOne('1')).toEqual(mockUser);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('create should return the created user', async () => {
    expect(
      await controller.create({ name: 'Alice', email: 'alice@test.com' }),
    ).toEqual(mockUser);
    expect(mockService.create).toHaveBeenCalledWith('Alice', 'alice@test.com');
  });
});
