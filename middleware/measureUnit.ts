import { Middleware } from '@nuxt/types';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import { MutationState } from '@/constants/app.enum';

const setMeasureUnitMiddleware: Middleware = async ({ store }) => {
  if (!store.state.measureUnit.measureUnits) {
    try {
      const { data } = await MeasureUnitRepository.get({ page: 1, limit: 20 });
      store.commit(MutationState.SET_MEASURE_UNITS, Object.freeze(data.data.items));
    } catch (error) {}
  }
};

export default setMeasureUnitMiddleware;
