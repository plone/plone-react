if (Cypress.env('API') !== 'guillotina') {
  describe('Text Block ResolveUID Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.autologin();
      cy.createContent({
        contentType: 'Document',
        contentId: 'link-target',
        contentTitle: 'Link Target',
      });
      cy.createContent({
        contentType: 'Document',
        contentId: 'my-page',
        contentTitle: 'My Page',
      });
      cy.visit('/my-page/edit');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      // cy.waitForResourceToLoad('?fullobjects');
    });

    it('Internal link continues to work after moving the target around', function () {
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
      cy.get('.link-form-container button.icon').click();
      // chose "link target" in sidebar browser
      cy.get('aside span[title="/link-target (Document)"]').click();
      // close object browser sidebar
      cy.get('aside .close-object-browser').click();
      // close link modal
      cy.get('.link-form-container button.primary').click();
      // save page
      cy.get('#toolbar-save').click();

      // then
      cy.get('#view').contains('Colorless green ideas sleep furiously.');
      cy.get('#view a')
        .should('have.attr', 'href')
        .and('include', '/link-target');

      // follow the link
      cy.get('#view a').click();
      cy.url().should('include', '/link-target');

      // move content
      cy.createContent({
        contentType: 'Document',
        contentId: 'new-destination',
        contentTitle: 'New Destination',
      });
      cy.moveContent('link-target', 'new-destination');

      cy.visit('/new-destination/link-target');
      cy.visit('/my-page');
      cy.waitForResourceToLoad('@navigation');
      cy.waitForResourceToLoad('@breadcrumbs');
      cy.waitForResourceToLoad('@actions');
      cy.waitForResourceToLoad('@types');
      cy.waitForResourceToLoad('?fullobjects');

      // link should point to new location
      cy.get('#view a')
        .should('have.attr', 'href')
        .and('include', '/new-destination/link-target');

      // follow the link
      cy.get('#view a').click();
      cy.url().should('include', '/new-destination/link-target');
    });

    it('Embedded image continues to work after moving the image to another location', function () {
      // given a page with an image
      // when I move the image to a new location
      // then the page will use the new image location
    });
    // it('Internal link continues to work after renaming the link target', function() {
    //   // given: target document + page with a text block
    //   cy.wait(2000);
    //   cy.get('.documentFirstHeading > .public-DraftStyleDefault-block');

    //   // when: add an internal link
    //   cy.get('.block.inner.text .public-DraftEditor-content')
    //     .type('Colorless green ideas sleep furiously.')
    //     .setSelection('furiously');
    //   cy.get(
    //     '#page-edit .draftJsToolbar__buttonWrapper__1Dmqh:nth-of-type(3)',
    //   ).click();
    //   cy.get('.link-form-container input').type('Link Target');
    //   cy.get('.link-form-container button')
    //     .contains('Link Target')
    //     .click();
    //   cy.get('#toolbar-save').click();

    //   // make sure internal link is in edit view
    //   cy.get('#view').contains('Colorless green ideas sleep furiously.');
    //   cy.get('#view a')
    //     .should('have.attr', 'href')
    //     .and('include', '/link-target');

    //   // make sure we can follow the link
    //   cy.get('#view a').click();
    //   cy.url().should('include', '/link-target');

    //   // rename content
    //   cy.visit('/link-target/edit');
    //   cy.waitForResourceToLoad('@navigation');
    //   cy.waitForResourceToLoad('@breadcrumbs');
    //   cy.waitForResourceToLoad('@actions');
    //   cy.waitForResourceToLoad('@types');
    //   cy.waitForResourceToLoad('?fullobjects');
    //   cy.get('input#field-id')
    //     .clear()
    //     .type('new-link-target');
    //   cy.get('#toolbar-save').click();
    //   // cy.url().should('include', '/new-link-target');

    //   // re-visit page
    //   cy.visit('/my-page');
    //   cy.waitForResourceToLoad('@navigation');
    //   cy.waitForResourceToLoad('@breadcrumbs');
    //   cy.waitForResourceToLoad('@actions');
    //   cy.waitForResourceToLoad('@types');
    //   cy.waitForResourceToLoad('?fullobjects');

    //   // link should point to new location
    //   cy.get('#view a')
    //     .should('have.attr', 'href')
    //     .and('include', '/new-link-target');

    //   // follow the link
    //   cy.get('#view a').click();
    //   cy.url().should('include', '/new-link-target');
    // });
  });

  // Low level command reused by `setSelection` and low level command `setCursor`
  Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
    cy.wrap(subject).trigger('mousedown').then(fn).trigger('mouseup');

    cy.document().trigger('selectionchange');
    return cy.wrap(subject);
  });

  Cypress.Commands.add(
    'setSelection',
    { prevSubject: true },
    (subject, query, endQuery) => {
      return cy.wrap(subject).selection(($el) => {
        if (typeof query === 'string') {
          const anchorNode = getTextNode($el[0], query);
          const focusNode = endQuery
            ? getTextNode($el[0], endQuery)
            : anchorNode;
          const anchorOffset = anchorNode.wholeText.indexOf(query);
          const focusOffset = endQuery
            ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
            : anchorOffset + query.length;
          setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        } else if (typeof query === 'object') {
          const el = $el[0];
          const anchorNode = getTextNode(el.querySelector(query.anchorQuery));
          const anchorOffset = query.anchorOffset || 0;
          const focusNode = query.focusQuery
            ? getTextNode(el.querySelector(query.focusQuery))
            : anchorNode;
          const focusOffset = query.focusOffset || 0;
          setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        }
      });
    },
  );

  // Low level command reused by `setCursorBefore` and `setCursorAfter`, equal to `setCursorAfter`
  Cypress.Commands.add(
    'setCursor',
    { prevSubject: true },
    (subject, query, atStart) => {
      return cy.wrap(subject).selection(($el) => {
        const node = getTextNode($el[0], query);
        const offset =
          node.wholeText.indexOf(query) + (atStart ? 0 : query.length);
        const document = node.ownerDocument;
        document.getSelection().removeAllRanges();
        document.getSelection().collapse(node, offset);
      });
      // Depending on what you're testing, you may need to chain a `.click()` here to ensure
      // further commands are picked up by whatever you're testing (this was required for Slate, for example).
    },
  );

  Cypress.Commands.add(
    'setCursorBefore',
    { prevSubject: true },
    (subject, query) => {
      cy.wrap(subject).setCursor(query, true);
    },
  );

  Cypress.Commands.add(
    'setCursorAfter',
    { prevSubject: true },
    (subject, query) => {
      cy.wrap(subject).setCursor(query);
    },
  );

  // Helper functions
  function getTextNode(el, match) {
    const walk = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );
    if (!match) {
      return walk.nextNode();
    }

    let node;
    while ((node = walk.nextNode())) {
      if (node.wholeText.includes(match)) {
        return node;
      }
    }
  }

  function setBaseAndExtent(...args) {
    const document = args[0].ownerDocument;
    document.getSelection().removeAllRanges();
    document.getSelection().setBaseAndExtent(...args);
  }
}
