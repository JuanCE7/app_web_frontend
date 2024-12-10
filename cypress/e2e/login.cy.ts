describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Debe ingresar al sistema con credenciales válidas", () => {
    cy.contains("Iniciar sesión").should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[name="email"]').should("be.visible").type("juan1@gmail.com");
      cy.get('input[name="password"]').should("be.visible").type("123456");
      cy.get('button[type="submit"]')
        .contains("Iniciar sesión")
        .should("be.visible")
        .click();
    });
  });
});
