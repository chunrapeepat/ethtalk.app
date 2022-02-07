# How to develop in local

First you need to use node version 14,
then you need to create firebase project click `Add project` if you don't have one

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ie8sbl8twclai9pep36b.png)

Click on `</>` sign because we gonna create web app

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cksxlhk31idkpmzuh49k.png)

And then register your app and also set up firebase hosting

![image](https://user-images.githubusercontent.com/62529025/151953277-967bac6f-d4cf-42d7-b7d7-d95829a6e235.png)

Copy paste the firebase config because we need it for `.env`

![image](https://user-images.githubusercontent.com/62529025/151953763-586234e7-b30d-4da8-90cd-f744bf836fec.png)

now go to `packages/firebase-api/.firebaserc` and change `default` value to your `projectId` before like this :

![image](https://user-images.githubusercontent.com/62529025/151954048-9581a882-c0bb-4e17-b04d-7a764e817bcf.png)

Now you can start developing, run this both on separate terminal :

```
yarn firebase-api:start
yarn react-app:start
```
Open `http://localhost:3000/embed?url=http://localhost:3000` then you will get something like this that means you can start developing

![image](https://user-images.githubusercontent.com/62529025/151954794-f21ca27f-c65f-4fbb-b5ef-77e285047e8c.png)

# How to deploy

Change `ethtalk` in both `.firebaserc` in react-app and firebase-api to your project-id then run this command respectively:

```
yarn firebase-api:deploy
yarn react-app:deploy
```

for firebase you need to have blaze plan to deploy


