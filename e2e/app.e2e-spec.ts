import { VirtNgPage } from './app.po';

describe('virt-ng App', () => {
  let page: VirtNgPage;

  beforeEach(() => {
    page = new VirtNgPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
