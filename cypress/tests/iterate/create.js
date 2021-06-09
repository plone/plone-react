describe('Working Copy Tests - Create', () => {
  beforeEach(() => {
    // given a logged in editor and a page in edit mode
    cy.visit('/');
    cy.autologin();
    cy.createContent({
      contentType: 'Document',
      contentId: 'document',
      contentTitle: 'Test document',
    });
    cy.visit('/document');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');
    cy.waitForResourceToLoad('document');
  });

  it('Basic create operation', function () {
    cy.get('#toolbar-more').click();
    cy.findByLabelText('Create working copy').click();
    cy.findByRole('alert').contains('This is a working copy of');
    cy.findByRole('alert')
      .get('.toast-inner-content a')
      .should('have.attr', 'href')
      .and('include', '/document');
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/working_copy_of_document',
    );

    cy.get('#toolbar-more').click();
    cy.findByLabelText('Apply working copy');
    cy.findByLabelText('Remove working copy');
  });

  it('Navigation through baseline-working copy', function () {
    cy.get('#toolbar-more').click();
    cy.findByLabelText('Create working copy').click();
    cy.findByRole('alert').get('.toast-inner-content a').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/document');
    cy.findByRole('alert').contains('This has an ongoing working copy in');
    cy.findByRole('alert')
      .get('.toast-inner-content a')
      .should('have.attr', 'href')
      .and('include', '/working_copy_of_document');

    cy.get('#toolbar-more').click();
    cy.findByLabelText('Apply working copy');
    cy.findByLabelText('Remove working copy');
  });

  it('Portal root does not have create option', function () {
    cy.visit('/');
    cy.get('#toolbar-more').click();
    cy.get('.menu-more').contains('Create working copy').should('not.exist');
  });
});
