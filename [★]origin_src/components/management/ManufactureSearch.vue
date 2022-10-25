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
        <th colspan="2">시리즈명</th>
        <td colspan="2">
          <q-input
            v-model="paramInfo.seriesName"
            label="시리즈명"
            class="wsin full-width"
            clearable
            outlined
            dense
            @keyup.enter.prevent="onClickSearch"
          />
        </td>
        <th colspan="2">
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
            label="코드"
            class="wsin full-width"
            clearable
            outlined
            dense
            @keyup.enter.prevent="onClickSearch"
          />
        </td>
        <td rowspan="4" class="bg-grey-3">
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
        <th colspan="2">제조사 프론트 서비스 노출<br>(카탈로그)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.makerUseYn"
            :options="useYnUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">브랜드 프론트 서비스 노출<br>(카탈로그)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.ctlgDspYn"
            :options="useYnUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">브랜드 프론트 상품명 노출<br>(상품)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.prodDispYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">브랜드 사용여부<br>(상품)</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.brandUseYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
      </tr>
      <tr>
        <th colspan="2">브랜드 유형</th>
        <td colspan="2">
          <q-select
            v-model="selectedBrandTypes"
            :options="MANUFACTURE_BRAND_TYPE_UI_LIST"
            label="브랜드 유형"
            class="col-auto wsin full-width"
            input-debounce="300"
            style="margin-left: 10px; width: calc(100% - 90px)"
            multiple
            emit-value
            outlined
            dense
            hide-selected
          >
            <template #option="{ itemProps, opt, toggleOption }">
              <q-option-group
                v-model="selectedBrandTypes.id"
                :options="[opt]"
                type="checkbox"
                @input="onSelectBrandType(opt)"
              />
            </template>
          </q-select>
          <q-chip
            v-for="(item, index) in selectedBrandTypes.name"
            :key="index"
            removable
            class="col-auto"
            size="sm"
            color="primary"
            text-color="white"
            @remove="onRemoveQChip(item)"
          >
            {{ item }}
          </q-chip>
        </td>
        <th colspan="2">브랜드 클러스터링</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.clstYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">W스타일 브랜드</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.wstyleYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">브랜드몰 인증</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.brandCertifiedYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
      </tr>
      <tr>
        <th colspan="2">브랜드 로고 이미지</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.brandImgYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">W스타일 브랜드 이미지</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.wstyleImgYn"
            :options="defaultUIList"
            size="xs"
            inline
          />
        </td>
        <th colspan="2">시리즈 등록여부</th>
        <td colspan="2">
          <q-option-group
            v-model="paramInfo.hasSeries"
            :options="defaultUIList"
            size="xs"
            inline
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
    brandUseYn: 'ALL',
    clstYn: 'ALL',
    makerNm: null,
    makerUseYn: 'ALL',
    mfIdType: 'MAKERID',
    seriesName: null, // 시리즈명
    seriesNm: null,
    srchMfId: null,
    wstyleYn: 'ALL',
    prodDispYn: 'ALL',
    brandCertifiedYn: 'ALL',
    brandImgYn: 'ALL',
    wstyleImgYn: 'ALL',
    hasSeries: 'ALL', // 시리즈 등록 여부
    brandTypeIds: [],
  };
}

const YN_TYPE_UI_LIST = [{ label: '브랜드 클러스터링', value: 'clstYn' }, { label: 'W스타일', value: 'wstyleYn' }];

export default {
  name: 'ManufactureSearch',
  mixins: [mixinSearch],
  data() {
    return {
      paramInfo: initParamInfo(),
      defaultUIList: DEFAULT_TYPE_UI_LIST,
      YN_TYPE_UI_LIST,
    };
  },
  methods: {
    ...mapActions('manufacture/management', {
      GET_MANUFACTURE_SEARCH: 'getManufactureSearch',
    }),
    async onClickSearch() {
      this.$events.$emit('LOADING_START');
      await this.GET_MANUFACTURE_SEARCH({ ...this.getParamInfo(), take: 100 });
      this.$emit('update:page', 1);
      this.$events.$emit('LOADING_FINISH');
    },
    onClickInit() {
      this.paramInfo = initParamInfo();
      this.initBrandTypes();
    },
  },
};
</script>
