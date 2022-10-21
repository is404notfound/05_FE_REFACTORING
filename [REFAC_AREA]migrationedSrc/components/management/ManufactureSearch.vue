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

<script lang="ts">
import { DEFAULT_TYPE_UI_LIST } from '@/constants/catalog/constants';
import { ref, onMounted, ComputedRef } from '@vue/composition-api';
import { useGenericStore } from '@/composition/useStore';
import useSearch from '@/composition/manufacture/useSearch';
import { IManufactureSearchParams, IManufactureUIList } from '@/store/modules/manufacture/interfaces/IManagement';

export default {
  name: 'ManufactureSearch',
  setup(props, context) {
    const { root, emit } = context;
    const { useYnUIList, mfIdTypeUIList, getParamInfo } = useSearch(context, '');
    const { toComputedGetter: manufactureGetter, dispatch: manufactureDispatch } = useGenericStore('manufacture', 'management');
    const paramInfo = ref(initParamInfo());
    const selectedBrandTypes = ref({ id: [], name: [] });
    const MANUFACTURE_BRAND_TYPE_UI_LIST: ComputedRef<IManufactureUIList[]> = manufactureGetter('manufactureBrandTypesUIList');
    onMounted(()=> {
      manufactureDispatch('getManufactureBrandTypes');
      manufactureDispatch('getManufactureSearch', { ...getParamInfo(paramInfo.value), take: 100 });
    });

    function initParamInfo(): IManufactureSearchParams {
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
    function removeByValue(arr, value) {
      const idx = arr.indexOf(value);
      idx !== -1 && arr.splice(idx, 1);
    }

    function setBrandTypeQChips() {
      const selectedBrandType = selectedBrandTypes.value;
      const selected = MANUFACTURE_BRAND_TYPE_UI_LIST.value.filter(({ value })=> selectedBrandType.id.includes(value));
      selectedBrandTypes.value.name = selected.map(({ label })=> label);
    }

    function setBrandTypeParam() {
      paramInfo.value.brandTypeIds = selectedBrandTypes.value.id;
    }

    function initBrandTypes() {
      const obj = selectedBrandTypes.value;
      Object.keys(obj).forEach(key=> obj[key] = []);
    }

    return {
      paramInfo,
      useYnUIList,
      mfIdTypeUIList,
      selectedBrandTypes,
      MANUFACTURE_BRAND_TYPE_UI_LIST,
      defaultUIList: DEFAULT_TYPE_UI_LIST,
      async onClickSearch() {
        root.$events.$emit('LOADING_START');
        await manufactureDispatch('getManufactureSearch', { ...getParamInfo(paramInfo.value), take: 100 });
        emit('update:page', 1);
        root.$events.$emit('LOADING_FINISH');
      },
      onClickInit() {
        paramInfo.value = initParamInfo();
        initBrandTypes();
      },
      onSelectBrandType() {
        setBrandTypeParam();
        setBrandTypeQChips();
      },
      onRemoveQChip(brandTypeName) {
        const { name } = selectedBrandTypes.value;
        removeByValue(name, brandTypeName);
        const selected = MANUFACTURE_BRAND_TYPE_UI_LIST.value.filter(({ label })=> name.includes(label));
        selectedBrandTypes.value.id = selected.map(({ value })=> value);
        setBrandTypeParam();
      },
    };
  },
};
</script>
