# Yummy Game

## 1. GET START

```bash
# 의존성 설치
yarn install

# START DEV
yarn dev

# START LOCAL (사내 api URL 붙음)
yarn yummy
```

### test server 주소

https://dev.yummygame.io

## 2. 모든 게임 코드 규칙

### Game Play 상태

코드내에
useState 로

1. playing 상태를 boolean 으로 관리하는게 있고
2. gameState 를 play , playEnd 로 관리 하는 두가지가 있다. ( Back End 네임명과 맞추기 위해서 저렇게 만듦 )

1번은 유저의 액션에 의한 게임 상태이고
2번은 유저와 관계 없이 게임이 돌아가는 것에 관한 상태이다.

예를 들어 크래쉬 에서 유저가 베팅거나 캐시아웃을 하지 않는 이상은 1의 상태는 변하지않는다.
그러나 크래쉬 게임이 시작되어 로켓이 발사 되면 2번 gameState는 play로 변하고 로켓이 터져 서 crashed 되면 playEnd 로 변한다.

그리고 autoBet은 유저의 액션에 따라 베팅하는 것이 아니기 때문에 autoBet 활성화 상황에서 1번 play 상태는 모든 UI 밑 로직에 관여하지 않는다. ( 오토벳 실행시 계속 play 상태)
게임이 종료되어 gameState 가 playEnd 가 되었을때 오토벳이 활성화 되어있는지 여부에 따라 다음 게임 베팅을 시작한다고 보면 된다.

###

### NODE JS VERSION 
v 18.16.1# yummygame
# yummygame
