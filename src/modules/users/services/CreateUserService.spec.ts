import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  });

  it('Should be able to Create a new User', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to Create a new User with same email as another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await expect(createUser.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });
});