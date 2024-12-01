const env = "dev";
const url = Cypress.env(env);
const postCategories = ["MAIN", "POSTS", "FEATURES"];
const subCategories = {
  "MAIN": ["Home"],
  "POSTS": ["JOBS", "CAREER", "COMPANIES", "SKILLS", "NEWS", "OTHER"],
  "FEATURES": ["Featured Content", "Trending"]
};

describe('Nav bar', () => {
  it('Renders correct navbar title text', () => {
    cy.visit(url);

    cy.get('[data-testid="nav-title"]')
      .should('exist');
    cy.get('[data-testid="nav-title"]')
      .should("exist")
      .should("have.text", "React Firebase Forum");
  })

  it('Renders sign in button', () => {
    cy.visit(url);

    cy.get('[data-testid="sign-in-button"]')
      .should('exist');
  })
})

describe('Home page', () => {
  it('Loads URL', () => {
    cy.visit(url);
  })

  it('Renders all the correct categories', () => {
    cy.visit(url);
    
    for (const category of postCategories) {
      cy.get('[data-testid="category-' + category + '"]')
        .should('exist');

      for (const subCategory of subCategories[category]) {
        cy.get('[data-testid="subcategory-' + subCategory + '"]')
      } 
    }
  })
})