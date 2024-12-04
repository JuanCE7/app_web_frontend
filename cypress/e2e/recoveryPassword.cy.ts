describe("Recuperar Contraseña", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

it('Recuperar Contraseña', () => {
    cy.contains('Olvidé mi contraseña').click();
    cy.get('form').within(() => {
      cy.get('input[name="emailOTP"]').should('be.visible').type("juan.f.castillo.e@unl.edu.ec");
      cy.get('button[type="submit"]')
        .contains("Enviar correo de recuperación")
        .should("be.visible")
        .click();
    });
  });
});