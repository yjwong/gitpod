# the cluster_name should be of length less than 15 characters and surrounded by double quotes
cluster_name =

# a cloudDNS zone and certificate request will be created for this domain; surround the domain name within double quotes
domain_name =

region      = "europe-west1"
zone        = "europe-west1-d"
project     = "my-gcp-project"
credentials = "/path/to/account/key.json"

cluster_version = "1.22"

enable_external_database = true
enable_external_storage  = true
enable_external_registry = true
