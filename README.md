# evitakatrina.info

One folder, one source of truth. This directory **is** the git repo; pushing to
`main` deploys via Vercel (project `evitakatrinam`, on a different Vercel account,
so the Vercel CLI can't reach it — deploy by git push only).

    git add -A && git commit -m "..." && git push

There is no build step and no second copy. If you ever find yourself rsyncing
this into another folder, stop: that is what silently reverted four commits'
worth of edits on 2026-09-07.

`serve.py` is a local preview server (`python3 serve.py`) and is not deployed.
