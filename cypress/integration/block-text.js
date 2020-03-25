if (Cypress.env('API') !== 'guillotina') {
  describe('Text Block Tests', () => {
    beforeEach(() => {
      cy.autologin();
      cy.createContent('Document', 'my-page', 'My Page');
      cy.visit('/my-page/edit');
    });

    it('As editor I can add a link to a text block', function() {
      // given
      cy.wait(2000);
      cy.get('.documentFirstHeading > .public-DraftStyleDefault-block');

      // when
      cy.get('.block.inner.text .public-DraftEditor-content')
        .type('Colorless green ideas sleep furiously.')
        .setSelection('furiously');
      cy.get(
        '#page-edit .draftJsToolbar__buttonWrapper__1Dmqh:nth-of-type(3)',
      ).click();
      cy.get('.link-form-container input').type('https://google.com{enter}');
      cy.get('#toolbar-save').click();

      // then
      cy.get('.block.text').contains('Colorless green ideas sleep furiously.');
      cy.get('.block.text a')
        .should('have.attr', 'href')
        .and('include', 'https://google.com');
    });

    it('As editor I can add a new line to a text block using shift + enter', function() {
      cy.visit('/');
      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-document').click();
      cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
        .type('This is a page')
        .get('.documentFirstHeading span[data-text]')
        .contains('This is a page');
      //when I select a text-block and hit shift+enter or ctrl+enter
      cy.get('.block.inner.text:nth-child(2n) .public-DraftEditor-content')
        .type('First line;{shift}{enter}')
        .type('Second line;{control}{enter}')
        .type('Third line.')
        .get('span[data-text]')
        .contains(`First line;
Second line;
Third line.`);
      //then the block should not be deselected
      cy.get('.block.inner.text:nth-child(2n) .block.text.selected');
      //then there should not be a new block created
      cy.get('.block.inner.text:nth-child(3n)').should('not.exist');

      cy.get('#toolbar-save').click();

      //then should have <BR> tag
      cy.get('#page-document p br').should('exist');
    });
  });
}
