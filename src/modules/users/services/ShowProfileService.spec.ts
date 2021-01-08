import 'reflect-metadata';

import ShowProfileService from '@modules/users/services/ShowProfileService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import usersRouter from '../infra/http/routes/users.routes';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const profile = await showProfile.execute({ user_id: user.id})

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('john@doe.com');
  });  

  it('Should not be able to show non-existing profile', async () => {
    await expect(showProfile.execute({ 
      user_id: 'invalid-user-id',
    })).rejects.toBeInstanceOf(AppError);
  }); 
});