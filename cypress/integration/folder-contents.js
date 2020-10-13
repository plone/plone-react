if (Cypress.env('API') !== 'guillotina') {
  describe('Folder Contents Tests', () => {
    beforeEach(() => {
      // given a logged in editor
      // and a folder that contains a document
      // and the folder contents view
      cy.visit('/');
      cy.autologin();
      cy.createContent({
        contentType: 'Folder',
        contentId: 'my-folder',
        contentTitle: 'My Folder',
      });
      cy.createContent({
        contentType: 'Document',
        contentId: 'my-document',
        contentTitle: 'My Document',
        path: 'my-folder',
      });
      cy.visit('/my-folder/contents');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
    });

    it('Renaming via folder contents view', () => {
      // when I rename a content object
      cy.get('svg[class="icon unchecked"]').click();
      cy.get('svg[class="icon rename"]').click();
      cy.get('input[name="0_title"]').clear().type('Brand new document title');
      cy.get('input[name="0_id"]').clear().type('brand-new-document-title');
      cy.get('.modal button[title="Save"]').click();

      // then the new document title and ID should show up in the folder contents view
      cy.get('#content-core table')
        .contains('Brand new document title')
        .should('have.attr', 'href')
        .and('eq', '/my-folder/brand-new-document-title/contents');
    });

    it('Copying the content in the same folder', () => {
      cy.get('svg[class="icon unchecked"]').click();
      cy.get('svg[class="icon copy"]').click();
      cy.get('svg[class="icon paste"]').click();
      cy.get('.icon.unchecked').should('have.length', 2);
    });

    it('Cuting the item and pasting into others', () => {
      cy.createContent({
        contentType: 'Document',
        contentId: 'child',
        contentTitle: 'My Child',
        path: 'my-folder',
      });
      cy.visit('my-folder/contents');
      cy.get('tbody>tr:nth-child(2) .unchecked').click();
      cy.get('svg[class="icon cut"]').click();
      cy.get('tbody>tr:nth-child(1) .expire-align > span').click();
      cy.get('svg[class="icon paste"]').click();

      //then their should be a My child
      cy.get('#content-core table').contains('My Child');
    });

    it('Deleting a item from a folder', () => {
      cy.get('svg[class="icon unchecked"]').click();
      cy.get('svg[class="icon delete"]').click();
      cy.get('.ui.primary.button').click();

      // then the folder content must be empty
      cy.get('.icon.unchecked').should('have.length', 0);
    });

    it('Changing Content State', () => {
      // when changing the state from private to publish
      cy.createContent({
        contentType: 'Document',
        contentId: 'child',
        contentTitle: 'My Child',
        path: 'my-folder/my-document',
      });
      cy.get('svg[class="icon unchecked"]').click();
      cy.get('svg[class="icon semaphore"]').click();
      cy.get('#field-state').click().type('Publish{enter}');
      cy.get('.checkbox').click();
      cy.get('button[title="Save"]').click();

      // then the content must change its state from private to publish
      // and its child also
      cy.get('#content-core table').contains('Published');
      cy.visit('/my-folder/my-document/contents');
      cy.get('#content-core table').contains('Published');
    });

    it('Sort method by creation field', () => {
      // when sort method invoked using creation field
      cy.createContent({
        contentType: 'Document',
        contentId: 'child',
        contentTitle: 'My Child',
        path: 'my-folder',
      });
      cy.visit('my-folder/contents');
      cy.get('.icon.configuration-svg').click();
      cy.get('.sort_CreationDate').invoke('trigger', 'mouseover');
      cy.get('.item.sort_created_descending').click({ force: true });

      // then the last document created must be the firs element
      cy.get('tbody>tr:nth-child(1) .expire-align > span').should(
        'have.text',
        ' My Child',
      );
    });

    it('Expiration date must not been set by default', () => {
      cy.get('.item.dropdown.right').click();
      cy.get('.icon.Expiration.date').click();
      cy.get('tbody>tr>td').eq(6).should('have.text', 'None');
    });
  });
}
