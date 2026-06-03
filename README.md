# AWS MLOps Showcase: DVC & MLflow

Welcome to the MLOps engineering showcase. This project demonstrates how to set up robust **Data Version Control (DVC)** and **Model Registry Management (MLflow)** using Cloud storage (AWS S3) provisioned via **Terraform**.

## Architecture Overview

1.  **Infrastructure (`/terraform`)**: Uses Terraform to spin up two S3 buckets securely. One bucket stores DVC data blobs (versioned data tracking), and the other stores MLflow model artifacts (model registry). Bucket versioning is enabled natively for fail-safes.
2.  **Tracking & Datasets (`/ml-pipeline`)**:
    *   **DVC**: Hashes our dataset `dataset.csv` and pushes the real data into the AWS S3 `dvc_storage` bucket natively via `boto3/dvc-s3`. Only pointers `.dvc` files are kept in git.
    *   **MLflow**: Captures experiment runs. Model metrics are stored locally in `sqlite:///mlflow.db` while heavy model objects (like `.pkl` artifacts) are uploaded to the AWS S3 `mlflow_artifacts` bucket automatically.

---

## 🚀 1. Setup Instructions

### Authentication
Ensure you have the AWS CLI installed and configured locally:

```bash
aws configure --profile mlops-dev
export AWS_PROFILE=mlops-dev
```

*(Alternatively, ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are exported in your terminal).*

### Provision Infrastructure
Navigate to the `terraform` directory and deploy the storage infrastructure:

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

Keep note of the Terraform output! You will see two bucket names:
-   `dvc_bucket_name`: e.g. `my-mlops-platform-dvc-storage-dev`
-   `mlflow_artifacts_bucket_name`: e.g. `my-mlops-platform-mlflow-artifacts-dev`

---

## 🧬 2. Pipeline Execution

Install the required Python modules. We recommend using a virtual environment.

```bash
cd ../ml-pipeline
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Initializing DVC
Link your local DVC structure to the S3 bucket created by Terraform.

```bash
# Initialize DVC if not already
dvc init

# Set the remote S3 bucket (replace with your Terraform output bucket)
dvc remote add -d aws-s3 s3://<YOUR_DVC_BUCKET_NAME>

# Track the dataset
dvc add data/dataset.csv

# Push data to AWS S3
dvc push
```

### Running the MLflow Training Pipeline
Start the training run. Inside `train.py`, MLFlow connects to S3 to log the serialized `RandomForestClassifier`.

```bash
# Provide MLFlow the S3 bucket artifact destination before running
export MLFLOW_TRACKING_URI="sqlite:///mlflow.db"
export MLFLOW_ARTIFACT_URI="s3://<YOUR_MLFLOW_ARTIFACTS_BUCKET_NAME>/"

# Run the training script
python train.py --n-estimators 100 --max-depth 5
```

---

## 📊 3. View the Results

Now you can spin up the MLflow Tracking UI to verify the experiment metrics and see the remote AWS model registry.

```bash
mlflow ui --backend-store-uri sqlite:///mlflow.db --default-artifact-root s3://<YOUR_MLFLOW_ARTIFACTS_BUCKET_NAME>/
```

Navigate your browser to `http://127.0.0.1:5000`. Inside, you will see your `aws_dvc_mlflow_showcase` experiment, complete with accuracy, precision, hyperparameters, and the actual model artifacts securely fetched natively from your AWS S3 buckets!
