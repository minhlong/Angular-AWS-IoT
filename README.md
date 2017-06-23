Source Code: [https://github.com/minhlong/Angular4-AWS-Cognito-IAM-API-Lambda-IoT](https://github.com/minhlong/Angular4-AWS-Cognito-IAM-API-Lambda-IoT)

Demo: [https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT](https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT)

Username: demo | Password: 123456789

![ScreenShot](https://github.com/minhlong/Angular4-AWS-Cognito-IAM-API-Lambda-IoT/raw/master/screeenshot.png)

# Bài Toán

Mình đang làm dự án về `IoT (Internet of ThingS)`, công ty hiện đã làm xong thiết bị và bây giờ họ muốn xây dựng một hệ thống để quản-lý/sử-dụng thiết bị đó. Nhưng nếu phải xây dựng từ đầu thì mất rất nhiều chi phí... Nào là máy chủ, lập trình viên, chi phí bảo trì... Và có một giải pháp lúc này là sử dụng `Amazon Web Services (AWS)`

![Frontend-AWS](https://camo.githubusercontent.com/793681e54a8c3ebdaac694bcba8eb56e1a9f7d22/68747470733a2f2f6432393038713031766f6d7162322e636c6f756466726f6e742e6e65742f316236343533383932343733613436376430373337326434356562303561626332303331363437612f323031372f30362f30372f696d6167653030392e706e67)

Về cơ bản, với AWS bạn không cần phải bận tâm quá nhiều về các hệ thống, thay vào đó bạn chỉ cần tập trung vào "business" của bạn và lo kiếm thật nhiều tiền ... để trả cho AWS :D với chi phí tương đối mềm.

Bài viết này mình không phải "PR" cho AWS nhưng là để thao tác những dịch vụ căn bản, và cảm nhận của mình về AWS trong những ngày tìm hiểu vừa qua

# AWS Rất Đa Dạng - Rất Trâu - Rất Biết Cách Moi Tiền

Mình xây dựng một ứng dụng nhỏ `(Angular 4)` để thao tác "trực tiếp" với AWS thông qua `AWS SDK`

### AWS SDK
> `AWS SDK` là một bộ thư viện được viết dưới rất nhiều ngôn ngữ (PHP, Javascript[Node & Browser], ...) để hỗ trợ dev thao tác với các dịch vụ của AWS (Cognito, API, IAM...)

Về phần đăng nhập, mình không cần phải tạo database, rồi nào là viết process cho authenticate, rồi nào là bảo mật như JWT, SSL... Rồi nào là đồng bộ dữ liệu... Thay vào đó, AMS cung cấp dịch vụ `AWS Cognito` để giúp ta thao tác

### AWS Cognito
![Frontend-AWS](https://image.slidesharecdn.com/awsjune2016webinarseries-gettingstartedwithyouruserpoolsinamazoncognito-160701191827/95/getting-started-with-your-user-pools-in-amazon-cognito-aws-june-2016-webinar-series-14-638.jpg?cb=1467400953)

> `AWS Cognito` sẽ giúp bạn authenticate và đồng bộ dữ liệu. Nó cung cấp 2 dịch vụ "Federate" và "User Pool"
> - `AWS Cognito Federate` cho phép bạn cấu hình để bạn có thể đăng nhập qua dịch vụ khác (Authenticate Provider) như Facebook, Google... hoặc của chính bạn. Thêm vào đó nó cũng cho phép bạn authenticate qua cấu hình của bạn ngay trên AWS thông qua `AWS Cognito User Pool`
> - `AWS Cognito User Pool` cho phép cấu hình thông tin đăng nhập (attribute) như Email, Password, Phone... Password Rule cho phép bạn tùy chỉnh như chiều dài tối thiểu, phải có kí tự đặc biệt... Verification cho phép bạn xác thực thông tin người dùng (đăng ký) thông qua Email, SMS (Phone)... với các template có thể customize được... Và còn nhiều thứ khác nữa như tạo nhóm...
> - **Lưu ý**: AWS Cognito được biết đến với thế mạnh đồng bộ dữ liệu. Nhưng trong ứng dụng của mình chưa cần đến nên mình không đi sâu vào phần này

Vậy xem như phần đăng nhập, tạo tài khoản, xác thực, đổi mật khẩu... của mình đã xong với Cognito (Back-end). Tiếp đến là mình muốn phân quyền để thao tác với hệ thống thì sao ? AWS cung cấp dịch vụ `IAM (Identity and Access Management)` để làm điều này

### AWS IAM
![IAM](http://docs.aws.amazon.com/IAM/latest/UserGuide/images/mobile-app-web-identity-federation.diagram.png)

> `AWS IAM` là nơi để quản lý user/tài-khoản làm việc của AWS. Cho phép bạn "Thêm-Xóa-Sửa" user/group...
> - AWS IAM khác với AWS Cognito User Pool nhé. Tuy cả 2 đều có khả năng tạo user, nhưng bạn hiểu nôm na là user của IAM là để quản-lý/dùng/cấu-hình các dịch vụ của AWS. Còn user của Cognito giống như end-user để sử dụng thao tác với hệ-thống/service mà business của bạn cung cấp
> - `AWS IAM User` cho phép bạn tạo user, tại đây bạn sẽ gặp khái niệm "Credential" (nó giống như token/Chứng-Minh-Thư vậy), đây là một cặp chuỗi. Hệ thống của bạn có thể dùng SDK với credential này thao tác với AWS như chính bạn đang login vào AWS thao tác với các services. (Một User sẽ có nhiều policy, group)
> - `AWS IAM Group` cho phép bạn tạo Group cho các user. (Một Group sẽ có nhiều policy)
> - `AWS IAM Policy` giống như Permission vậy, đây là nơi định nghĩa các policy để bạn quyền thao tác với các dịch vụ khác như IoT, API, S3...
> - `AWS IAM Roles` sẽ bao gồm nhiều Policy, nó được sử dụng rất nhiều trong AWS. Ví dụ bạn có 1 function viết chung, bạn muốn function đó chỉ có quyền thao tác 1 số bảng trên db. Bạn có thể dùng Role để cấu hình... và cái function bạn có thể dùng Lambda (mình sẽ đề cập sau)
> - **Lưu ý**: AWS IAM rất rộng, nên mình không thể đề cập hết được, mình chỉ note lên những điều cơ bản mà mình biết để mọi người có khái niệm sơ về nó

Vậy là mình đã xong với phần authenticate và permission của Back-end. Bây giờ là lúc mình cần xây dựng một bộ API để ứng dụng của mình có thao tác và lấy/cập-nhật thông tin cần thiết. Đó là lúc ta cần sử dụng bộ đôi `AWS API Gateway` và `AWS Lambda`

### AWS API Gateway
![AWS API Gateway - AWS Lambda](https://www.xpeppers.com/wp-content/uploads/2015/07/SchemaLogico.jpg)

> `AWS API Gateway` là nơi cho phép bạn định nghĩa các API của hệ thống back-end. Ví dụ: Mình muốn xây dựng các API để thao-tác/quản-lý dữ liệu với Book
>> URL - http://longdeptrai.com/book
>> - Method **GET**: **Không cần phải đăng nhập** - Khi có request đến đường dẫn trên với method này thì hãy trỏ đến function lamdba_function_get_list_book trong `AWS Lambda Service` để xử lý
>> - Method **POST** http://longdeptrai.com/book/{bookID}: **bắt buộc phải đăng nhập** - Khi có request đến đường dẫn trên với method này thì hãy trỏ đến function lamdba_function_post_book trong `AWS Lambda Service` để xử lý với tham số *bookID* 
> - Bên cạnh đó dịch vụ còn cho phép bạn định nghĩa các `Authentication`, các API nào ready để `deploy` với các stage khác nhau
> - **Lưu ý**: Bạn không nhất thiết phải connect các API đến `Lambda service` đâu nhé

### AWS Lambda
> `AWS Lambda` là nơi mà bạn có thể upload code của mình lên, và dịch vụ AWS Lambda sẽ giúp bạn chạy đoạn code đó bằng việc sử dụng các tài nguyên sẵn có của AWS. Bạn không cần phải bận tâm đến ngôn ngữ code, cũng như môi trường...
> - `Code`: Bạn có thể cấu hình biến môi trường... để function của bạn xử lý. Ngoài ra, bạn còn có thể connect đến các dịch vụ khác nữa (Coding mà) như `DynamoDB`, `SNS`...
> - `Configuration`: Bạn có thể cấu hình ngôn ngữ, role... cho function của mình
> - `Trigger`: Function của bạn được gọi khi có sự kiện gọi đến từ các service như API, IoT, SNS...
> - `Monitoring`: Theo dõi trạng thái hoạt động function của bạn
> - **Lưu ý**: Để tiện cho việc dev, bạn có thể tìm hiểu về [serverless.com](serverless.com)

> **Lưu Ý**: Tôi có thể xây dựng một hệ thống Back-end API hùng mạnh dựa vào mô hình API-Lambda này không ? Quan điểm cá nhân của mình thì là "KHÔNG NÊN". Theo mình biết đây là mô hình "Serverlesss", nó chỉ giúp bạn thao tác những vấn để nhỏ, chạy độc lập, không có quá nhiều các ràng buộc quan hệ giữa các API/tài-nguyên với nhau. Đơn cử, nếu mình viết 1 back-end, bạn có các lớp service provider, model... để giúp bạn thao tác chuyên biệt và hiệu quả hơn. Trong khi bạn phải viết các functions như lamdba từ A-Z.

Đến đây thì ứng dụng nhỏ của mình coi như hoàn thiện. Nhưng từ lúc ban đầu mình có đề cập, đây là hệ tống IoT ... do đó phần API + Lambda này mình chỉ lấy những thông tin căn bản như locations, map... Và để quản lý thiết bị, thao tác với thiết bị thì mình cũng không phải xây dựng 1 Broker hoàng tráng đâu. `AMW IoT` đã có sẵn rồi và nó sẽ làm điều đó thay bạn

![Frontend-AWS](https://camo.githubusercontent.com/793681e54a8c3ebdaac694bcba8eb56e1a9f7d22/68747470733a2f2f6432393038713031766f6d7162322e636c6f756466726f6e742e6e65742f316236343533383932343733613436376430373337326434356562303561626332303331363437612f323031372f30362f30372f696d6167653030392e706e67)

### AWS IoT
![IoT](https://d0.awsstatic.com/IoT/assets/awsiot_how_it_works_diagram.png)

> `AWS IoT`
> - `Thing`giống như đại diện cho thiết bị của bạn vậy. Đây sẽ nơi mà state của thiết bị được lưu trữ (Thing Shadow), ngoài ra các bạn còn có thể set cho nó các attribute mà bạn muốn nữa. Mỗi Thing sẽ được gắn với 1 hoặc nhiều Certificate và Rule
> - `Certificates` là nơi sẽ quản lý các giấy phép chứng thực (các file *.crt). Bạn có 1 thiết bị, thiết bị của bạn cần phải dùng certificate này cùng với SDK để connect đến Thing Shadow thông qua MQTT/RestFul. Một Certificate sẽ liên kết với một hoặc nhiều Thing/Policy cho phép bạn tùy chỉnh thao tác, cũng như phân quyền dựa vào policy.
> - `Policy` là nơi set các permission của thing, ví dụ như Client A chỉ có thể cập nhật các Thing của CLientA...
> - `Rule` là nơi bạn định nghĩa các quy tắc xử lý dữ liệu. Ví dụ khi người dùng click vào thiết bị, mình muốn gởi email tới mình (AWS IoT Button example). Lúc này mình cần định nghĩa Rule cho Thing, để mỗi khi click vào mình sẽ lọc ra các sự kiện (select from where) và dùng các service khác để xử lý như Lambda và SNS để gởi mail/message
> - **Lưu ý**: AWS IoT có rất nhiều để đề cập, nhất là cách cấu hình. Mình chỉ đề cập một số thứ chính thôi nhé. Nếu có thời gian mình sẽ viết thêm về 1 chuỗi bài này


Bài viết này mình sẽ dừng lại ở việc giới thiệu các service, còn về việc cấu hình và viết code, nếu có thể mình sẽ viết ở 1 bài khác. Và như bạn thấy đấy, AWS có rất nhiều dịch vụ ... và mọi thứ hầu như đều liên kết với nhau. Nên phải thừa nhận là họ rất biết cách "MOI TIỀN" của các ông/bà chủ, nhưng thực sự là công bằng bởi dịch vụ của họ rất rộng/tốt - Tiền Nào Của Nấy

# AWS Document - Rất Củ Chuối - Cấu Hình Service Rất Đuối
Có lẽ là bởi AWS quá nhiều service nên chắc không có nhân dự để phát triển Doc nên phần Doc của họ mình đọc rất kém (Hoặc English của mình tệ =)) ). Điển hình là mọi thứ đa số chữ và chữ, rất ít hình ảnh thao tác trong khi mọi thứ trên Console của họ đều phải thao tác UI. Đặc biệt là những phần mới như IoT, để có thể cấu hình với Cognito + IAM để phân quyền cho User Pool mình gặp phải một số sự cố, và cũng rút ra được vài kinh nghiệm đau thương.

- Các bạn nên lên youtube và tham khảo các clip về "Re-Invent" của AWS để update các tech/service của AWS
- Họ có AWS-Lab trên github để các bạn có thể thao tác mẫu với source code
- Bạn nên dùng `AWS CLI` (AWS Command Line - Window/Linux/XOS), vì có một số cấu hình mà bạn không thể cấu hình trên trang console(UI) của AWS mà phải configure bằng Command Line (ĐUỐI NHỈ). Nó làm mình tốn hơn 8h để mò ra cái configure hết sức chuối nhưng cũng coi như là kinh nghiệm sương máu. Ví dụ: [https://stackoverflow.com/a/41449362](https://stackoverflow.com/a/41449362)

Bài viết này là mình viết dựa trên những gì mình tìm hiểu được. Nếu có điều gì chưa đúng, mong các bạn góp ý để cải thiện nhé!

# Tài Liệu Tham Khảo
- http://docs.aws.amazon.com