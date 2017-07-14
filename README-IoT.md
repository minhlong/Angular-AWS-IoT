Demo: [https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT](https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT)

Username: demo | Password: 123456789

**Lưu ý:** 
- Source code được build trên Angular 2 ... sau khi deploy thì chỉ còn là html + javscript nên bạn có thể host lên bất cứ đâu
- Trong bài này mình có nói về thiết bị phần cứng. Bạn đừng quá bận tâm vì mình đã làm thiết bị giả lập (Emulator) trong bài này

![ScreenShot](/screeenshot.png?raw=true)

# Đặt Vấn Đề
Mình mới làm xong 1 thiết bị đèn thông minh, thiết bị này có thể:
- Kết nối với Internet để lấy thông tin từ người dùng để hiển thị màu, bật/tắt...
- Thiết bị này có thể điều chỉnh được 3 màu (Red, Green, Blue)

Mình muốn xây dựng một hệ thống để liên kết người dùng với thiết bị của mình gồm những chức năng sau:
- Internet - Có thể điều khiển thiết bị của mình ở bất cứ đâu, miễn là có internet
- Realtime - Khi mình click 1 cái là đèn của mình phải sáng ngay lập tức, không chờ quá lâu (tầm 3s trở lại)
- Security - Tính bảo mật cao để người khác không thể hack thiết bị của mình
- User - Role/Permission - Mình có thể tạo người dùng, phân quyền để người thân của mình có thể dùng 1 số thiết bị
- Detect Connect/Disconnect - Khi thiết bị của mình bị ngắt kết nối, hệ thống của mình sẽ báo cho người dùng biết
- ...

Thay vì phải tốn rất nhiều chi phí chỉ để thử nghiệm thiết bị của bạn... Các bạn có thể chỉ mất chưa tới 5$ để làm điều đó ... hay nói cách khác... có thể là miễn phí (Free) hoàn toàn với `Amazone Web Services - Internet of Things (AWS IoT)`. Còn về performance và security thì khỏi phải bận tâm bạn nhé ;) 

# Giải Pháp

![bulb](/readme/aws-iot-bulb.jpg)

Process làm việc là như sau: 

- Phía người dùng

  1. User vào trang web http://your-site.com  (S3)
  2. Trang web yêu cầu thông tin đăng nhập. Người dùng nhập rồi nhấn nút Đăng Nhập
  3. Trang web gởi yêu cầu đến server (Cognito) để xác thực người dùng thông qua API `AWS-SDK`. Nếu đúng sẽ hiện ra trang chủ để người dùng thao tác, nếu sai thì hiện lỗi để người dùng điền lại thông tin đăng nhập và đăng nhập lại
  4. Sau khi người dùng vào trang chủ, họ có thể điều khiển thiết bị dựa trên giao diện trên trang chủ.
  5. Khi người dùng thao tác, trang web sẽ dùng các API `AWS-SDK` mà AWS cung cấp để thao tác với các dịch vụ (IoT)

- Phía thiết bị

  1. Thiết bị kết nối đến AWS-IoT (Websocket - MQTT). Nói đơn giản vậy thôi chứ bên trong còn phải tạo Certificate. Xác thực thiết bị ...v.v... để nhằm bảo mật.
  2. Thiết bị lắng nghe sự kiện từ IoT
  3. Khi có sự kiện cập nhật thông tin thì thiết bị sẽ biết ngay lập tức, sau đó cập nhật thông tin lên thiết bị
  4. Sau khi thiết bị cập nhật xong thì phản hồi trạng thái hiện tại của thiết bị đến IoT và tiếp tục ngồi lắng nghe...

