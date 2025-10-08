<!-- path: README.md -->
# cicdbg - Cloud Run Blue/Green via Cloud Build

## 一次性前置
- Cloud Run 服務：**cicdbg**（已建好）
- Artifact Registry：**cicd-bluegreen-docker**（region: asia-east1）
- Cloud Build 觸發器：**push 到 main**，設定 `cloudbuild.yaml`

## 開發指令
```bash
npm start # 本地測（若需）
