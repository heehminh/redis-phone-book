# redis-phone-book

## 1. 유저 생성 (LPUSH)
<img width="452" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/bfa26a05-0818-41ee-89c0-db6ba96b1146"> <br />
<img width="452" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/95ce8889-183c-442e-9238-e15c3f5167ff"> <br />
해당 칸에 입력하고 Create를 누르면 Redis 에 해당 값이 들어간다.

## 2. 모든 유저 정보 조회 (LRANGE)
<img width="419" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/d9019de0-166a-40e9-b94b-ff29f1d6a176"> <br />
-	클라이언트에서 보낸 GET /users 엔드포인트 처리
-	LRANGE 함수를 이용하여 ‘users’ 리스트의 모든 값을 가져온다. 가져온 데이터는 redisData 변수에 배열 형태로 저장된다.
-	가져온 데이터는 JSON 형식으로 저장되어 있으므로, map 함수를 사용하여 각 데이터를 JSON.parse 함수를 통해 객체로 반환해 users 변수에 저장된다.
-	res.render 함수를 사용하여 users 라는 이름의 템플릿을 렌더링한다. Users 변수를 탬플릿에 전달하여 동적으로 HTML을 생성한다. 

## 3. ID로 특정 유저 정보 조회 (FindByID)
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/67ec1a66-a3b9-4465-a31e-247219487ec7"> <br />
-	클라이언트에서 보낸 GET /users/:id 엔드포인트 처리
-	요청된 id를 기반으로 사용자를 검색하고, 검색 결과에 다라 적절한 응답을 반환한다. 
-	UserModel.findById(userId)를 사용하여 userId에 해당하는 사용자를 MongoDB에서 검색한다. 

## 4. 삭제 (LPOP, RPOP, DEL)
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/0eeba544-1491-4ac4-acab-05f31525ae56"> <br />
-	클라이언트에서 보낸 POST /deleteAllValues 엔드포인트 처리
-	Redis 클라이언트를 이용하여 users라는 이름의 데이터를 모두 삭제

## 5. 전화번호 수정 (FindByIDAndUpdate)
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/1ab547ea-90ff-44a3-a12a-b4db8f59d45f"> <br />
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/0848af03-0b87-4bec-802f-2e8704bbdf98"> <br />
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/4b3a600c-2a27-4e7c-87f2-134dd0a1c72b"> <br />
-	클라이언트에서 보낸 PUT /users/:id 엔드포인트 처리
-	UserModel.findByIdAndUpdate(userId, { phoneNumber }, { new: true })를 이용하여 MongoDB에서 userId에 해당하는 사용자를 찾아 phoneNumber 필드를 업데이트한다. { new : true } 옵션을 사용하여 업데이트된 사용자 객체를 반환한다. 

## 6. 총 유저 수 조회 (LLEN)
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/b0c39e7e-6975-44c6-afb8-10b3e81bd397"> <br />
-	클라이언트에서 보낸 GET /count 엔드포인트 처리
-	Users라는 이름의 리스트의 길이를 조회 (llen)
-	Promise가 이행된 경우 listLength를 사용하여 count 탬플릿에 listLength를 전달하여 렌더링 

## 7. 생년월일 범위로 유저 찾기 (LRANGE)
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/c7cceb13-d3d1-4f20-871c-5e61d4777190"> <br />
http://localhost:3000/search?start-date=20000101&end-date=20200101 <br />
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/00fbaec6-3ff1-46da-bf55-1fdae53c5461"> <br />  <br />
http://localhost:3000/search?start-date=19900101&end-date=20200101 <br /> 
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/a1f602f3-b15b-4a16-883d-37f4a89011f0"> <br /> <br />
http://localhost:3000/search?start-date=20050101&end-date=20200101 <br />
<img width="425" alt="image" src="https://github.com/heehminh/redis-phone-book/assets/76530562/0754687d-1766-4ae9-bc8b-f9669f6fd3fc"> <br />  <br />
-	클라이언트에서 보낸 GET /search 엔드포인트 처리
-	쿼리 파라미터에서 시작 날짜와 종료 날짜를 가져온다. Req.query 객체는 URL의 쿼리 파라미터를 추출하는데 사용된다.
-	정상적으로 사용자 목록이 조회된 경우, users 배열을 순회하면서 각 사용자를 JSON 형식으로 파싱하고, 시작 날짜와 종료 날짜 사이에 태어난 사용자들을 필터링하여 fiteredUsers 배열에 저장한다.
-	검출된 유저가 없을 경우 에러 메시지 반환




