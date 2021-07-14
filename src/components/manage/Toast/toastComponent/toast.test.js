import toastMock from './toast';

test('toast has my desired features', () => {
  expect(toastMock).toHaveProperty('error');
  expect(toastMock).toHaveProperty('success');
  expect(toastMock).toHaveProperty('info');
  expect(toastMock).toHaveProperty('warn');
  expect(toastMock).toHaveProperty('dismiss');
  expect(toastMock).toHaveProperty('isActive');
  expect(toastMock).toHaveProperty('update');
  expect(toastMock).toHaveProperty('clearWaitingQueue');
  expect(toastMock).toHaveProperty('done');
  expect(toastMock).toHaveProperty('configure');
});

test('toast function takes 2 arguments', () => {
  expect(toastMock.error.length).toEqual(2);
  expect(toastMock.success.length).toEqual(2);
  expect(toastMock.info.length).toEqual(2);
  expect(toastMock.warn.length).toEqual(2);
  expect(toastMock.dismiss.length).toEqual(1);
  expect(toastMock.isActive.length).toEqual(1);
  expect(toastMock.update.length).toEqual(2);
  expect(toastMock.clearWaitingQueue.length).toEqual(1);
  expect(toastMock.done.length).toEqual(1);
  expect(toastMock.configure.length).toEqual(1);
});
