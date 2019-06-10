describe('Runpkg', () => {
  let url = 'http://localhost:8080';

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it('Visits the 404 page', () => {
    cy.visit(url + '/?loadashhhhhh');
    cy.get('[data-test="Error-Title"]', { timeout: 10000 }).contains('404');
    cy.get('[data-test="Error-Button"]', { timeout: 10000 }).click();
    cy.url().should('equal', url + '/');
  });
});
