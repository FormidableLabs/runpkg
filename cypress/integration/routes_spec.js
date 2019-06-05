describe('Runpkg.com Routing', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
  it('Visits the page + reroutes', () => {
    cy.request('https://unpkg.com/es-react@16.8.30/index.js');
    cy.visit('https://runpkg.com/es-react@16.8.30/index.js');
    cy.url().should('include', '/?es-react@16.8.30/index.js');
    cy.get('[data-test=title]').should('contain', 'react');
  });
});
