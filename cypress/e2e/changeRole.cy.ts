describe("Cambiar Rol", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Cambiar Rol de Usuario", () => {
    cy.contains("Iniciar sesión").should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[name="email"]')
        .should("be.visible")
        .type("juan1@gmail.com");
      cy.get('input[name="password"]').should("be.visible").type("123456");
      cy.get('button[type="submit"]')
        .contains("Iniciar sesión")
        .should("be.visible")
        .click();
    });
    cy.wait(1000);
    cy.get(".items-center > a").should("be.visible").click();
    cy.get('button[name="Abrir Menu"]').eq(0).should("be.visible").click();
    cy.contains("Cambiar Rol").click();
    cy.get('[role="combobox"]').should("be.visible").click(); 
    
    cy.get('[role="option"]').contains("Tester").click(); 
    cy.get('[role="combobox"]').should("contain", "Tester");
    cy.contains("Guardar").should("be.visible").click();
  });
});
