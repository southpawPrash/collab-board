import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('signUp should hash password and return token', async () => {
    const createSpy = usersService.create as jest.Mock;
    createSpy.mockResolvedValue({ id: 1, email: 'a@b.com' });

    const result = await service.signUp('a@b.com', 'secret123');

    expect(createSpy).toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });

  it('signIn should return token if password matches', async () => {
    const findSpy = usersService.findByEmail as jest.Mock;
    const hashed = await bcrypt.hash('secret123', 10);
    findSpy.mockResolvedValue({ id: 1, email: 'a@b.com', password: hashed });

    const result = await service.signIn('a@b.com', 'secret123');

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });

  it('signIn should throw UnauthorizedException if user not found', async () => {
    const findSpy = usersService.findByEmail as jest.Mock;
    findSpy.mockResolvedValue(null);

    await expect(service.signIn('a@b.com', 'secret123')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('signIn should throw UnauthorizedException if password incorrect', async () => {
    const findSpy = usersService.findByEmail as jest.Mock;
    const hashed = await bcrypt.hash('secret123', 10);
    findSpy.mockResolvedValue({ id: 1, email: 'a@b.com', password: hashed });

    await expect(service.signIn('a@b.com', 'wrongpass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
