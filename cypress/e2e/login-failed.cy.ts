describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("Debe ingresar al sistema con credenciales inválidas", () => {
    cy.get('input[name="email"]').type("invalid@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').contains("Iniciar sesión").click();

  });
});
