[![NuxtJs](https://img.shields.io/badge/nuxt-2.13.3-brightgreen.svg)](https://nuxtjs.org/)
[![Element UI](https://img.shields.io/badge/elementui-2.13.2-orange.svg)](https://element.eleme.io/#/en-US)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/2c912cafb0684f13b0f7c89f519a85ce)](https://www.codacy.com/gh/Olympus-Team/OKRs-enterprise-frontend?utm_source=github.com&utm_medium=referral&utm_content=Olympus-Team/OKRs-enterprise-frontend&utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/7726/projects/12863/branches/205412/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=7726&pid=12863&bid=205412)
[![codecov](https://codecov.io/gh/Olympus-Team/OKRs-enterprise-frontend/branch/develop/graph/badge.svg)](https://codecov.io/gh/Olympus-Team/OKRs-enterprise-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Dependabot](https://flat.badgen.net/dependabot/nestjsx/nestjs-config?icon=dependabot)](https://dependabot.com/)
[![Contributors](https://img.shields.io/github/contributors/Olympus-Team/OKRs-enterprise-frontend?color=%237159c1&logoColor=%237159c1&style=flat)](https://github.com/Olympus-Team/OKRs-enterprise-frontend/graphs/contributors)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/Olympus-Team/OKRs-enterprise-frontend)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<h2 align="center">
Tool OKRs - NuxtJs + Vuex + Element UI
</h2>

<p align="center">Code 1 app nhỏ nhắn xinh xắn nhưng không hề đáng yêu về tool OKRs cho các Start Up nhỏ sử dụng! Ai có đóng góp gì thì mong các bạn tạo issue để cải thiện hơn ạ 🥳</p>

<hr>

## Thành viên

| [<img src="https://avatars1.githubusercontent.com/u/24296018?s=460&u=6575a1785649a40e12d9593c46178b8fa36c3c9d&v=4" width="60px;"/>](https://github.com/harrytran998) | [<img src="https://avatars1.githubusercontent.com/u/23659823?s=400&u=ce4b4205be4e2b4e949eea9e36612b9d7daade53&v=4" width="60px;"/>](https://github.com/bacodekiller) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


| [Harry Trần](https://github.com/harrytran998) | [Quang Hiệp](https://github.com/bacodekiller) |

## OKRs Enterprise Frontend

### Cách chạy project

#### Yêu cầu trước khi chạy

1. [Clone repo của Backend về](https://github.com/Olympus-Team/OKRs-enterprise-api)
2. Làm theo các hướng dẫn của bên Backend để setup DB các thứ
3. Copy file .env và cài đặt các gói dependencies

```bash
cp .env.development .env
yarn install
```

4. Chạy Frontend theo các comman options ở dưới

```bash
# Dev với HRM(hot reload replacement) ở localhost:8080

yarn dev

# Build ra cho production
# host mặc định đang là 3000 --> Có thể config ở script: https://nuxtjs.org/faq/host-port/#configure-in-nuxtconfigjs

yarn start
```
