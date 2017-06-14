import { AWSIoTDemoPage } from './app.po';

describe('aws-iot-demo App', () => {
  let page: AWSIoTDemoPage;

  beforeEach(() => {
    page = new AWSIoTDemoPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
