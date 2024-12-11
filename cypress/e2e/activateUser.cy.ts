describe("Activar Usuario", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
    it("Obtener Usuarios", () => {
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
      cy.get('.items-center > a').should("be.visible").click();
      cy.get('button[name="Abrir Menu"]').eq(0).should("be.visible").click();
      cy.contains("Activar").click();
      cy.contains("Activar").eq(0).should("be.visible").click();
    });
  });