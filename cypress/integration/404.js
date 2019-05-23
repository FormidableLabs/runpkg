describe('Runpkg', () => {
  let url;
  before(() => {
    url =
      Cypress.env('env') === 'local'
        ? 'http://localhost:8080'
        : 'https://runpkg.com';
  });
  it('Visits the 404 page', () => {
    cy.visit(url + '/');
    cy.get('[data-test=Overlay-Button]', { timeout: 10000 }).click();
    cy.url().should('include', '/?lodash-es');
    cy.visit(url + '/?loadashhhhhh');
    cy.get('[data-test=Error-Title]', { timeout: 10000 }).contains('404');
    cy.get('[data-test=Error-Button]', { timeout: 10000 }).click();
    cy.url().should('equal', url + '/');
  });
});
