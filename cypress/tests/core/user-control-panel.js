describe('User Control Panel Test', () => {
  beforeEach(() => {
    // given a logged in editor
    // and a folder that contains a document
    // and the folder contents view
    cy.visit('/');
    cy.autologin();
  });
  it('Should add User to controlPanel', () => {
    cy.visit('/controlpanel/users');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');
    // when I added a user from controlPanel
    cy.get('Button[id="toolbar-add"]').click();
    cy.get('input[id="field-username"]').clear().type('iFlameing');
    cy.get('input[id="field-fullname"]').clear().type('Alok Kumar');
    cy.get('input[id ="field-email"]').clear().type('info@example.com');
    cy.get('input[id="field-password"]').clear().type('test@test');
    cy.get('button[title="Save"]').click(-50, -50, { force: true });

    // then the user section must contains a fullname when I searched the
    // same with the same username
    cy.get('input[id="user-search-input"]').clear().type('i');
    cy.get('.icon.button:first').click();
    cy.get('.fullname').should('have.text', 'Alok Kumar');
  });
  it('Should update group roles', () => {
    cy.visit('/controlpanel/groups');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');

    cy.get('[data-group="groups"] input[type="checkbox"')
      .first()
      .check({ force: true });
    cy.get('Button[id="toolbar-save"]').click();
    cy.reload();
    cy.get('[data-group="groups"] div.checkbox')
      .first()
      .should('have.class', 'checked');
  });
  it('Should update user roles', () => {
    cy.visit('/controlpanel/users');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');

    cy.get('[data-user="users"] input[type="checkbox"')
      .first()
      .check({ force: true });

    cy.get('Button[id="toolbar-save"]').click();

    cy.reload();

    cy.get('[data-user="users"] div.checkbox')
      .first()
      .should('have.class', 'checked');
  });
});
