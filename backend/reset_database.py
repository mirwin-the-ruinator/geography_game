from app.db.database import Base, engine
import app.db.models  # Ensure all models are imported

print("⚠️ Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("✅ Creating all tables...")
Base.metadata.create_all(bind=engine)

print("🎉 Database reset complete.")
