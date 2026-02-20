import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module'; // adjust path if needed

interface LoginResponse {
  access_token: string;
}

interface SignupResponse {
  id: number;
  email: string;
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  const testUser = {
    email: 'e2e@test.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup - should create a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(201);

    const body = res.body as SignupResponse;

    expect(body).toHaveProperty('access_token');
    expect('password' in body).toBe(false);
  });

  it('POST /auth/signin - should return JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(testUser)
      .expect(201);

    const body = res.body as LoginResponse;
    jwtToken = body.access_token;

    expect(body).toHaveProperty('access_token');
    expect(typeof jwtToken).toBe('string');
  });

  it('POST /auth/signin - invalid password should fail', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...testUser, password: 'wrongpass' })
      .expect(401);
  });

  it('GET /users - protected route should fail without token', async () => {
    await request(app.getHttpServer()).get('/users').expect(401);
  });

  it('GET /users - protected route should succeed with token', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    // We know /users returns array of objects with email and id
    const users = res.body as { id: number; email: string }[];
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]).toHaveProperty('email');
  });
});
