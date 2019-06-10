describe('Runpkg', () => {
  let url = 'http://localhost:8080';

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it('Visits the 404 page', () => {
    cy.visit(url + '/?loadashhhhhh');
    console.log(window);
    cy.get('[data-test=Error-Title]', { timeout: 100000 }).contains('404');
    cy.get('[data-test=Error-Button]', { timeout: 100000 }).click();
    cy.url().should('equal', url + '/');
  });
});
