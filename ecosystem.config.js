module.exports = {
  apps: [
    {
      name: "yummy-game",
      // script: 'server.js',
      // args: "startServer",
      // standalone/server.js
      script: "next",
      args: "start",
      cwd: "./",
      // autorestart: true,
      // watch: true, // 프로젝트가 리스타트되거나 파일이 체인지 될경우를 와칭시켜줌
      instances: 4, // 인스턴스를 일단 4개정도 띄운다.
      // exec_mode: 'cluster', // 실행모드 cluster로 명시하지 않으면 기본 fork모드로 실행됨
      // wait_ready: true, // Node앱으로 부터 앱이 실행되었다는 신호를 받기위해 기다리겠다는 것 "ready"
      // listen_timeout: 5000, // 앱 실행신호까지 기다릴 최대시간 ms단위 50초
      // kill_timeout: 5000, //새로운 프로세스 실행이 완료된 후 예전 프로세스를 교체하기까지 기다릴 시간  5초
      // max_memory_restart: '2G', // 프로그램의 메모리 크기가 일정 크기 이상이 되면 재시작시킴
      // 개발환경 설정
      env: {
        NODE_ENV: "development",
      },
      // 운영환경 설정 실행시 --env production 옵션으로 지정할 수 있다.
      // env_production: {
      //   NODE_ENV: "production",
      //   PORT: "9981",
      // },
      env_staging: {
        NODE_ENV: "staging",
        PORT: "3000",
      },
    },
  ],
};
