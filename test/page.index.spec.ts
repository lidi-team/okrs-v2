import { mount } from '@vue/test-utils';

import Boss from '../pages/dang-nhap/index.vue';

describe('IndexPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Boss);
    expect(wrapper.vm).toBeTruthy();
  });
});
