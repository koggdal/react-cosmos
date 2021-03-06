// @flow

import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: 'First',
  second: 'Second'
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders selected fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'second'
        });

        expect(instance.toJSON()).toBe('Second');
      });
    });
  });

  it('renders blank state after unselecting fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'second'
        });

        await selectFixture({
          rendererId,
          fixturePath: null
        });

        expect(instance.toJSON()).toBe('No fixture loaded.');
      });
    });
  });

  it('ignores "selectFixture" message for different renderer', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId: 'foobar',
          fixturePath: 'second'
        });

        expect(instance.toJSON()).toBe('No fixture loaded.');
      });
    });
  });

  it('renders missing state on unknown fixture path', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'third'
        });

        expect(instance.toJSON()).toBe('Fixture path not found: third');
      });
    });
  });
}
