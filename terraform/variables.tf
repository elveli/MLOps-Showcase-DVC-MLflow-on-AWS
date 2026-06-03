variable "aws_region" {
  description = "AWS region for the resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for all S3 resources"
  type        = string
  default     = "my-mlops-platform"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}
