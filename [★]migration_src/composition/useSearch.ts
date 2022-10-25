import { ref, SetupContext } from '@vue/composition-api';
import useStore from '@/composition/useStore';
import { DEFAULT_TYPE } from '@/constants/catalog/constants';
import { IManufactureUIList } from '@/store/modules/manufacture/interfaces/IManagement';

type TSkip = {
  skip: number;
  take: number;
}

const useSearch = <T extends TSkip> (context: SetupContext, api: string)=> {
  const page = ref(1);
  const take = ref(100);
  const paramInfo = ref<T | null>(null);
  const { dispatch } = useStore(context);

  const useYnUIList: IManufactureUIList[] = [
    { label: '전체', value: DEFAULT_TYPE.ALL },
    { label: '노출', value: DEFAULT_TYPE.Y },
    { label: '비노출', value: DEFAULT_TYPE.N },
  ];
  const mfIdTypeUIList: IManufactureUIList[] = [
    { label: '제조사 코드', value: 'MAKERID' },
    { label: '브랜드 코드', value: 'BRANDID' },
    { label: '시리즈 코드', value: 'SERIESID' },
  ];

  const getParamInfo = (params)=> {
    const paramInfo = { ...params };
    paramInfo.skip = 0;
    paramInfo.take = take;
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
  };

  const fetchData = async (params = paramInfo.value)=> {
    if (params) {
      const { root } = context;
      root.$events.$emit('LOADING_START');
      paramInfo.value = params;
      api && await dispatch(api, params);
      root.$events.$emit('LOADING_FINISH');
    }
  };

  return {
    page,
    take,
    useYnUIList,
    mfIdTypeUIList,
    fetchData,
    getParamInfo,
    onChangePage() {
      if (paramInfo.value) {
        paramInfo.value = {
          ...paramInfo.value,
          skip: (
            page.value - 1
          ) * take.value,
          take: take.value,
        };
        fetchData();
      }
    },
  };
};

export default useSearch;
