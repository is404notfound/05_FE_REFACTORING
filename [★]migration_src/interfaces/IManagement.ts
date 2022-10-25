import { ActionTree, ActionContext } from 'vuex';
import { DEFAULT_TYPE } from '@/constants/catalog/constants';

interface ISeries {
  modifyFlag?: string;
  seriesNm?: string;
  seriesSeq?: number;
  seriesUseYn?: string;
}

interface IBrandDetail {
  brandImgSeq?: number;
  brandNm?: string;
  brandSeq?: number;
  brandSynonymList?: string[];
  brandManagementNames?: string[];
  ctlgDspYn?: string;
  brandUseYn?: string;
  clstYn?: string;
  expl?: string;
  imgFlag?: string;
  imgUrl?: string;
  modifyFlag?: string;
  seriesList?: ISeries[];
  wstyleYn?: string;
  prodDispYn?: string;
  brandCertifiedYn?: string;
  wstyleExpl?: string;
  brandSiteUrl?: string;
  brandWStyleImgUrl?: string;
  brandTypes?: IBrandType[];
}

interface IBrandType {
  id: number;
  name: string;
}

interface IManufactureDetailPostData {
  brandDetailList?: IBrandDetail[];
  makerNm?: string;
  makerSynonymList?: string[];
  makerManagementNames?: string[];
  makerUseYn?: string;
}

interface IManufactureDetailPutData extends IManufactureDetailPostData {
  chgDt?: string;
  makerSeq?: number;
}

interface IManufactureDetail extends IManufactureDetailPutData {
  chgEnableYn?: string;
}

interface IManufactureSearch {
  brandNm?: string;
  brandSeq?: number;
  brandSynonym?: string;
  ctlgDspYn?: string;
  chgDt?: string;
  chgNm?: string;
  brandUseYn?: string;
  clstYn?: string;
  makerNm?: string;
  makerSeq?: number;
  makerSynonym?: string;
  makerManagementSynonym?: string;
  makerUseYn?: string;
  regDt?: string;
  regNm?: string;
  seriesNm?: string;
  wstyleYn?: string;
  seriesId?: number;
}

export interface IManufactureSearchParams {
  brandNm?: string;
  ctlgDspYn?: string;
  brandUseYn?: string;
  clstYn?: string;
  makerNm?: string;
  makerUseYn?: string;
  mfIdType?: string;
  srchMfId?: number | '';
  skip?: number;
  take?: number;
  seriesNm?: string;
  prodDispYn?: string;
  brandCertifiedYn?: string;
  seriesName?: string;
  hasSeries?: string;
  wstyleYn?: string;
  wstyleImgYn?: string;
  brandImgYn?: string;
  brandTypeIds: number[];
}

export interface IManufactureBrandType {
  id: number;
  indexYn: 'Y' | 'N';
  name: string;
  sequence: number;
}

export interface IManufactureUIList {
  label: string;
  value: DEFAULT_TYPE | number | string;
  selected?: boolean;
}

interface IManufactureBrandTypeParams {
  deleteBrandTypeIds: number[] | [];
  modifyBrandTypeRequests: IManufactureBrandType[] | [];
  registerBrandTypeRequests: IManufactureBrandType[] | [];
}

export interface IState {
  manufactureDetail: IManufactureDetail | null;
  manufactureSearchTotalCount: number;
  manufactureSearchList: IManufactureSearch[];
  manufactureSearchParams: IManufactureSearchParams | null;
  manufactureBrandTypes: IManufactureBrandType[] | [];
}

export interface IAction<S, R> extends ActionTree<S, R> {
  postBrandsImgs ({ dispatch }: ActionContext<S, R>, data: FormData): Promise<any>;
  postManufacture ({ dispatch }: ActionContext<S, R>, data: IManufactureDetailPostData): Promise<any>;
  putManufacture ({ dispatch }: ActionContext<S, R>, data: IManufactureDetailPostData): Promise<any>;
  deleteManufacture ({ dispatch }: ActionContext<S, R>, mfSeqs: { brandSeq?: number; makerSeq?: number }[]): Promise<any>;
  getManufactureMakerSeq ({ dispatch, commit }: ActionContext<S, R>, makerSeq: number):
  Promise<IManufactureDetail | null>;
  postManufactureCheckDuplForModify ({ dispatch }: ActionContext<S, R>, data: IManufactureDetailPutData): Promise<any>;
  postManufactureCheckDuplForReg ({ dispatch }: ActionContext<S, R>, data: IManufactureDetailPostData): Promise<any>;
  postManufactureCsvUpload ({ dispatch }: ActionContext<S, R>, data: FormData): Promise<any>;
  getManufactureExcel ({ state, dispatch }: ActionContext<S, R>): Promise<IManufactureSearch[] | null>;
  getManufactureSearch ({ dispatch, commit }: ActionContext<S, R>, params: IManufactureSearchParams): Promise<{ totalCount?: number; result?: IManufactureSearch[] } | null>;
  getManufactureBrandTypes ({ dispatch, commit }: ActionContext<S, R>): Promise<any>;
  postManufactureBrandTypes ({ dispatch, commit }: ActionContext<S, R>, params: IManufactureBrandTypeParams): Promise<any>;
}
