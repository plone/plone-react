describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe(); // make sure axe is available on the page
  });

  it('Front page has not a11y violations', () => {
    cy.checkA11y(); // fail for a11y violations
  });

  it('Contact form has not a11y violations', () => {
    cy.navigate('/contact-form');
    cy.get('#field-name').click().type('Input');
    cy.get('#field-from').click().type('something@domain.com');
    cy.get('#field-subject').click().type('Input');
    cy.get('#field-message').click().type('Input');
    cy.checkA11y();
  });

  it('Table has no a11y violations', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'document',
      contentTitle: 'Document',
      path: '/',
    });
    cy.autologin();
    cy.visit('/document/edit');
    cy.get('.block.inner.text .public-DraftEditor-content').click();
    cy.get('.button .block-add-button').click();
    cy.get('[aria-label="Unfold Common blocks"]').click();
    cy.get('.blocks-chooser .common .button.table').click();
    cy.get('button[title="Insert row after"]').click();
    cy.get('button[title="Insert row after"]').click();
    cy.get('button[title="Insert col after"]').click();
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click().type('headline 1');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').click().type('headline 2');
    cy.get('tbody > :nth-child(1) > :nth-child(3)').click().type('headline 3');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').click().type('content');
    cy.get('tbody > :nth-child(2) > :nth-child(2)').click().type('content');
    cy.get('tbody > :nth-child(2) > :nth-child(3)').click().type('content');
    cy.get('tbody > :nth-child(3) > :nth-child(1)').click().type('content');
    cy.get('tbody > :nth-child(3) > :nth-child(2)').click().type('Headline 4');
    cy.get('input[name="field-celltype"]').click({ force: true });
    cy.get('tbody > :nth-child(3) > :nth-child(3)').click().type('content');
    cy.get('tbody > :nth-child(4) > :nth-child(1)').click().type('content');
    cy.get('tbody > :nth-child(4) > :nth-child(2)').click().type('content');
    cy.get('tbody > :nth-child(4) > :nth-child(3)').click().type('content');
    //save
    cy.get('#toolbar-save').click();
    //publish document
    //cy.url().should('eq', Cypress.config().baseUrl + '/document');
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
