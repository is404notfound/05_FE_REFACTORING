<template>
  <basic-layout>
    <manufacture-search :page.sync="page"/>
    <result-table
      v-model="MAPPING_SEARCH_LIST"
      :columns="columns"
      :totalCount="MAPPING_SEARCH_TOTAL_COUNT"
      :page="page"
      :take="take"
      rowKey="makerSeq"
      isAutoHeight
      enableRowClick
      isSingleSelection
      @changePage="onChangePage"
      @changeSelectedItem="onChangeSelectedItem"
    >
      <template #top-text>
        검색 결과: 총 {{ MAPPING_SEARCH_TOTAL_COUNT | numeric }}건
      </template>
    </result-table>
    <brand-table v-if="selectedBrand" :selectedBrand="selectedBrand"/>
  </basic-layout>
</template>

<script>
import BasicLayout from '@/layouts/BasicLayout';
import ManufactureSearch from '@/components/manufacture/mapping/ManufactureSearch';
import ResultTable from '@/components/manufacture/ResultTable';
import BrandTable from '@/components/manufacture/mapping/BrandTable';
import { makeMappingColumns } from '@/constants/manufacture/columns';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Mapping',
  components: {
    BasicLayout,
    ManufactureSearch,
    ResultTable,
    BrandTable,
  },
  data() {
    return {
      page: 1,
      take: 10,
      selectedBrand: null,
    };
  },
  computed: {
    ...mapState('manufacture/mapping', {
      MAPPING_SEARCH_TOTAL_COUNT: 'mappingSearchTotalCount',
      MAPPING_SEARCH_LIST: 'mappingSearchList',
      MAPPING_SEARCH_PARAMS: 'mappingSearchParams',
    }),
    columns() {
      const getParams = { ...this.MAPPING_SEARCH_PARAMS };
      return makeMappingColumns({
        makerNm: getParams.makerNm,
        brandNm: getParams.brandNm,
      });
    },
  },
  beforeDestroy() {
    this.CLEAR_STORE();
  },
  methods: {
    ...mapActions('manufacture/mapping', {
      GET_MAPPING_SEARCH: 'getMappingSearch',
    }),
    ...mapMutations('manufacture/mapping', {
      CLEAR_STORE: 'clearStore',
    }),
    onChangePage(page) {
      if (this.page !== page) {
        this.page = page;
        this.fetch();
      }
    },
    onChangeSelectedItem(selected) {
      this.selectedBrand = selected.length ? selected[0] : null;
    },
    async fetch() {
      if (this.MAPPING_SEARCH_PARAMS) {
        this.$events.$emit('LOADING_START');
        await this.GET_MAPPING_SEARCH({
          ...this.MAPPING_SEARCH_PARAMS,
          skip: (
            this.page - 1
          ) * this.take,
        });
        this.$events.$emit('LOADING_FINISH');
      }
    },
  },
};
</script>
