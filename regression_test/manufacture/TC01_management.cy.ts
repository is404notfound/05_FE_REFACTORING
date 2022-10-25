import { assertQchips, assertRowData, assertSearchResult, assertURL } from '../../utils/assertions';
import { clickButton, clickCheckBox, clickSelectBox, doLogin, selectMenuTab } from '../../utils/events';

describe('Manufacture tab spec', ()=> {
  const ALL_RECORDS_NUM = 845 as const;
  it('Manufacture Search', ()=> {
    // TODO :: pagination assertion
    doLogin();
    goManufactureTab();
    doSearch();
    assertSearchResult({ expectResult: ALL_RECORDS_NUM });
    assertBrandType({ selected: '테스트브랜드', expectResult: 6 });
    assertClickInit();
  });

  const goManufactureTab = ()=> {
    assertURL('/management');
    selectMenuTab({ depth1: '제조사/브랜드 관리', depth2: '제조사/브랜드 관리' });
    assertURL('/manufacture');
  };
  const doSearch = ()=> clickButton('검색');
  const assertBrandType = ({ selected, expectResult })=> {
    clickSelectBox('브랜드 유형');
    clickCheckBox(selected);
    assertQchips(selected);
    doSearch();
    assertSearchResult({ expectResult });
    assertRowData({ requireData: selected });
  };
  // TODO :: input boxes assertion
  const assertClickInit = ()=> {
    const assertRadioBoxAll = (selected)=> { cy.get('.q-radio').filter(`:contains(${selected})`).should('have.attr', 'aria-checked', 'true'); };

    clickButton('초기화');
    assertRadioBoxAll('전체');
    doSearch();
    assertSearchResult({ expectResult: ALL_RECORDS_NUM });
  };
});
