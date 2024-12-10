describe("Unirse a Proyecto", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Unirse a Proyecto", () => {
    cy.contains("Iniciar sesión").should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[name="email"]')
        .should("be.visible")
        .type("juan.f.castillo.e@unl.edu.ec");
      cy.get('input[name="password"]').should("be.visible").type("123456");
      cy.get('button[type="submit"]')
        .contains("Iniciar sesión")
        .should("be.visible")
        .click();
    });
    cy.wait(1000);
    cy.get(".items-center > a").eq(0).should("be.visible").click();
    cy.get("button")
      .contains("Ingresar a Proyecto")
      .should("be.visible")
      .click();
    cy.get('input[name="codeProject"]').should("be.visible").type("7b7b0e22");
    cy.get("button")
      .contains("Unirme al Proyecto")
      .should("be.visible")
      .click();
    // cy.get('[y1="12"]').should("be.visible").click();
  });
});
