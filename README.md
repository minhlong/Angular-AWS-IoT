Please refer wiki page for more information

Demo: [https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT](https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT)

Username: admin | Password: 123456789

![ScreenShot](/screeenshot.png?raw=true)

## Development

Update your config in `environments/environment.prod.ts` file

```
export const environment = {
  production: true,

  ...
};
```

## Build

```
ng build --prod --aot=false --base-href "https://minhlong.github.io/Angular4-AWS-Cognito-IAM-API-Lambda-IoT"
```

Please run `npm install` for install and `ng serve` for a dev server then. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files
