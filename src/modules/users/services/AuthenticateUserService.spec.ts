import 'reflect-metadata';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to Authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    const response = await authenticateUser.execute({
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to Authenticate with non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'john.doe@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to Authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await expect(authenticateUser.execute({
      email: 'john.doe@gmail.com',
      password: '000000'
    })).rejects.toBeInstanceOf(AppError);

  });

  it('Should not be able to Authenticate with wrong email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await expect(authenticateUser.execute({
      email: 'potatoe@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);

  });
});