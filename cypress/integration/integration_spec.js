describe('Runpkg', () => {
  let url;
  before(() => {
    url =
      Cypress.env('env') === 'local'
        ? 'http://localhost:8080'
        : 'https://runpkg.com';
  });
  it('Visits the page', () => {
    cy.visit(url + '/?runpkg-test');
    cy.url().should('include', '/?runpkg-test');
    cy.get('[data-testid="package-title"]');
  });
});
