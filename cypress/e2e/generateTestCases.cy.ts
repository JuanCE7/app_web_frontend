describe("Generar Casos de Prueba Funcionales", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
    it("Generar casos de prueba funcionales", () => {
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
  
      cy.contains("Ir al detalle").click();

      cy.get('button[name="AbrirMenu"]').should("be.visible").click();
  
      cy.contains("Ir al detalle").click();

      cy.get("button").contains("Generar Casos de Prueba Funcionales").should("be.visible").click();
      
      cy.get("button").contains("Generar casos de prueba").should("be.visible").click();

      cy.wait(5000);

      cy.get("button").contains("Seleccionar").should("be.visible").click();
      
      cy.get("button").contains("Guardar casos de prueba seleccionados (1)").should("be.visible").click();

    });
  });
  