// Minimal unit tests for welcomeAdminController
const {
  _validatePayload,
  _renderWelcomeAdminHtml,
  _renderWelcomeAdminText,
} = require("../welcomeAdminController");

describe("welcomeAdminController", () => {
  it("validates correct payload", () => {
    const payload = {
      email: "admin@org.com",
      user_name: "Admin Name",
      organization_name: "Org Name",
      password: "pass123",
      type: "welcome-admin",
    };
    expect(_validatePayload(payload)).toBeNull();
  });

  it("fails on missing fields", () => {
    const payload = { email: "x", type: "welcome-admin" };
    expect(_validatePayload(payload)).toMatch(/Missing required field/);
  });

  it("fails on unsupported type", () => {
    const payload = {
      email: "x",
      user_name: "y",
      organization_name: "z",
      password: "p",
      type: "other",
    };
    expect(_validatePayload(payload)).toMatch(/Unsupported type/);
  });

  it("renders HTML snapshot", () => {
    const html = _renderWelcomeAdminHtml({
      email: "admin@org.com",
      user_name: "Admin Name",
      organization_name: "Org Name",
      password: "pass123",
    });
    expect(html).toMatch(/Hi Admin Name, welcome to Atmosfair!/);
    expect(html).toMatch(/Temporary Password:.*pass123/);
    expect(html).toMatch(/Sign in to Atmosfair/);
    expect(html).toMatch(/#051B52/);
  });

  it("renders plain text", () => {
    const text = _renderWelcomeAdminText({
      email: "admin@org.com",
      user_name: "Admin Name",
      organization_name: "Org Name",
      password: "pass123",
    });
    expect(text).toMatch(/Hi Admin Name, welcome to Atmosfair!/);
    expect(text).toMatch(/Temporary Password: pass123/);
    expect(text).toMatch(/Sign in: \{\{LOGIN_URL\}\}/);
  });
});
