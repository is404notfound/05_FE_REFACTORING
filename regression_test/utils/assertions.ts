export const assertURL = (path)=> {
  const current = cy.url();
  current.should('include', path);
};
export const assertSearchResult = ({ expectResult = 0 })=> { cy.get('.q-table__top', { timeout: 10000 }).contains('검색 결과').should('contain', `총 ${expectResult}건`); };
export const assertRowData = ({ requireData })=> { cy.get('.q-tr').should('contain', requireData); }; // 모든 row 가 해당 값을 가지고 있는지 확인
export const assertQchips = (name)=> cy.get('.q-chip').contains(name).should('exist');
