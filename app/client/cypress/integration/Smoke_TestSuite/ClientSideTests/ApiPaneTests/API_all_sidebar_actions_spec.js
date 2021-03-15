const commonlocators = require("../../../../locators/commonlocators.json");

describe("API Panel Test Functionality ", function() {
  it("Test API copy/Move/delete feature", function() {
    cy.log("Login Successful");
    cy.NavigateToAPI_Panel();
    cy.log("Navigation to API Panel screen successful");
    cy.CreateAPI("FirstAPI");
    cy.log("Creation of FirstAPI Action successful");
    cy.collapseAllEntities();
    cy.ExpandAction("FirstAPI");
    // cy.ExpandAllExplorerEntities();
    cy.get(`.t--entity.action:contains(FirstAPI)`)
      .last()
      .ShowExplorerContextMenu();

    cy.get(`.t--entity.action:contains(FirstAPI)`)
      .last()
      .CopyAPIToHome();
    // cy.GlobalSearchEntity("FirstAPI");
    // cy.xpath('//*[local-name()="g" and @id="Icon/Outline/more-vertical"]')
    //   .last()
    //   .should("be.hidden")
    //   .invoke("show")
    //   .click({ force: true });
    // cy.CopyAPIToHome();
    // cy.ExpandAllExplorerEntities();
    cy.ExpandAction("FirstAPICopy");
    // cy.GlobalSearchEntity("FirstAPICopy");
    cy.get(`.t--entity.action:contains(FirstAPI)`)
      .last()
      .DeleteAPIFromSideBar();
  });
});
