describe('Runpkg', () => {
  let url;
  before(() => {
    url =
      Cypress.env('env') === 'local' ? 'localhost:8080' : 'https://runpkg.com';
  });
  it('Visits the page', () => {
    cy.visit(url + '/');
    cy.get('.Overlay-Button', { timeout: 10000 }).click();
    cy.url().should('include', '/?lodash-es');
    cy.get('[data-test=title]').contains('lodash-es');
    cy.get('[data-test=DependenciesItem]', { timeout: 10000 })
      .first()
      .click();
    cy.url().should('include', 'add.js');
  });
  it('When specified version no of dependencies is correct', () => {
    cy.visit(url + '/?react@16.8.6/index.js');
    cy.get('[data-test=title]').should('contain', 'react');
    cy.get('[data-test=DependenciesItem]').should('have.length', 2);
  });
});
