<template>
  <basic-layout>
    <manufacture-search :page.sync="page"/>
    <result-table
      v-model="MANUFACTURE_SEARCH_LIST"
      :columns="tableColumn"
      :totalCount="MANUFACTURE_SEARCH_TOTAL_COUNT"
      :page="page"
      :take="take"
      rowKey="makerSeq"
      enableRowClick
      @changePage="onChangePage"
      @changeSelectedItem="onChangeSelectedItem"
    >
      <template #top-text>
        검색 결과: 총 {{ MANUFACTURE_SEARCH_TOTAL_COUNT | numeric }}건
      </template>
      <template #top-right-container>
        <q-btn
          size="xs"
          color="secondary"
          text-color="primary"
          class="lh"
          @click="onClickShowBrandTypeEditDlg"
        >
          브랜드 유형 등록/수정
        </q-btn>
        <q-btn
          label="등록"
          size="xs"
          color="primary"
          class="q-ml-md"
          @click="onClickShowAddDlg"
        />
        <q-btn
          label="수정"
          size="xs"
          class="q-ml-md"
          :disable="selectedList.length !== 1"
          @click="onClickShowModifyDlg"
        />
        <q-btn
          label="엑셀 다운로드"
          size="xs"
          class="q-ml-md"
          :disable="MANUFACTURE_SEARCH_TOTAL_COUNT === 0"
          @click="onClickDownloadExcel"
        />
      </template>
    </result-table>
  </basic-layout>
</template>

<script>
import ManufactureSearch from '@/components/manufacture/management/ManufactureSearch';
import ResultTable from '@/components/manufacture/ResultTable';
import { makeManufactureManagementColumns } from '@/constants/manufacture/columns';
import BasicLayout from '@/layouts/BasicLayout';
import mixinExcelWorker from '@/mixins/mixinExcelWorker';
import { downloadBlob } from '@/utils/common/blob';
import { mapActions, mapMutations, mapState } from 'vuex';

let RegisterExcelDlg = null;

const EditDlg = (
  function () {
    let EditDlg = null;
    return function () {
      if (!EditDlg) {
        EditDlg = ()=> import('@/components/manufacture/management/EditDlg');
      }
      return EditDlg;
    };
  }
)();

const BrandTypeEditDlg = (
  function () {
    let BrandTypeEditDlg = null;
    return function () {
      if (!BrandTypeEditDlg) {
        BrandTypeEditDlg = ()=> import('@/components/manufacture/management/BrandTypeEditDlg');
      }
      return BrandTypeEditDlg;
    };
  }
)();

export default {
  name: 'Management',
  components: {
    BasicLayout,
    ManufactureSearch,
    ResultTable,
  },
  mixins: [mixinExcelWorker],
  data() {
    return {
      page: 1,
      take: 100,
      selectedList: [],
    };
  },
  computed: {
    ...mapState('manufacture/management', {
      MANUFACTURE_SEARCH_TOTAL_COUNT: 'manufactureSearchTotalCount',
      MANUFACTURE_SEARCH_LIST: 'manufactureSearchList',
      MANUFACTURE_SEARCH_PARAMS: 'manufactureSearchParams',
    }),
    tableColumn() {
      const getParams = { ...this.MANUFACTURE_SEARCH_PARAMS };
      return makeManufactureManagementColumns({
        makerNm: getParams.makerNm,
        brandNm: getParams.brandNm,
        seriesNm: getParams.seriesName,
      });
    },
  },
  beforeDestroy() {
    this.CLEAR_STORE();
  },
  methods: {
    ...mapActions('manufacture/management', {
      DELETE_MANUFACTURE: 'deleteManufacture',
      GET_MANUFACTURE_EXCEL: 'getManufactureExcel',
      GET_MANUFACTURE_SEARCH: 'getManufactureSearch',
    }),
    ...mapMutations('manufacture/management', {
      CLEAR_STORE: 'clearStore',
    }),
    onChangeSelectedItem(selected) {
      this.selectedList = selected;
    },
    onClickShowBrandTypeEditDlg() {
      this.$showPopup(BrandTypeEditDlg());
    },
    onClickShowAddDlg() {
      this.$showPopup(EditDlg());
    },
    onClickShowModifyDlg() {
      const { makerSeq, brandSeq } = this.selectedList[0];
      this.$showPopup(EditDlg(), { makerSeq, brandSeq });
    },
    async onClickDelete() {
      await this.$confirm({ title: '삭제', message: '삭제 하시겠습니까?' });
      const result = await this.DELETE_MANUFACTURE(this.selectedList.map(({ makerSeq, brandSeq })=> (
        { makerSeq, brandSeq }
      )));
      if (result && result.status !== 500) {
        this.$events.$emit('SHOW_NOTIFY', { type: 'success', message: '삭제하였습니다.', timeout: 500 });
      }
      await this.fetch();
    },
    async onClickDownloadExcel() {
      try {
        this.$events.$emit('LOADING_START');
        const result =  await this.GET_MANUFACTURE_EXCEL();
        await downloadBlob('제조사/브랜드 관리', result);
      } catch (err) {
        this.$alert({ title: '오류', message: err.message });
      } finally {
        this.$events.$emit('LOADING_FINISH');
      }
    },
    onChangePage(page) {
      if (this.page !== page) {
        this.page = page;
        this.fetch();
      }
    },
    async fetch() {
      if (this.MANUFACTURE_SEARCH_PARAMS) {
        this.$events.$emit('LOADING_START');
        await this.GET_MANUFACTURE_SEARCH({
          ...this.MANUFACTURE_SEARCH_PARAMS,
          skip: (
            this.page - 1
          ) * this.take,
        });
        this.$events.$emit('LOADING_FINISH');
      }
    },
    getExcelParams(result) {
      return {
        columns: this.columns.map(({ name, label })=> (
          { name, label }
        )),
        data: result,
      };
    },
    onClickRegisterExcelDlg() {
      if (!RegisterExcelDlg) {
        RegisterExcelDlg = ()=> import('@/components/manufacture/management/RegisterExcelDlg');
      }
      this.$showPopup(RegisterExcelDlg, {
        skip: (
          this.page - 1
        ) * this.take,
      });
    },
  },
};
</script>
<style lang="scss">
.lh {
  line-height: 1.3em;
}
</style>
