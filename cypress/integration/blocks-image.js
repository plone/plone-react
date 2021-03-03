if (Cypress.env('API') !== 'guillotina') {
  describe('Blocks Tests', () => {
    beforeEach(() => {
      // given a logged in editor and a page in edit mode
      cy.visit('/');
      cy.autologin();
      cy.createContent({
        contentType: 'Document',
        contentId: 'my-page',
        contentTitle: 'My Page',
      });
      cy.visit('/my-page');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('my-page');
      cy.navigate('/my-page/edit');
      cy.get(`.block.title [data-contents]`);
    });

    afterEach(() => {
      // Wait a bit to previous teardown to complete correctly because Heisenbug in this point
      // cy.wait(2000);
    });

    it('Add image block', () => {
      // when I add an image block
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.ui.basic.icon.button.block-add-button').click();
      cy.get('.ui.basic.icon.button.image').contains('Image').click();
      cy.get('.block.image .ui.input input[type="text"]').type(
        `https://github.com/plone/volto/raw/master/docs/logos/volto-colorful.png{enter}`,
      );
      cy.get('#toolbar-save').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/my-page');

      // then the page view should contain the image block
      cy.get('#page-document img').should(
        'have.attr',
        'src',
        'https://github.com/plone/volto/raw/master/docs/logos/volto-colorful.png',
      );
    });

    // OLD ADD IMAGE VIA DRAG AND DROP
    // it('Add image via drag and drop', () => {
    //   const block = 'image';

    //   // Add image Block
    //   cy.get('.block.text [contenteditable]').click();
    //   cy.get('button.block-add-button').click();
    //   cy.get('.blocks-chooser .title')
    //     .contains('media')
    //     .click();
    //   cy.get(
    //     '.content.active.blocks-list .ui.buttons:first-child button',
    //   ).click();

    //   const fileName = 'image.png';
    //   cy.fixture(fileName).then(fileContent => {
    //     cy.get(`.ui.block.${block} .dropzone`).upload(
    //       {
    //         fileContent,
    //         fileName,
    //         mimeType: 'application/png',
    //       },
    //       { subjectType: 'drag-n-drop' },
    //     );
    //   });
    // });

    // NEW ADD IMAGE VIA DRAG AND DROP
    // it('Add image via drag and drop', () => {
    //   // when I add an image block via drag and drop
    //   cy.get('.block.inner.text .public-DraftEditor-content').click();
    //   cy.get('.ui.basic.icon.button.block-add-button').click();
    //   cy.get('.ui.basic.icon.button.image')
    //     .contains('Image')
    //     .click();
    //   const imagePath = { filePath: 'image.png', mimeType: 'image/png' };
    //   cy.get('.ui.block.image .dropzone center img').attachFile(imagePath, {
    //     subjectType: 'drag-n-drop',
    //     force: true,
    //     allowEmpty: true,
    //     encoding: 'utf8',
    //   });
    //   cy.waitForResourceToLoad('image.png/@@images/image');

    //   cy.get('#toolbar-save').click();
    //   cy.wait(5000);
    //   cy.url().should('eq', Cypress.config().baseUrl + '/my-page');
    // });
    it('Add image via upload', () => {
      // when I add an image block via upload
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.ui.basic.icon.button.block-add-button').click();
      cy.get('.ui.basic.icon.button.image').contains('Image').click();

      cy.get('input[type="file"]').attachFile('image.png', {
        subjectType: 'input',
        encoding: 'utf8',
      });
      cy.waitForResourceToLoad('image.png/@@images/image');
      cy.get('#toolbar-save').click();

      // then image src must be equal to image name
      cy.get('.block img')
        .should('have.attr', 'src')
        .and('eq', '/my-page/image.png/@@images/image/listing');
    });

    it('Create a image block document in edit mode', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-document').click();
      cy.get('.block.inner.text .public-DraftEditor-content').click();
      cy.get('.ui.basic.icon.button.block-add-button').click();
      cy.get('.ui.basic.icon.button.image').contains('Image').click();

      cy.get('input[type="file"]').attachFile('image.png', {
        subjectType: 'input',
        encoding: 'utf8',
      });
      cy.waitForResourceToLoad('image.png/@@images/image');
      cy.get('.block img')
        .should('have.attr', 'src')
        .and('eq', '/image.png/@@images/image');
    });
  });
}
