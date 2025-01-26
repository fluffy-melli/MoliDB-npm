# MoliDB JavaScript Client

MoliDB는 안전한 통신을 위해 AES 암호화와 gzip 압축을 사용하는 JavaScript 클라이언트입니다. 이 클라이언트는 MoliDB 서버와 상호작용할 수 있도록 도와줍니다.

## 설치 방법

npm에서 `molidb` 패키지를 설치할 수 있습니다. (이 예시에서는 MoliDB가 이미 npm에 배포된 상태로 가정합니다.)

```sh
npm install molidb
```

만약 직접 구현한 `molidb` 클라이언트를 사용하려면, 패키지를 로컬로 설치하거나 직접 코드에서 사용하는 방식으로 진행할 수 있습니다.

## 사용 방법

### 1. 서버와의 연결 설정

먼저, 서버의 URL과 API 토큰을 설정합니다. `Molidb` 클래스의 인스턴스를 생성하고 이를 통해 서버와의 통신을 설정합니다.

```js
const Molidb = require('molidb');  // 혹은 로컬 파일에서 사용
const db = new Molidb();  // 서버 URL / 시크릿 키 / API 토큰을 기본값으로 사용
```

### 2. 데이터 목록 조회

서버에서 제공하는 컬렉션 목록을 조회할 수 있습니다:

```js
(async () => {
    try {
        const collections = await db.listCollection();
        console.log(JSON.stringify(collections));
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### 3. 특정 컬렉션 조회

특정 컬렉션을 조회하려면 ID를 제공해야 합니다:

```js
(async () => {
    try {
        const collectionId = 'user';  // 조회할 컬렉션 ID
        const collectionData = await db.getCollection(collectionId);
        console.log(JSON.stringify(collectionData));
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### 4. 컬렉션 업데이트

컬렉션의 데이터를 업데이트할 수 있습니다. 업데이트할 데이터는 JavaScript 객체 형태로 전달해야 합니다:

```js
(async () => {
    try {
        const collectionId = 'user';  // 업데이트할 컬렉션 ID
        const newData = [{ id: 'molidb', money: 10 }];
        const updatedCollection = await db.updateCollection(collectionId, newData);
        console.log(JSON.stringify(updatedCollection));
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### 5. 컬렉션 삭제

컬렉션을 삭제하려면 ID를 제공해야 합니다:

```js
(async () => {
    try {
        const collectionId = 'user';  // 삭제할 컬렉션 ID
        await db.deleteCollection(collectionId);
        console.log(`Collection ${collectionId} deleted successfully.`);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### 6. 전체 코드 예시

위에서 설명한 기능들을 한 번에 처리하는 전체 예시는 아래와 같습니다:

```js
const Molidb = require('molidb');

(async () => {
    try {
        const db = new Molidb();

        // 1. 데이터 목록 조회
        console.log(JSON.stringify(await db.listCollection()));

        // 2. 컬렉션 업데이트
        console.log(JSON.stringify(await db.updateCollection('user', [{ id: 'molidb', money: 10 }])));
        
        // 3. 특정 컬렉션 조회
        let userlist = await db.getCollection('user');
        console.log(JSON.stringify(userlist));

        // 4. 데이터 수정
        userlist.forEach(user => {
            if (user.id === 'molidb') {
                user.money += 20;
            }
        });

        // 5. 수정된 데이터 확인
        console.log(JSON.stringify(await db.getCollection('user')));

        // 6. 데이터 업데이트
        console.log(JSON.stringify(await db.updateCollection('user', userlist)));

        // 7. 컬렉션 목록 조회
        console.log(JSON.stringify(await db.listCollection()));

        // 8. 컬렉션 삭제
        await db.deleteCollection('user');
        console.log(JSON.stringify(await db.listCollection()));
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

## 예외 처리

서버와의 통신에서 오류가 발생할 수 있습니다. 예외 처리를 통해 오류 메시지를 처리할 수 있습니다:

```js
(async () => {
    try {
        const collections = await db.listCollection();
        console.log(collections);
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
})();
```

## 라이센스

이 프로젝트는 [MIT License](https://opensource.org/licenses/MIT)를 따릅니다.

---

### Key Notes:
1. **라이브러리 의존성**: `Molidb`는 `axios`, `crypto`, `zlib` 등의 의존성을 사용합니다. `npm install`로 자동으로 설치되며, 별도의 설정 없이 바로 사용할 수 있습니다.
2. **서버와의 연결**: 서버 URL, 시크릿 키, API 토큰은 `Molidb` 클래스의 생성자에서 설정할 수 있습니다.
3. **async/await**: 비동기 API 호출은 `async/await` 문법을 사용하여 처리합니다.