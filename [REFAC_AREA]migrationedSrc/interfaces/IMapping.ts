import { ActionTree, ActionContext } from 'vuex';

interface IMappingBrand {
  brandEngNm?: string;
  brandNm?: string;
  chgDt?: string;
  chgNm?: string;
  mapSeq?: number;
  regDt?: string;
  regNm?: string;
  brandUseYn?: string;
  wmpBrandNo: number;
}

interface IMappingSearchParams {
  brandNm?: string;
  ctlgDspYn?: string;
  makerNm?: string;
  makerUseYn?: string;
  brandUseYn?: string;
  mappingYn?: string;
  mfIdType?: string;
  srchMfId?: number;
  skip?: number;
  take?: number;
}

interface IMappingSearch {
  brandNm?: string;
  brandSeq?: number;
  ctlgDspYn?: string;
  chgDt?: string;
  chgNm?: string;
  makerNm?: string;
  makerSeq?: number;
  makerUseYn?: string;
  brandUseYn?: string;
  mappingYn?: string;
  regDt?: string;
  regNm?: string;
}

interface IMappingWmpBrandSearchParams {
  mappingYN?: string;
  srchKwd?: string;
  srchKwdType?: string;
  useYn?: string;
}

interface IMappingWmpBrandSearch {
  brandNm?: string;
  brandNmEng?: string;
  brandNo?: number;
  chgDt?: string;
  chgId?: string;
  ctlgBrandNm?: string;
  mappingYN?: string;
  regDt?: string;
  regId?: string;
  brandUseYn?: string;
}

export interface IState {
  mappingSearchTotalCount: number;
  mappingSearchList: IMappingSearch[];
  mappingSearchParams: IMappingSearchParams | null;
  selectedWmpBrandList: IMappingWmpBrandSearch[];
}

export interface IAction<S, R> extends ActionTree<S, R> {
  postMapping ({ dispatch }: ActionContext<S, R>, data: { brandSeq?: number; wmpBrandNos?: number[] }): Promise<any>;
  deleteMapping ({ dispatch }: ActionContext<S, R>, data: { mapSeqs: number[] }): Promise<any>;
  getMappingBrandSeq ({ dispatch }: ActionContext<S, R>, brandSeq: number): Promise<{ totalCount?: number; result?: IMappingBrand[] } | null>;
  postMappingCsvUpload ({ dispatch }: ActionContext<S, R>, data: string | Blob): Promise<any>;
  getMappingSearch ({ dispatch, commit }: ActionContext<S, R>, params: IMappingSearchParams): Promise<{ totalCount?: number; result?: IMappingSearch[] } | null>;
  getMappingWmpBrandSearch ({ dispatch }: ActionContext<S, R>, params: IMappingWmpBrandSearchParams): Promise<{ totalCount?: number; result?: IMappingWmpBrandSearch[] } | null>;
}
