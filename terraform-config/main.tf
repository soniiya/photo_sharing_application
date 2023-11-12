provider "aws" {
  region = "ap-southeast-2"  # Set to the region where your bucket exists
}

# Assuming the bucket already exists and you are managing its properties
resource "aws_s3_bucket" "my_bucket" {
  bucket = "cyclic-gold-filthy-trout-us-west-1"
  # Include any additional bucket configurations here
}

# Resource to set bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  bucket = cyclic-gold-filthy-trout-us-west-1.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

# Resource to set bucket ACL
resource "aws_s3_bucket_acl" "s3_bucket_acl" {
  bucket      = aws_s3_bucket.bucket-one-two.id
  acl         = "private"
  depends_on  = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}
