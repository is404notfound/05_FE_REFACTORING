import { IAction, IState } from './interfaces/IManagement';
import { Module } from 'vuex';

const initialState = (): IState=> (
  {
    manufactureDetail: null,
    manufactureSearchTotalCount: 0,
    manufactureSearchList: [],
    manufactureSearchParams: null,
    manufactureBrandTypes: [],
  }
);

export default <Module<IState, any>>{
  namespaced: true,

  state: initialState(),

  getters: {
    manufactureBrandTypesUIList: (state)=> {
      return state.manufactureBrandTypes.map(({ name, id })=> {
        return { label: name, value: id, selected: false };
      });
    },
  },

  actions: {
    /**
     * @description 브랜드 이미지 업로드
     */
    postBrandsImgs({ dispatch }, data) {
      return dispatch('apiRequest', {
        method: 'POST',
        url: '/api/manufacture/brands/imgs',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }, { root: true });
    },
    /**
     * @description 브랜드 W스타일 이미지 업로드
     */
    postWStyleImgs({ dispatch }, data) {
      return dispatch('apiRequest', {
        method: 'POST',
        url: '/api/manufacture/brands/wstyle/imgs',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 등록
     */
    postManufacture({ dispatch }, data) {
      return dispatch('apiRequest', { method: 'POST', url: '/api/leader/manufacture', data }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 수정
     */
    putManufacture({ dispatch }, data) {
      return dispatch('apiRequest', { method: 'PUT', url: '/api/leader/manufacture', data }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 삭제
     */
    deleteManufacture({ dispatch }, mfSeqs): Promise<any> {
      return dispatch('apiRequest', {
        method: 'DELETE',
        url: '/api/leader/manufacture',
        data: { mfSeqs },
      }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 조회 - 단건
     */
    async getManufactureMakerSeq({ dispatch, commit }, makerSeq) {
      const result = await dispatch('apiRequest', {
        url: `/api/leader/manufacture/${makerSeq}`,
        XSS: true,
      }, { root: true });
      commit('setManufactureMakerSeq', result);
      return result;
    },
    /**
     * @description 제조사/브랜드 수정 전 체크 - 적용버튼 클릭시
     */
    postManufactureCheckDuplForModify({ dispatch }, data) {
      return dispatch('apiRequest', {
        method: 'POST',
        url: '/api/leader/manufacture/checkDuplForModify',
        data,
        responseType: 'string',
      }, { root: true });
    },
    /**
     * @description 제조사/브랜드 등록 전 체크 - 적용버튼 클릭시
     */
    postManufactureCheckDuplForReg({ dispatch }, data) {
      return dispatch('apiRequest', {
        method: 'POST',
        url: '/api/leader/manufacture/checkDuplForReg',
        data,
      }, { root: true });
    },
    /**
     * @description 제조사/브랜드 일괄등록
     */
    postManufactureCsvUpload({ dispatch }, data) {
      return dispatch('apiRequest', {
        method: 'POST',
        url: '/api/leader/manufacture/csvUpload',
        data,
        XSS: true,
      }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 - 엑셀 다운로드
     */
    getManufactureExcel({ state, dispatch }) {
      if (!state.manufactureSearchParams) {
        return Promise.reject(new Error('fail'));
      }
      const { ...params } = state.manufactureSearchParams;
      return dispatch('apiRequest', { url: '/api/leader/manufacture/excel', params, XSS: true, responseType: 'stream' }, { root: true });
    },
    /**
     * @description 제조사/브랜드/시리즈 조회 - 목록
     */
    async getManufactureSearch({ dispatch, commit }, params) {
      const result = await dispatch('apiRequest', {
        url: '/api/leader/manufacture/search',
        params,
        XSS: true,
      }, { root: true });
      commit('setManufactureSearchParams', params);
      commit('setManufactureSearch', result);
      return result;
    },
    /**
     * @description 브랜드 유형 조회
     */
    async getManufactureBrandTypes({ dispatch, commit }) {
      const result = await dispatch('apiRequest', {
        url: '/api/brands/brand-types',
        XSS: true,
      }, { root: true })
        .then(res=> Array.isArray(res) ? res : []);
      commit('setManufactureBrandTypes', result);
      return result;
    },
    /**
     * @description 브랜드 유형 등록/수정/삭제
     */
    async postManufactureBrandTypes({ dispatch, commit }, data) {
      const result = await dispatch('apiRequest', {
        method: 'POST',
        url: '/api/brands/brand-types',
        data,
        XSS: true,
      }, { root: true })
        .then(res=> Array.isArray(res) ? res : []);
      result.length && commit('setManufactureBrandTypes', result);
      return result;
    },
    /**
     * @description 브랜드 유형 중복 검사
     */
    async getIsBrandTypeDuplicated({ dispatch }, params) {
      return await dispatch('apiRequest', {
        method: 'GET',
        url: `/api/brands/brand-types/brand-type-names/${params}/check-duplicate`,
        params,
        XSS: true,
      }, { root: true });
    },

    async getIsMappingBrandExist({ dispatch }, params) {
      return await dispatch('apiRequest', {
        method: 'GET',
        url: `/api/brands/brand-types/${params}/check-exist-mapped-brand`,
        params,
        XSS: true,
      }, { root: true });
    },
  } as IAction<IState, any>,

  mutations: {
    setManufactureMakerSeq(state, manufactureDetail) {
      state.manufactureDetail = manufactureDetail;
    },
    setBrandTypes(state, result) {
      state.manufactureBrandTypes = result;
    },
    clearManufactureDetail(state) {
      state.manufactureDetail = null;
    },
    setManufactureSearch(state, result) {
      if (result) {
        const { totalCount, result: list } = result;
        state.manufactureSearchTotalCount = totalCount;
        state.manufactureSearchList = list;
      }
    },
    setManufactureSearchParams(state, manufactureSearchParams) {
      state.manufactureSearchParams = manufactureSearchParams;
    },
    setManufactureBrandTypes(state, result) {
      state.manufactureBrandTypes = result;
    },
    clearStore(state) {
      const data = initialState();
      Object.keys(data).forEach(key=> state[key] = data[key]);
    },
  },
};
