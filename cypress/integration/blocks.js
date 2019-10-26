if (Cypress.env('API') !== 'guillotina') {
  describe('Blocks Tests', () => {
    beforeEach(() => {
      cy.autologin();
      cy.createContent('Document', 'my-page', 'My Page');
      cy.visit('/my-page/edit');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('?fullobjects');
    });

    it('Add title block', () => {
      cy.get(`.tile.title [data-contents]`)
        .clear()
        .type('My title');

      // Trying to get rid of the flaky test
      cy.get('.tile.inner.text .public-DraftEditor-content')
        .click()
        .type('My text')
        .get('span[data-text]')
        .contains('My text')
        .clear();

      cy.get('#toolbar-save').click();

      cy.get('#page-document').should('have.text', 'My title');
    });

    it('Add text block', () => {
      cy.get(`.tile.title [data-contents]`)
        .clear()
        .type('My title');
      cy.get('.tile.inner.text .public-DraftEditor-content')
        .click()
        .type('My text')
        .get('span[data-text]')
        .contains('My text');

      cy.get('#toolbar-save').click();

      cy.get('#page-document p').contains('My text');
    });

    // it('Add image block', () => {
    //   // Add image block
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('.tiles-chooser .title')
    //     .contains('media')
    //     .click();
    //   cy.get('.tiles-chooser .media')
    //     .contains('image')
    //     .click();

    //   //Type in external image URL
    //   cy.get(`.tile.image center input`)
    //     .click()
    //     .type(
    //       `https://github.com/plone/volto/raw/master/docs/logos/volto-colorful.png{enter}`,
    //     );

    //   cy.get('#toolbar-save').click();

    //   cy.get('#page-document img').should(
    //     'have.attr',
    //     'src',
    //     'https://github.com/plone/volto/raw/master/docs/logos/volto-colorful.png',
    //   );
    // });

    // it('Add image via drag and drop', () => {
    //   const tile = 'image';

    //   // Add image Block
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('.tiles-chooser .title')
    //     .contains('media')
    //     .click();
    //   cy.get(
    //     '.content.active.tiles-list .ui.buttons:first-child button',
    //   ).click();

    //   const fileName = 'image.png';
    //   cy.fixture(fileName).then(fileContent => {
    //     cy.get(`.ui.tile.${tile} .dropzone`).upload(
    //       {
    //         fileContent,
    //         fileName,
    //         mimeType: 'application/png',
    //       },
    //       { subjectType: 'drag-n-drop' },
    //     );
    //   });
    // });

    // it('Add video block', () => {
    //   // Add video block
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('.tiles-chooser .title')
    //     .contains('media')
    //     .click();
    //   cy.get('.tiles-chooser .media')
    //     .contains('video')
    //     .click();

    //   // Add YouTube URL to video block
    //   cy.get(`.tile.video .toolbar .ui.input input`)
    //     .type('https://www.youtube.com/watch?v=QmkD2vLGA6Y')
    //     .type('{enter}');

    //   // Save
    //   cy.get('#toolbar-save').click();

    //   // Check if YouTube iframe is present
    //   cy.get('#page-document iframe')
    //     .should('have.attr', 'src')
    //     .should('include', 'youtube.com/embed/QmkD2vLGA6Y');
    // });

    // it('Add hero block', () => {
    //   // TODO: Implement react dropzone for this tile to test the image

    //   const tile = 'hero';
    //   // const expectedFile = 'broccoli.jpg';
    //   const expectedTitle = 'Volto';
    //   const expectedDescription =
    //     'React-based front-end for the Plone and Guillotina';

    //   // Edit
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('button.show-hidden-tiles').click();
    //   cy.get(`button.add-${tile}-tile`).click();

    //   // cy.fixture(expectedFile).then(fileContent => {
    //   //   cy.get(`.tile.${tile} [data-cy="dropzone]`).upload(
    //   //     { fileContent, expectedFile, mimeType: 'application/json' },
    //   //     { subjectType: 'drag-n-drop' },
    //   //   );
    //   // });
    //   cy.get(
    //     `.tile.${tile} .title-editor > .public-DraftStyleDefault-block`,
    //   ).type(expectedTitle);
    //   cy.get(
    //     `.tile.${tile} .description-editor > .public-DraftStyleDefault-block`,
    //   ).type(expectedDescription);

    //   cy.get(
    //     `.tile.${tile} .title-editor > .public-DraftStyleDefault-block`,
    //   ).contains(expectedTitle);
    //   cy.get(
    //     `.tile.${tile} .description-editor > .public-DraftStyleDefault-block`,
    //   ).contains(expectedDescription);

    //   // Save
    //   // cy.get('#toolbar-save').click();

    //   // View
    //   if (Cypress.env('API') === 'plone') {
    //     // cy.get('#page-document h1').should('have.text', expected);
    //   } else {
    //     // guillotina
    //     // cy.contains(expected);
    //   }
    // });

    // it('Add maps block', () => {
    //   // Add maps block
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('.tiles-chooser .title')
    //     .contains('common')
    //     .click();
    //   cy.get('.tiles-chooser .common')
    //     .contains('maps')
    //     .click();

    //   // Fill maps block
    //   cy.get(`.tile.maps .toolbar .ui.input input`)
    //     .type(
    //       '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2525.497070288158!2d7.103133415464086!3d50.72926897951482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bee17434076fc7%3A0x2e99668f581378c8!2sRiesstra%C3%9Fe+21%2C+53113+Bonn!5e0!3m2!1sde!2sde!4v1561386702097!5m2!1sde!2sde" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>',
    //     )
    //     .type('{enter}');

    //   // Save
    //   cy.get('#toolbar-save').click();

    //   // Check if Google maps shows up in the page view
    //   cy.get('#page-document iframe')
    //     .should('have.attr', 'src')
    //     .should('include', 'maps');
    // });

    // it('Add HTML block', () => {
    //   // Add HTML block
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('.tiles-chooser .title')
    //     .contains('common')
    //     .click();
    //   cy.get('.tiles-chooser .common')
    //     .contains('html')
    //     .click();

    //   // Add HTML
    //   cy.get(`.tile.html .npm__react-simple-code-editor__textarea`).type(
    //     `<pre>This is html</pre>`,
    //   );
    //   cy.get(`.tile.html [aria-label="Preview"]`).click();
    //   cy.get(`.tile.html pre`).contains('This is html');

    //   // Save
    //   cy.get('#toolbar-save').click();

    //   // Check if HTML is present in the page view
    //   cy.get('#page-document pre').should('have.text', 'This is html');
    // });

    // it('Add table block', () => {
    //   // TODO: Figure out why there is an erro when add this tile in cypress

    //   // const tile = 'table';
    //   // const expected = 'This is the html';

    //   // Edit
    //   cy.get('.tile.text [contenteditable]').click();
    //   cy.get('button.tile-add-button').click();
    //   cy.get('button.show-hidden-tiles').click();
    //   // cy.get(`button.add-${tile}-tile`).click();
    //   // cy.get(`.tile.${tile} .npm__react-simple-code-editor__textarea`).type(
    //   //   `<h3>${expected}</h3>`,
    //   // );
    //   // cy.get(`.tile.${tile} [aria-label="Preview"]`).click();
    //   // cy.get(`.tile.${tile} h3`).contains(expected);

    //   // // Save
    //   // cy.get('#toolbar-save').click();

    //   // // View
    //   // if (Cypress.env('API') === 'plone') {
    //   //   cy.get('#page-document h3').should('have.text', expected);
    //   // } else {
    //   //   // guillotina
    //   //   cy.contains(expected);
    //   // }
    // });
  });
}