> Bắt đầu thôi, trước tiên là mình phải tạo 1 trang web (http://your-site.com) cho người dùng vào đây để điều khiển thiết bị. Không cần công phu đâu ... chỉ HTML + Javascript là đủ :D Mình không đi sâu vào host web ra sao, html là gì ...v.v... các bạn google nhé ... Nhưng sẵn tiện mình muốn giới thiệu dịch vụ `AWS - Simple Storage Service`

## `Amazon Web Serivces - Simple Storage Service (AWS S3)`

![AWS-S3](http://www.vmtocloud.com/wp-content/uploads/2017/04/S3.jpeg)

Cái tên đã nói lên tất cả. Các bạn có thể dùng S3 để lưu trữ tất cả mọi thứ tập tin trên đời.
- Mình sẽ có một bài khác viết sâu hơn về S3
- Ngoài ra dịch vụ này còn cho phép bạn host các trang web tĩnh với các domain name miễn phí để các bạn test web tĩnh 
- ***Chú ý:** Các bạn đừng nhầm tưởng nó giống với Google-Drive/Dropbox ... vì AWS cũng có `Amazone-Drive`. Còn `AWS S3` thì thiên về Service cho business hơn (trong khi Amazone-Drive thì thiên về personal) - [Link tham khảo ở đây](https://www.cloudberrylab.com/blog/amazon-cloud-drive-vs-amazon-s3-where-the-crucial-backup-data-goes/)

> Nhưng ngoài việc xây dựng ứng dụng cho người dùng thì mình còn phải xây dựng luôn cả phần quản lý thông tin người dùng để người dùng họ vào website của mình rồi họ đăng nhập (authenticate)... Mình phải cần đến nào là server, database ... để quản lý chăng ? Xin thưa không - `Amazon Web Serivces - Cognito` sẽ làm điều đó cho bạn

## `Amazon Web Serivces - Cognito (AWS Cognito)`

![Cognito-Syn](http://www.i-programmer.info/images/stories/News/2014/Jul/A/awscognito.jpg)

Bài này mình đã viết rồi, các bạn tham khảo thêm link này nhé - [Link tham khảo ở đây](https://github.com/minhlong/Angular4-AWS-Cognito-IAM-API-Lambda-IoT/wiki/AWS-Cognito)

- Xây dựng cơ chế authenticate bảo mật
- Cơ chế confirm authenticate phải chính xác (sms, email,...)
- Có thể authenticate với các Identity Provider khác như facebook, google...
- Có thể phân quyền được cho các user, tổi thiểu là quyền mặc định sau khi - authenticate
- Các thiết bị của người dùng phải được đồng bộ dữ liệu sau khi login
- ...
(https://github.com/minhlong/Angular4-AWS-Cognito-IAM-API-Lambda-IoT/wiki/AWS-Cognito)

> Sau khi người dùng đăng nhập thành công, website sẽ dùng các API `AWS SDK` để giao tiếp với dịch IoT. Ví dụ: Đoạn mã bên dưới viết trên javascript bằng typescript để lấy trạng thái của thiết bị (thingName)

```javascript
  /**
   * Get thing shadow
   * @param thingName thing name
   */
  getShadow(iotData: IotData, thingName): Observable<IotData.GetThingShadowResponse> {
    const sub$ = new Subject<any>();

    iotData.getThingShadow({ thingName: thingName }, (err, dta) => {
      if (err) { consoleLog(err); sub$.error(err); return; }

      sub$.next(dta); sub$.complete();
    })

    return sub$;
  }

```

## `Amazon Web Serivces - Internet of Thing (AWS IoT)`

![AWS - IoT](https://camo.githubusercontent.com/5ea31eefb7a82a29acaf26c6a88dcdeb6ed1e31d/68747470733a2f2f64302e6177737374617469632e636f6d2f496f542f6173736574732f617773696f745f686f775f69745f776f726b735f6469616772616d2e706e67)

Khi bắt đầu với IoT, mình rất rối vì AWS IoT có rất nhiều khái niệm. Nhưng sau khi nắm hết thì mới thấy mọi thứ thật sự cần thiết và được tính toán rất chi li

### Thing
Thing đại diện cho thiết bị của bạn. Đây sẽ nơi mà trạng thái (state) của thiết bị được lưu trữ (`Thing Shadow`), ngoài ra các bạn còn có thể set cho nó các attribute mà bạn muốn nữa. Mỗi Thing sẽ được gắn với 1 hoặc nhiều `Certificate` và `Rule`

![AWS - IoT Thing](https://cdn2.hubspot.net/hubfs/2346564/Imported_Blog_Media/Roomy4.png?t=1498286699113)

### Thing Shadow
Sau khi tạo Thing, mặc định mỗi Thing sẽ có một Thing-Shadow. Nó giống như 1 mini database của từng thing mà bạn muốn update gì cũng được dựa vào kiểu json 

![AWS - IoT Thing Shadow](https://www.mendix.com/wp-content/uploads/Picture4.png)

Nhưng thường thì theo cấu trúc sau. Vì sao ư ? Vì IoT sẽ detect giúp bạn xem các trạng thái có đồng bộ với nhau chưa (Synchronize), về việc đồng bộ thì có rất nhiều vấn đề để nói. Các bạn tham khảo trên AWS Document nhé

```json
{
  "state": {
    "desired": {
      "color": "red"
      ...
    },
    "reported": {
      "color": "green"
      ...
    }
  }
}
```

- `desired` là phần giành cho người dùng cập nhật những thứ mình muốn
- `reported` là phần giành cho thiết bị để cập nhật trạng thái hiện tại của thiết bị
- **Chú ý:** Đôi khi thiết bị cần phải update state của mình vào `desired` chứ không nhất thiết là reported đâu nhé :) Cái đó là do process của từng hệ thống mỗi người

### Certificate
Certificate là nơi sẽ quản lý các giấy phép chứng thực (các file *.crt). Bạn có 1 thiết bị, thiết bị của bạn cần phải dùng certificate này cùng với SDK để connect đến Thing Shadow thông qua MQTT/RestFul. Một Certificate sẽ liên kết với một hoặc nhiều Thing/Policy cho phép bạn tùy chỉnh thao tác, cũng như phân quyền dựa vào policy.

![AWS - IoT Certificates](http://docs.aws.amazon.com/iot/latest/developerguide/images/certificate-created.png)

### Policy
Policy là nơi set các permission của thing, ví dụ như Client A chỉ có thể cập nhật các Thing Shadow của Client A... Vì thế, mỗi Cirtificate đều phải được đính kèm (attach) với ít nhất 1 policy

![AWS - IoT Policy](http://docs.aws.amazon.com/iot/latest/developerguide/images/iot-connect-policy.png)

Về cơ bản thì client sẽ connect với IoT thông qua MQTT socket với các channel (topic). Ví dụ:
- Client kết nối đến IoT
- Client public message `null` đến topic `$aws/things/your-thing-name/shadow/get` để lấy trạng thái hiện tại
- Client public message `'{state:...}'` đến topic `$aws/things/your-thing-name/shadow/update` để cập nhật trạng thái
- ... 

Khi chúng ta (client/user) thao tác như thế thì IoT sẽ làm một thao tác ngầm bên dưới là kiểm tra xem kết nối được phép và không được phép dựa trên các policy đã định nghĩa trước. Các cerificate/pricipal nào được attach với policy bên dưới thì chỉ có thể `kết nối (connect)` và cập nhật shadow cho topic `arn:aws:iot:us-east-1:123456789012:topic/foo/bar`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish"
      ],
      "Resource": [
        "arn:aws:iot:us-east-1:123456789012:topic/foo/bar"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```
**Lưu ý:** Sẽ có 2 thứ được attach với Policy.

1. Các thiết bị, mình sẽ dùng certificate tạo ra để attach đến Policy (Có thể thao tác bằng giao diện console hoặc aws command line - aws cli )
1. Các người dùng từ Cognito, mình sẽ dùng Identity ID tạo ra để attach đến Policy (**Chưa thể** thao tác bằng giao diện console. Và **CHỈ CÓ THỂ THAO TÁC BẰNG AWS CLI**)

Policy của IoT có cú pháp giống với `AWS IAM`, và có thể thiên biến vạn hóa rất nhiều như bộ lọc `filter` hoặc các điều kiện truy vấn `condition` phù hợp. Và đến giờ thì mình chưa gặp điều gì mà AWS IoT chưa thể giải quyết. Các bạn nên xem qua document nhé

### Rule - Các Quy Tắc ... last will and testimony

Rule là nơi bạn định nghĩa các quy tắc xử lý dữ liệu. Ví dụ khi người dùng click vào thiết bị, mình muốn gởi email tới mình (AWS IoT Button example). Lúc này mình cần định nghĩa Rule cho Thing, để mỗi khi click vào mình sẽ lọc ra các sự kiện (select from where) và dùng các service khác để xử lý như Lambda và SNS để gởi mail/message

Một tiện ích của Rule rất hay đó là nó cho phép mình viết `Bản Di Chúc` (testimony) cho thiết bị. Ngộ nhỉ ? Mình muốn khi mình ngắt kết nối thì IoT sẽ tự động cập nhật shadow về một trạng thái nào đó. Mình sẽ cấu hình cho kết nối MQTT sao cho khi IoT không còn thấy kết nối của client nữa, thì IoT sẽ tự publish một message  `'{state:...}'` đến topic `Disconnect/thingNameClientA` mà mình định nghĩa sẵn

```javascript
  // Config MQTT connection
      _socketURL = _url;
      this.dvClient = mqtt.connect(_socketURL, {
        will: {
          // Registry channel for this connect
          topic: 'Disconnect/' + this.thingName,
          payload: JSON.stringify({ state: { reported: { connected: false } } }),
          qos: 0,
          retain: false
        },
        ...
```

Để IoT có thể làm việc trên, mình chỉ việc định nghĩa Rule cho topic `Disconnect/thingNameClientA` để xử lý các thông tin cho bản di chúc nữa là xong. Ví dụ:

![AWS - IoT Rule](/readme/iot-rule.png)

**Lưu ý:** Để hiểu rõ hơn phần này, các bạn cần tham khảo về MQTT, các tham số cấu hình MQTT và AWS Document nữa nhé.

# Kết
Khi mới bắt đầu với AWS IoT, mọi thứ tưởng chừng phức tạp, nhưng khi tìm hiểu rõ bạn sẽ thấy nó rất đơn giản. Chỉ cần bỏ chút thời gian để cấu hình và vẽ working process cho hệ thống. AWS IoT hỗ trợ rule và policy rất mạnh. Hầu như có thể cover được mọi tình huống cho người dùng về mặt bảo mật và phân quyền...

![ScreenShot](/screeenshot.png?raw=true)

# Tài Liệu Tham Khảo
- http://docs.aws.amazon.com