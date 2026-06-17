import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

jest.mock('../src/auth/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    register: jest.fn(),
  })),
}));

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('POST /auth/login returns 200 and auth payload', async () => {
    authServiceMock.login.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      username: 'user',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'secret123' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'user-1',
            email: 'user@example.com',
            username: 'user',
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          }),
        );
      });

    expect(authServiceMock.login).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        password: 'secret123',
      }),
      expect.anything(),
    );
  });

  it('POST /auth/register returns 201 and creates user', async () => {
    authServiceMock.register.mockResolvedValue({
      id: 'user-2',
      email: 'new@example.com',
      username: 'new-user',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      accessToken: 'access-token-2',
      refreshToken: 'refresh-token-2',
    });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'new@example.com',
        username: 'new-user',
        password: 'secret123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: 'user-2',
            email: 'new@example.com',
            username: 'new-user',
            accessToken: 'access-token-2',
            refreshToken: 'refresh-token-2',
          }),
        );
      });

    expect(authServiceMock.register).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@example.com',
        username: 'new-user',
        password: 'secret123',
      }),
      expect.anything(),
    );
  });
});
