export interface City {
    gubunEn: string;
    deathCnt: string;
    defCnt: string;
    isolClearCnt: string;
    stdDay: string;
    localOccCnt: string;
    qurRate: string;
    overFlowCnt: string;
    gubunCn: string;
    incDec: string;
    isolIngCnt: string;
    gubun: string;
  }
  
  export interface CovidSummaryResponse {
    pageNo: number;
    resultCode: number;
    totalCount: number;
    items: City[];
  }
  