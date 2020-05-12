if (Cypress.env('API') !== 'guillotina') {
  describe('Folder Contents Tests', () => {
    beforeEach(() => {
      // given a logged in editor
      // and a folder that contains a document
      // and the folder contents view
      cy.visit('/');
      cy.autologin();
      cy.createContent('Folder', 'my-folder', 'My Folder');
      cy.createContent('Document', 'my-document', 'My Document', 'my-folder');
      cy.visit('/my-folder/my-document');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
    });

    it('Should render Image gallery listing view', () => {
      // when inserting image and selecting image gallery listing
      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-image').click();
      cy.get('input[name="title"]').type('My image');
      cy.fixture('image.png', 'base64').then(fileContent => {
        cy.get('#field-image').upload(
          { fileContent, fileName: 'image.png', mimeType: 'image/png' },
          { subjectType: 'input' },
        );
      });
      cy.get('#toolbar-save').click();
      cy.visit('/my-folder/my-document');
      cy.get('.edit').click();
      cy.get('svg[class="icon block-add-button"]').click({ force: true });
      cy.get(
        '[style="transition: opacity 500ms ease 0ms;"] > :nth-child(2) > .ui',
      ).click();
      cy.get('#select-listingblock-template')
        .click()
        .type('imageGallery{enter}');
      cy.get('#toolbar-save').click();

      // then we should have a slide play or pause button
      cy.get('.image-gallery-play-button')
        .should('have.attr', 'aria-label')
        .and('eq', 'Play or Pause Slideshow');
    });
  });
}
