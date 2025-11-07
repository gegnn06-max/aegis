import os
from dotenv import load_dotenv
import pymongo

# Load environment variables
load_dotenv()

def test_mongo_connection():
    """Test MongoDB connection and print detailed error if it fails."""
    try:
        # Get MongoDB connection string
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('MONGO_DB_NAME', 'fraud_detection')
        
        if not mongo_url:
            print("Error: MONGO_URL not found in environment variables")
            return False

        print("Attempting to connect to MongoDB...")
        client = pymongo.MongoClient(mongo_url)
        
        # Test the connection
        client.server_info()
        db = client[db_name]
        
        print("✅ Successfully connected to MongoDB")
        print(f"✅ Database '{db_name}' is accessible")
        return True
        
    except pymongo.errors.ConfigurationError as e:
        print("❌ MongoDB Configuration Error:")
        print(f"Details: {str(e)}")
        if "Invalid connection string" in str(e):
            print("\nTip: Check if your connection string is properly formatted")
            print("Format should be: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/")
    except pymongo.errors.OperationFailure as e:
        print("❌ MongoDB Operation Error:")
        print(f"Details: {str(e)}")
        if "Authentication failed" in str(e):
            print("\nTip: Check if your username and password are correct")
    except Exception as e:
        print("❌ Connection Error:")
        print(f"Details: {str(e)}")
    return False

if __name__ == "__main__":
    test_mongo_connection()