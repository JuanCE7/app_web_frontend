describe("Crear Proyecto", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Crear Proyecto con datos válidos", () => {
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
    cy.get("button").contains("Crear Proyecto").should("be.visible").click();
    cy.get("form").within(() => {
      cy.get('input[name="name"]')
        .should("be.visible")
        .type("Test de Proyecto");
      cy.get('textarea[name="description"]')
        .should("be.visible")
        .type("test de test");
      cy.get('button[type="submit"]')
        .contains("Crear")
        .should("be.visible")
        .click();
    });
  });
});
