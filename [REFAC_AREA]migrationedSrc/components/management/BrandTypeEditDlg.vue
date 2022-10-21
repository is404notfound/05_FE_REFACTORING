<template>
  <q-card style="min-width:60vw;">
    <q-tabs
      shrink
      stretch
      align="left"
      class="bg-primary text-white sticky-top"
    >
      <q-tab
        style="pointer-events: none"
        name="브랜드 유형 등록/수정"
        label="브랜드 유형 등록/수정"
      />
      <div class="q-ma-lg close" style="margin-top: 8px;">
        <q-btn
          color="white"
          text-color="white"
          class="q-ml-sm"
          label="저장"
          outline
          @click="onSave"
        />
        <q-btn
          v-close-popup
          color="white"
          text-color="white"
          class="q-ml-sm"
          label="취소"
          outline
          @click="showNotify"
        />
      </div>
    </q-tabs>

    <div class="col-md-5">
      <sorting-table
        ref="valTable"
        class="tableNoWrap"
        :tableData="brandTypesTableData"
        orderKeyName="sequence"
        :tableStyle="{ height: '477px' }"
      >
        <template #top-text>
          <div ref="top" class="col align-right">
            <q-btn
              class="q-ml-sm"
              color="primary"
              text-color="white"
              label="추가"
              @click.stop="onRowAdd"
            />
          </div>
        </template>
        <template #custom-name="{ data }">
          <q-input
            ref="brandTypeInput"
            v-model.trim="data.row.name"
            class="wsin full-width q-mt-sm"
            label="15자 이하로 입력해주세요."
            :rules="[$utils.rules.minRule(1), $utils.rules.maxRule(15), $utils.rules.blankRule(), duplicationRule(data.row.name)]"
            debounce="500"
            autofocus
            outlined
            dense
          >
          </q-input>
        </template>
        <template #custom-indexYn="{ data }">
          <q-radio
            v-model="data.row.indexYn"
            val="Y"
            label="Y"
          />
          <q-radio
            v-model="data.row.indexYn"
            val="N"
            label="N"
          />
        </template>
        <template #custom-delete="{ data }">
          <q-btn
            v-if="!isBrandTypeNormal(data.row.name)"
            color="primary"
            icon="close"
            size="xs"
            dense
            @click.stop="onRowDelete(data.row)"
          >
          </q-btn>
        </template>
      </sorting-table>
    </div>
  </q-card>
</template>

<script lang="ts">
import { makeBrandTypeEditColumns } from '@/constants/manufacture/columns';
import SortingTable from '@/components/filter/func/SortingTable.vue';
import { ref, computed, onMounted } from '@vue/composition-api';
import { useGenericStore } from '@/composition/useStore';
import useDialog from '@/composition/useDialog';
import { cloneDeep, differenceWith, isEqual } from 'lodash';

export default {
  name: 'BrandTypeEditDlg',
  components: {
    SortingTable,
  },
  setup(_props, { root }) {
    const { alert } = useDialog();
    const { state, dispatch: manufactureDispatch } = useGenericStore('manufacture', 'management');
    const manufactureBrandTypes = cloneDeep(computed(()=> state('manufactureBrandTypes')));
    const originManufactureBrandTypes = cloneDeep(manufactureBrandTypes.value);
    const brandTypesTableData = ref({
      columns: makeBrandTypeEditColumns(),
      data: manufactureBrandTypes.value as any[], // TODO :: ADD TS
    });
    const brandTypeInput = ref(null);
    const deleteFlags = [];
    const showNotify = ({ notify = 'error', message = '취소되었습니다.' })=> root.$events.$emit('SHOW_NOTIFY', { type: notify, message, timeout: 500 });

    onMounted(()=> root.$nextTick(()=> brandTypeInput.value.blur()));

    function makeSequence(): number {
      const { data } = brandTypesTableData.value;
      const sequenceList: number[] = data.map(({ sequence })=> { return sequence; });
      return sequenceList.length ? Math.max(...sequenceList) + 1 : 1;
    }

    function checkValidateAll() {
      const { data } = brandTypesTableData.value;
      const brandTypeList = data.map(({ name })=> { return name && name.trim(); });
      const brandTypeSet = new Set(brandTypeList);
      const CHECK_LIST = {
        DUPLICATION: {
          rule: ()=> { return brandTypeList.includes('') || brandTypeList.includes(null); },
          error: { title: '브랜드 유형', message: '브랜드 유형명을 입력해 주세요.' },
        },
        BLANK: {
          rule: ()=> { return data.length !== brandTypeSet.size; },
          error: { title: '브랜드 유형', message: '중복된 브랜드 유형명이 있습니다.' },
        },
      } as const;

      if (CHECK_LIST.BLANK.rule()) return CHECK_LIST.BLANK.error;
      if (CHECK_LIST.DUPLICATION.rule()) return CHECK_LIST.DUPLICATION.error;
    }

    function getDifference(origin, current) {
      const difference = differenceWith(current, origin, isEqual);
      const registered = difference.filter((row)=> !row.id && row);
      const modified = difference.filter((row)=> row.id && row);
      return { registered, modified };
    }

    async function onSave() {
      const error: { title: string; message: string } | null = checkValidateAll();
      if (error) {
        await alert(error);
        return;
      }
      const requestParams = getRequestParams();
      await manufactureDispatch('postManufactureBrandTypes', requestParams);
      await manufactureDispatch('getManufactureBrandTypes');
      closePopup();
    }

    function getRequestParams() {
      const { data: current } = brandTypesTableData.value;
      const { registered, modified } = getDifference(originManufactureBrandTypes, current);
      return {
        deleteBrandTypeIds: deleteFlags,
        modifyBrandTypeRequests: modified,
        registerBrandTypeRequests: registered,
      };
    }

    function closePopup() {
      showNotify({ notify: 'success', message: '저장되었습니다.' });
      root.$hidePopup();
    }

    function resetSequence() {
      const { data } = brandTypesTableData.value;
      brandTypesTableData.value.data = data.map((row, index)=> {
        row.sequence = index + 1;
        return row;
      });
    }

    function removeRow(id, seq) {
      const { data } = brandTypesTableData.value;
      brandTypesTableData.value.data = data.filter(({ sequence })=> { return sequence !== seq; });
    }

    return {
      onRowAdd() {
        const { data } = brandTypesTableData.value;
        const initialRow = {
          sequence: makeSequence(),
          name: null,
          id: null,
          indexYn: 'N',
        };
        data.push(initialRow);
      },
      async onRowDelete(row) {
        const { id: deleteId, sequence: deleteSeq } = row;
        const { existMappedBrand = false } = deleteId ? await manufactureDispatch('getIsMappingBrandExist', deleteId) : { existMappedBrand: false };

        if (existMappedBrand) {
          alert({ title: '삭제', message: '브랜드 유형에 매핑된 브랜드가 있습니다. 매핑 해제 후 삭제해 주세요.' });
          return;
        }

        deleteId && deleteFlags.push(deleteId);
        removeRow(deleteId, deleteSeq);
        resetSequence();
      },
      onSave,
      brandTypesTableData,
      duplicationRule: function () {
        return function (value: string) {
          if (!value) return;
          const { data } = brandTypesTableData.value;
          return value ? (data.filter(row=> { return row.name === value; }).length <= 1) || '중복된 값이 있습니다.' : true;
        };
      },
      isBrandTypeNormal: brandType=> brandType === '일반 브랜드',
      showNotify,
      brandTypeInput,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
