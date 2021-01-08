import 'reflect-metadata';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Johnathan Doe',
      email: 'johnathan@doe.com',
    });

    expect(updatedUser.name).toBe('Johnathan Doe');
    expect(updatedUser.email).toBe('johnathan@doe.com');
  });

  it('Should not be able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'j@doe.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane@doe.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Janet Doe',
      email: 'j@doe.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Johnathan Doe',
      email: 'johnathan@doe.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('Should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Johnathan Doe',
      email: 'johnathan@doe.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Johnathan Doe',
      email: 'johnathan@doe.com',
      password: '123123',
      old_password: '654321'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update non-existing profile', async () => {
    await expect(updateProfile.execute({ 
      user_id: 'invalid-user-id',
      name: 'test',
      email: 'test@doe.com',
    })).rejects.toBeInstanceOf(AppError);
  }); 
});