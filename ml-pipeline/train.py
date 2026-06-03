import os
import argparse
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score
import mlflow
import mlflow.sklearn

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-path", type=str, default="data/dataset.csv")
    parser.add_argument("--n-estimators", type=int, default=100)
    parser.add_argument("--max-depth", type=int, default=5)
    args = parser.parse_args()

    # 1. Configure MLflow Backend and Artifact Store
    # In real production, the tracking URI would point to an external server (e.g. EC2/Fargate running MLflow)
    # Here we use a local sqlite DB for metadata tracking but still use S3 for massive artifact storage.
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    
    experiment_name = "aws_dvc_mlflow_showcase"
    mlflow.set_experiment(experiment_name)

    with mlflow.start_run():
        print(f"Loading data from {args.data_path}")
        try:
            df = pd.read_csv(args.data_path)
        except FileNotFoundError:
            print(f"Error: {args.data_path} not found. Did you pull it with DVC?")
            return

        X = df.drop("target", axis=1)
        y = df["target"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Log training parameters
        mlflow.log_param("n_estimators", args.n_estimators)
        mlflow.log_param("max_depth", args.max_depth)
        
        # Log custom data lineage info (optional connection linking DVC to MLflow)
        # This gives a nice trail indicating which DVC commit was used to generate this model
        try:
            dvc_rev = os.popen("git rev-parse HEAD").read().strip()
            mlflow.log_param("git_commit", dvc_rev)
        except Exception:
            pass

        # Train model
        print("Training RandomForest model...")
        model = RandomForestClassifier(n_estimators=args.n_estimators, max_depth=args.max_depth, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate model
        predictions = model.predict(X_test)
        acc = accuracy_score(y_test, predictions)
        prec = precision_score(y_test, predictions, average='macro')

        # Log metrics to MLFlow
        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("precision", prec)
        print(f"Model metrics: acc={acc:.4f}, precision={prec:.4f}")

        # Log and Register Model to S3
        # Because we configured MLflow with an S3 artifact URI (via default artifact root mapped to S3),
        # this model blob gets uploaded securely to our AWS bucket via boto3 automatically.
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="random_forest_model",
            registered_model_name="Remote_Wine_Quality_RF"
        )
        print("Model successfully logged and registered in MLflow (S3 Store).")

if __name__ == "__main__":
    main()
