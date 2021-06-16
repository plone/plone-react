describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe(); // make sure axe is available on the page
    cy.autologin();
  });

  it('Front page has not a11y violations', () => {
    cy.checkA11y(); // fail for a11y violations
  });

  it('Contact form has not a11y violations', () => {
    cy.navigate('/contact-form');
    cy.checkA11y();
  });

  it('Table Block has no a11y violations', () => {
    //create new page for table
    cy.createContent({
      contentType: 'Document',
      contentId: 'document',
      contentTitle: 'Document',
      path: '/',
    });
    cy.visit('/document/edit');
    // create table
    cy.get('.block.inner.text .public-DraftEditor-content').click();
    cy.get('.button .block-add-button').click();
    cy.get('[aria-label="Unfold Common blocks"]').click();
    cy.get('.blocks-chooser .common .button.table').click();
    cy.get('.toolbar > :nth-child(2) > .ui > .icon').click();
    cy.get('.toolbar > :nth-child(2) > .ui > .icon').click();
    cy.get(':nth-child(5) > .ui > .icon').click();
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click().type('h1');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').click().type('h2');
    cy.get('tbody > :nth-child(1) > :nth-child(3)').click().type('h3');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').click().type('c');
    cy.get('tbody > :nth-child(2) > :nth-child(2)').click().type('c');
    cy.get('tbody > :nth-child(2) > :nth-child(3)').click().type('c');
    cy.get('tbody > :nth-child(3) > :nth-child(1)').click().type('c');
    cy.get('tbody > :nth-child(3) > :nth-child(2)').click().type('h4');
    cy.get('input[name="field-celltype"]').click({
      force: true,
    });
    cy.get('tbody > :nth-child(3) > :nth-child(3)').click().type('c');
    cy.get('tbody > :nth-child(4) > :nth-child(1)').click().type('c');
    cy.get('tbody > :nth-child(4) > :nth-child(2)').click().type('c');
    cy.get('tbody > :nth-child(4) > :nth-child(3)').click().type('c');
    //save
    cy.get('#toolbar-save').click();
    //publish document
    cy.url().should('eq', Cypress.config().baseUrl + '/document');
    cy.wait(500);
    cy.get('#toolbar-more').click();
    cy.get('.state-select .react-select-container').click();
    cy.findByText('Public').click();
    //logout
    cy.get('#toolbar-personal > .icon').click();
    cy.get('#toolbar-logout > .icon').click();
    //visit page and check for a11y violations
    cy.visit('/document');
    cy.injectAxe();
    cy.checkA11y();
  });

  /*
    it('Has no a11y violations after button click', () => {
      cy.get('button').click();
      cy.checkA11y(); // check after a rerender
    });
    */
});
