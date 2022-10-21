import { DEFAULT_TYPE } from '@/constants/catalog/constants';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'mixinSearch',
  props: {
    page: { type: Number, default: 1 },
    take: { type: Number, default: 10 },
  },
  computed: {
    ...mapGetters('manufacture/management', {
      MANUFACTURE_BRAND_TYPE_UI_LIST: 'manufactureBrandTypesUIList',
    }),
  },
  data() {
    return {
      paramInfo: null,
      useYnUIList: [
        { label: '전체', value: DEFAULT_TYPE.ALL },
        { label: '노출', value: DEFAULT_TYPE.Y },
        { label: '비노출', value: DEFAULT_TYPE.N },
      ],
      mfIdTypeUIList: [
        { label: '제조사 코드', value: 'MAKERID' },
        { label: '브랜드 코드', value: 'BRANDID' },
        { label: '시리즈 코드', value: 'SERIESID' },
      ],
      selectedBrandTypes: {
        id: [],
        name: [],
      },
    };
  },
  mounted() {
    this.GET_BRAND_TYPES_LIST();
  },
  methods: {
    ...mapActions('manufacture/management', {
      GET_BRAND_TYPES_LIST: 'getManufactureBrandTypes',
    }),
    getParamInfo() {
      const paramInfo = { ...this.paramInfo };
      paramInfo.skip = 0;
      paramInfo.take = this.take;
      Object.keys(paramInfo)
        .forEach(key=> {
          if (typeof paramInfo[key] === 'string') {
            paramInfo[key] = paramInfo[key].trim();
          }
        });
      //  srchMfId 는 빈값일경우 파라미터를 넘겨주면 안된다.
      if (paramInfo.srchMfId === '') {
        paramInfo.srchMfId = null;
      }
      return paramInfo;
    },
    onRemoveQChip(brandTypeName) {
      const selectedBrandTypes = this.selectedBrandTypes;
      this.removeByValue(selectedBrandTypes.name, brandTypeName);
      const selected = this.MANUFACTURE_BRAND_TYPE_UI_LIST.filter(({ label })=> selectedBrandTypes.name.includes(label));
      selectedBrandTypes.id = selected.map(({ value })=> value);
      this.setBrandTypeParam();
    },
    removeByValue(arr, value) {
      const idx = arr.indexOf(value);
      idx !== -1 && arr.splice(idx, 1);
    },
    setBrandTypeQChips() {
      const selectedBrandTypes = this.selectedBrandTypes;
      const selected = this.MANUFACTURE_BRAND_TYPE_UI_LIST.filter(({ value })=> selectedBrandTypes.id.includes(value));
      selectedBrandTypes.name = selected.map(({ label })=> label);
    },
    onSelectBrandType() {
      this.setBrandTypeParam();
      this.setBrandTypeQChips();
    },
    setBrandTypeParam() {
      this.paramInfo.brandTypeIds = this.selectedBrandTypes.id;
    },
    initBrandTypes() {
      const obj = this.selectedBrandTypes;
      Object.keys(obj).forEach(key=> obj[key] = []);
    },
  },
};
