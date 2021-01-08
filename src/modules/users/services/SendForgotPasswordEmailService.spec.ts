import 'reflect-metadata';

import CreateUserService from '@modules/users/services/CreateUserService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokenTokensRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let forgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    forgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
  });

  it('Should be able to Retrieve Password using email', async () => {
    const hasSendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await forgotPasswordEmail.execute({
      email: 'john.doe@gmail.com',
    });

    expect(hasSendEmail).toHaveBeenCalled();
  });

  it('Should not be able to Retrieve Password using non-existing email', async () => {
    
    await expect(forgotPasswordEmail.execute({
      email: 'john.doe@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {
    
    const generatedToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await forgotPasswordEmail.execute({
      email: 'john.doe@gmail.com',
    });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});