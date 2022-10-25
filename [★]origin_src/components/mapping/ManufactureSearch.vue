<template>
  <q-markup-table class="q-mb-sm" dense>
    <tbody>
      <tr>
        <th colspan="2">제조사명</th>
        <td colspan="2">
          <q-input
            v-model="paramInfo.makerNm"
            label="제조사명"
            class="wsin full-width"
            clearable
            outlined
            dense
            @keyup.enter.prevent="onClickSearch"
          />
        </td>
        <th colspan="2">브랜드명</th>
        <td colspan="2">
          <q-input
            v-model="paramInfo.brandNm"
            label="브랜드명"
            class="wsin full-width"
            clearable
            outlined
            dense
            @keyup.enter.prevent="onClickSearch"
          />
        </td>
        <th colspan="2">매핑 여부</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.mappingYn"
            :options="mappingYnUIList"
            size="xs"
            inline
          />
        </td>
        <td rowspan="2" class="bg-grey-3">
          <q-btn class="block q-ma-sm full-width bg-white" label="초기화" @click="onClickInit"/>
          <q-btn
            class="block q-ma-sm full-width"
            color="primary"
            label="검색"
            @click="onClickSearch"
          />
        </td>
      </tr>
      <tr>
        <th>프론트 서비스 노출<br>(제조사)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.makerUseYn"
            :options="useYnUIList"
            size="xs"
            inline
          />
        </td>
        <th>프론트 서비스 노출<br>(브랜드)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.ctlgDspYn"
            :options="useYnUIList"
            size="xs"
            inline
          />
        </td>
        <th>브랜드 사용여부(상품)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.brandUseYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th>
          <q-select
            v-model="paramInfo.mfIdType"
            :options="mfIdTypeUIList"
            label="생성타입"
            class="col-auto wsin full-width"
            emit-value
            map-options
            outlined
            dense
          />
        </th>
        <td colspan="2">
          <q-input
            v-model="paramInfo.srchMfId"
            :rules="[val => !isNaN(val) || '숫자만 입력해 주세요.']"
            label="코드"
            class="wsin full-width"
            clearable
            outlined
            dense
            @keyup.enter.prevent="onClickSearch"
          />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
import { mapActions } from 'vuex';
import mixinSearch from '@/mixins/manufacture/mixinSearch';
import { DEFAULT_TYPE_UI_LIST } from '@/constants/catalog/constants';

function initParamInfo() {
  return {
    brandNm: null,
    ctlgDspYn: 'ALL',
    makerNm: null,
    mappingYn: 'ALL',
    makerUseYn: 'ALL',
    brandUseYn: 'ALL',
    mfIdType: 'MAKERID',
    srchMfId: null,
  };
}

export default {
  name: 'ManufactureSearch',
  mixins: [mixinSearch],
  data() {
    return {
      paramInfo: initParamInfo(),
      defaultUIList: DEFAULT_TYPE_UI_LIST,
      mappingYnUIList: [
        { label: '전체', value: 'ALL' },
        { label: '매핑', value: 'Y' },
        { label: '미매핑', value: 'N' },
      ],
    };
  },
  methods: {
    ...mapActions('manufacture/mapping', {
      GET_MAPPING_SEARCH: 'getMappingSearch',
    }),
    async onClickSearch() {
      if (isNaN(this.paramInfo.srchMfId)) {
        const inputName = this.mfIdTypeUIList.find(v=> v.value === this.paramInfo.mfIdType).label;
        this.$alert({ title: '경고', message: `${inputName}는 숫자만 입력해 주세요.` });
        return;
      }
      this.$events.$emit('LOADING_START');
      await this.GET_MAPPING_SEARCH(this.getParamInfo());
      this.$emit('update:page', 1);
      this.$events.$emit('LOADING_FINISH');
    },
    onClickInit() {
      this.paramInfo = initParamInfo();
    },
  },
};
</script>
