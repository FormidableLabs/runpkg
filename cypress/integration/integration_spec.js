describe('Runpkg', () => {
  let url;
  before(() => {
    url =
      Cypress.env('env') === 'local'
        ? 'http://localhost:8080'
        : 'https://runpkg.com';
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
  it('Visits the page', () => {
    cy.visit(url + '/');
    cy.get('[data-test=Overlay-Button]', { timeout: 10000 }).click();
    cy.url().should('include', '/?lodash-es');
    cy.get('[data-test=title]').contains('lodash-es');
    cy.get('[data-test=Item]', { timeout: 10000 })
      .first()
      .click();
    cy.url().should('include', 'add.js');
  });
  it('When specified version no of dependencies is correct', () => {
    cy.visit(url + '/?react@16.8.6/index.js');
    cy.get('[data-test=title]').should('contain', 'react');
    cy.get('[data-test=Item]').should('have.length', 2);
  });
  it('When there are imports highlight functionality works', () => {
    cy.visit(url + '/?lodash-es');
    cy.get('.imports', { timeout: 100000 })
      .first()
      .should(el => {
        expect(el).to.not.have.css('text-decoration', 'underline');
      });
    cy.get('.imports')
      .first()
      .trigger('keydown', { metaKey: true })
      .should(el => {
        expect(el).to.have.css(
          'text-decoration',
          'underline solid rgb(255, 255, 255)'
        );
      });
    cy.get('.imports')
      .first()
      .trigger('keyup', { key: 'Meta' })
      .should(el => {
        expect(el).to.not.have.css(
          'text-decoration',
          'underline solid rgb(255, 255, 255)'
        );
      });
  });
});
