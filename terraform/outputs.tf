output "dvc_bucket_name" {
  description = "Name of the S3 bucket created for DVC storage"
  value       = aws_s3_bucket.dvc_storage.id
}

output "dvc_bucket_arn" {
  description = "ARN of the DVC S3 bucket"
  value       = aws_s3_bucket.dvc_storage.arn
}

output "mlflow_artifacts_bucket_name" {
  description = "Name of the S3 bucket created for MLflow artifacts"
  value       = aws_s3_bucket.mlflow_artifacts.id
}

output "mlflow_artifacts_bucket_arn" {
  description = "ARN of the MLflow artifacts bucket"
  value       = aws_s3_bucket.mlflow_artifacts.arn
}
