import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = { id: 1, name: 'Alice', email: 'alice@test.com' };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array of users', async () => {
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('findOne should return a single user', async () => {
    const user = await service.findOne(1);
    expect(user).toEqual(mockUser);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('create should save and return a user', async () => {
    const user = await service.create('Alice', 'alice@test.com');
    expect(user).toEqual(mockUser);
    expect(mockRepo.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
    });
    expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
  });
});
