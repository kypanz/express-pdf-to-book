# cst-template-backend-express

This is a backend service that includes the next things

- users endpoints ( basic auth )
- websockets ( socket.io )
- emails ( nodemailer )


## Configure

You gonna need to create a `env` file and add the next things

```
MODE_TEST='test'
HTTPS='false'
EMAIL_ENABLED='false'
EMAIL_HOST='example.smtp'
EMAIL_USER='example@gmail.com'
EMAIL_PASSWORD=''
URL_FRONTEND='https://example.com'
```

