<template>
  <q-page-container>
    <q-page>
      <div class="q-pa-md" :style="computedStyles">
        <slot/>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>

import { computed, toRefs } from '@vue/composition-api';

export default {
  name: 'BasicLayout',
  props: {
    fullHeight: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { fullHeight } = toRefs(props);
    const computedStyles = computed(()=> {
      const styles = [];
      if (fullHeight.value) {
        styles.push('height: 100%');
      }

      return styles.join(';');
    });

    return {
      computedStyles,
    };
  },
};
</script>
