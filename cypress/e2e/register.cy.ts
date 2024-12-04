describe("Registro", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

it('Registrarse con credenciales válidas', () => {
    cy.contains('Regístrate').click();
    cy.get('form').within(() => {
      cy.get('input[name="firstName"]').should('be.visible').type("Juan ");
      cy.get('input[name="lastName"]').should('be.visible').type("Castillo");
      cy.get('input[name="email"]').should('be.visible').type("juan1@gmail.com");
      cy.get('input[name="password"]').should('be.visible').type("123456");
      cy.get('input[name="confirmPassword"]').should('be.visible').type("123456");
      cy.get('button[type="submit"]')
        .contains("Registro")
        .should("be.visible")
        .click();
    });
  });
});