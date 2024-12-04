describe("Actualizar Proyecto", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Actualizar Proyecto", () => {
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
    cy.get("button").contains("¡Vamos allá!").should("be.visible").click();
    
    cy.get('button[name="Abrir Menu"]').should("be.visible").click();


    cy.contains("Editar").click();

    cy.get("form").within(() => {
      cy.get('button[type="submit"]')
        .contains("Actualizar")
        .should("be.visible")
        .click();
    });
  });
});
