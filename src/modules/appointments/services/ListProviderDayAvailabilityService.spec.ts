import 'reflect-metadata';

import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import FakeAppointmetsRepository from '@modules/appointments/repositories/fakes/FakeAppointmetsRepository';

import AppError from '@shared/errors/AppError';

let listProvidersDayAvailabilityService: ListProvidersDayAvailabilityService;
let fakeAppointmetsRepository: FakeAppointmetsRepository;

describe('ListProvidersDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmetsRepository = new FakeAppointmetsRepository();
    listProvidersDayAvailabilityService = new ListProvidersDayAvailabilityService(fakeAppointmetsRepository);
  });

  it('Should be able to list day availability for a given provider', async () => {
    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2020, 10, 20, 14, 0, 0),
    });

    await fakeAppointmetsRepository.create({
      provider_id: 'user',
      user_id: '123',
      date: new Date(2020, 10, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 10, 20, 11).getTime();
    });

    const availability = await listProvidersDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 11,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});