import services from '@/gomarky/descriptors';
import {
  IInstantiationService,
} from '@/platform/instantiation/common/instantiation';
import { defineComponent } from '@vue/composition-api';

const component = services
  .get(IInstantiationService)
  .invokeFunction(() => {
    return defineComponent({
      setup() {
        //
      },
      name: 'App',
      components: { Notification },
    });
  });

export default component;
