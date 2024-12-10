describe("Eliminar Proyecto", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Eliminar Proyecto", () => {
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
    cy.wait(1000)
    cy.get('.items-center > a').should("be.visible").click();

    cy.get('button[name="Abrir Menu"]').eq(0).should("be.visible").click();

    cy.contains("Eliminar").click();
    cy.contains("Eliminar").click();
  });
});
