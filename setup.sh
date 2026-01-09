#!/bin/bash
set -e

echo "============================================"
echo "  Healthcare Management System Setup"
echo "============================================"

### -------------------------------
### Backend Setup
### -------------------------------
echo "Setting up backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f ".env" ]; then
cat <<EOT > .env
SECRET_KEY=TestSecretKey
DEBUG=True
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
EOT
echo ".env created"
fi

# Create PostgreSQL DB if not exists
echo "Creating PostgreSQL database..."
sudo -u postgres psql <<EOF
SELECT 'CREATE DATABASE healthcare_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'healthcare_db')\gexec
EOF

# Run Django migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Create Django admin user"
python manage.py createsuperuser

### -------------------------------
### Frontend Setup
### -------------------------------
echo "Setting up frontend..."

cd healthcare-frontend

# Create frontend env
cat <<EOT > .env
VITE_API_URL=http://localhost:8000/api
EOT

# Install node modules
npm install

echo "============================================"
echo " Setup complete!"
echo "============================================"
echo ""
echo "To run backend:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "To run frontend:"
echo "  cd healthcare-frontend"
echo "  npm run dev"
echo ""
