describe("Unirse a Proyecto", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Unirse a Proyecto", () => {
    cy.contains("Iniciar sesión").should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[name="email"]').should("be.visible").type("juan1@gmail.com");
      cy.get('input[name="password"]').should("be.visible").type("123456");
      cy.get('button[type="submit"]')
        .contains("Iniciar sesión")
        .should("be.visible")
        .click();
    });
    cy.get("button").contains("¡Vamos allá!").should("be.visible").click();
    cy.get("button").contains("Ingresar a Proyecto").should("be.visible").click();
    cy.get('input[name="codeProject"]').should("be.visible").type("7b7b0e22");
    cy.get("button").contains("Unirme al Proyecto").should("be.visible").click();
    // cy.get('[y1="12"]').should("be.visible").click();   
  });
});