provider "aws" {
  region = var.aws_region
}

# --- DVC Data Versioning Bucket ---
resource "aws_s3_bucket" "dvc_storage" {
  bucket        = "${var.project_name}-dvc-storage-${var.environment}"
  force_destroy = true 
  # Note: force_destroy allows deleting the bucket even if it contains objects.
  # This is for showcase purposes. Remove for production environments!
}

# Enable versioning on the DVC bucket to retain history of objects natively 
# in AWS (a good fail-safe complement to DVC's own versioning logic).
resource "aws_s3_bucket_versioning" "dvc_versioning" {
  bucket = aws_s3_bucket.dvc_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

# --- MLFlow Model Registry Artifact Bucket ---
resource "aws_s3_bucket" "mlflow_artifacts" {
  bucket        = "${var.project_name}-mlflow-artifacts-${var.environment}"
  force_destroy = true
}

# Essential to keep model artifact history tracking clean and easily revertible.
resource "aws_s3_bucket_versioning" "mlflow_versioning" {
  bucket = aws_s3_bucket.mlflow_artifacts.id
  versioning_configuration {
    status = "Enabled" 
  }
}
