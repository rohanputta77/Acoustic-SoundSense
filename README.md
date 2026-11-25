# SoundSense

Environmental sound classification web app: a static HTML/CSS/JavaScript frontend,
a FastAPI API, and local PyTorch inference and training tools.

## Repository structure

```text
backend/src/soundsense/
  main.py              # Compose API routers and static hosting
  api/                 # HTTP routes, authentication, request schemas
  core/                # Environment configuration and shared filesystem paths
  services/            # Training jobs, response helpers, process-local state
  ml/                  # Audio preprocessing, architectures, inference
  tools/
    training/          # Training and calibration command-line tools
    evaluation/        # Evaluation command-line tools
backend/tests/         # API, authentication, and path regression tests
frontend/
  index.html           # Browser entry point
  js/                  # Application, authentication, visual effects
  css/                 # Stylesheets
  assets/              # images/, audio/, data/
deployment/            # Container build configuration
docs/                  # Architecture, development, model workflow references
legacy/node/           # Archived Express prototype (not active)
artifacts/             # Local weights, checkpoints, training reports (ignored)
data/                  # Local dataset and preprocessing output (ignored)
var/                   # Local accounts DB, JWT key, uploads (ignored)
.github/workflows/     # Automated checks
```

## Run locally (Windows, Python 3.11)

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
.\start.ps1
```

Existing installations can keep their current `.venv` and `.env`.
Open http://127.0.0.1:3001 and http://127.0.0.1:3001/docs.
The root `main.py` also remains a compatibility launcher.

For a terminal session, set `$env:PYTHONPATH = "$PWD/backend/src"`, then run
`python -m soundsense` using the virtual environment interpreter. Optional editable
installation: `python -m pip install -e .`; the frontend must remain alongside the
backend in this repository (a Python wheel alone is not a web deployment).

## Models and data

The local migration preserves your files; they are excluded from Git. A fresh clone
needs model weights and datasets installed separately. Put checkpoints under
`artifacts/checkpoints/`, older weights under `artifacts/weights/`, and reports under
`artifacts/training_logs/`. Set `SOUNDSENSE_ESC50_DIR` in `.env` to the ESC-50 dataset.
Generated audio/features/splits belong in `data/preprocessing/`.

Run tools as modules with `backend/src` on `PYTHONPATH`, for example:

```powershell
python -m soundsense.tools.training.train_ast
python -m soundsense.tools.evaluation.evaluate_models
python -m soundsense.ml.batch_preprocessor
```

See [development](docs/development.md), [architecture](docs/architecture.md), and
[model workflows](docs/model-workflows.md). Use module commands with `backend/src` on `PYTHONPATH`.
For a newcomer-oriented map of the repository and links by task, see the
[Project Guide](PROJECT_GUIDE.md).

## Verification and deployment

```powershell
$env:PYTHONPATH = "$PWD/backend/src"
.\.venv\Scripts\python.exe -m unittest discover -s backend/tests -v
docker compose up --build
```

The container does not include local datasets or trained weights. The Render
Blueprint uses the free web service plan and generates `SOUNDSENSE_SECRET`, but does
not attach persistent storage. Account data, uploads, and runtime files can be lost
when the service restarts or redeploys. Free-tier resource limits may also affect
model inference. Add required model files and datasets separately before using
inference.
Use one application worker: training progress and counters are process-local.

## Before uploading to GitHub

Only application source, documentation, configuration examples, and frontend assets
belong in this repository. `.gitignore` excludes local credentials, databases,
models, datasets, environments, and backups. Review `git status --short` and your
staged changes before committing. Large trained models should be distributed
separately through a model registry or explicitly configured Git LFS.
