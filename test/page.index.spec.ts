import { mount } from '@vue/test-utils';
import nuxtLink from '../.nuxt/components/nuxt-link.client';
import Boss from '../pages/dang-nhap/index.vue';

// @ts-ignore
Boss.component.NuxtLink = nuxtLink;
describe('IndexPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Boss, {
      stubs: {
        nuxtLink: true,
      },
    });
    expect(wrapper.vm).toBeTruthy();
  });
});
