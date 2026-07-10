# Blockers

На текущем этапе критических блокеров нет. Higgsfield авторизован, FFmpeg установлен, production fallback stack создан.

Перед production deployment всё равно необходимы:

- реальный `LEAD_WEBHOOK_URL`;
- подтверждённые analytics IDs/consent setup;
- подтверждение спорных коммерческих фактов из `docs/facts-to-verify.md`.
