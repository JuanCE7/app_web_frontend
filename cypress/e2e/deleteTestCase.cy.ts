describe("Eliminar Caso de Prueba Funcional", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Eliminar Caso de Prueba Funcional", () => {
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
    cy.get(".items-center > a").should("be.visible").click();

    cy.get('button[name="Abrir Menu"]').eq(0).should("be.visible").click();
    cy.contains("Ir al detalle").click();
    cy.get('button[name="AbrirMenu"]').should("be.visible").click();
    cy.contains("Ir al detalle").click();

    cy.get('button[name="Open"]').eq(0).should("be.visible").click();

    cy.wait(2000);
    cy.contains("Eliminar", { timeout: 10000 })
      .eq(0)
      .should("be.visible")
      .click(); //
    cy.contains("Eliminar").eq(0).should("be.visible").click();
  });
});
