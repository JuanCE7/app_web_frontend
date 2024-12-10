describe("Crear Caso de uso", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Crear caso de uso", () => {
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

    cy.contains("Ir al detalle").click();
    cy.get("button").contains("Crear Caso de Uso").should("be.visible").click();
    cy.get("form").within(() => {
      cy.get('input[name="code"]').should("be.visible").type("UC01");
      cy.get('textarea[name="name"]')
        .should("be.visible")
        .type("Test de Proyecto");
      cy.get('textarea[name="description"]')
        .should("be.visible")
        .type("test de test");
      cy.get('[data-testid="preconditions"]')
        .should("be.visible")
        .type("Precondiciones de prueba");
      cy.get('[data-testid="postconditions"]')
        .should("be.visible")
        .type("Postcondiciones de prueba");
      cy.get('[data-testid="mainFlow"]')
        .should("be.visible")
        .type("MainFlow de prueba");
      cy.get('[data-testid="alternateFlows"]')
        .should("be.visible")
        .type("AlternateFlows de prueba");
      
      cy.get('button[type="submit"]')
        .contains("Crear")
        .should("be.visible")
        .click();
    });
  });
});
