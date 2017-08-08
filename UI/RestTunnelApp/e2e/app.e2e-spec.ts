import { RestTunnelAppPage } from './app.po';

describe('rest-tunnel-app App', () => {
  let page: RestTunnelAppPage;

  beforeEach(() => {
    page = new RestTunnelAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
