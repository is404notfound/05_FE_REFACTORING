import { host, id, pwd } from '../constants/account';

export const doLogin = () => {
  cy.visit(`${host}`);
  const isQRBtnMode = cy.get('body').find('button').contains('ID / PW');
  isQRBtnMode && isQRBtnMode.click();
  cy.get('input[type=text]').type(id)
    .get('input[type=password]').type(pwd);
  clickButton('로그인').wait(3000);
};
export const selectMenuTab = ({ depth1, depth2 }) => { clickButton(depth1).get('a').contains(depth2).click().wait(1000); };
export const clickButton = (name) => cy.get('button').contains(name).click();
export const clickSelectBox = (name) => cy.get('.q-select').contains(name).click({ force: true });
export const clickCheckBox = (name) => cy.get('.q-checkbox').contains(name).click({ force: true });
