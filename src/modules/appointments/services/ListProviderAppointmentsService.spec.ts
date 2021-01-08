import 'reflect-metadata';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeAppointmetsRepository from '@modules/appointments/repositories/fakes/FakeAppointmetsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmetsRepository: FakeAppointmetsRepository;
let fakeCacheProvider : FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmetsRepository, fakeCacheProvider);
  });

  it('Should be able to list the appointments on a specific day for a given provider', async () => {
    const appointment1 = await fakeAppointmetsRepository.create({
      provider_id: 'provider',
      user_id: '1234',
      date: new Date(2020, 10, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmetsRepository.create({
      provider_id: 'provider',
      user_id: '1234',
      date: new Date(2020, 10, 20, 15, 0, 0),
    });

    
    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      year: 2020,
      month: 11,
      day: 20,
    });

    await expect(appointments).toEqual(
      expect.arrayContaining([
        appointment1,
        appointment2,
      ])
    );
  });
});