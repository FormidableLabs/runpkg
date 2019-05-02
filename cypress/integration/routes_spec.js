describe('Runpkg.com Routing', () => {
  it('Visits the page + reroutes', () => {
    cy.request('https://unpkg.com/es-react@16.8.30/index.js');
    cy.visit('https://runpkg.com/es-react@16.8.30/index.js');
    cy.url().should('include', '/?es-react@16.8.30/index.js');
  });
});
