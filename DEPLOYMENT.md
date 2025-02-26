# Guide de déploiement - CryptoCare

Ce document détaille les procédures de déploiement pour l'ensemble de la plateforme CryptoCare.

## Table des matières

1. [Prérequis](#prérequis)
2. [Infrastructure](#infrastructure)
3. [Backend (API)](#backend-api)
4. [Frontend (Web)](#frontend-web)
5. [Application Mobile](#application-mobile)
6. [Base de données](#base-de-données)
7. [SSL et Sécurité](#ssl-et-sécurité)
8. [Monitoring](#monitoring)
9. [CI/CD](#cicd)
10. [Sauvegarde et récupération](#sauvegarde-et-récupération)

## Prérequis

- Compte DigitalOcean
- Compte GitHub avec accès au repository
- Domaine `cryptocare.ch` enregistré
- Compte Namecheap ou autre registraire DNS
- Accès aux API Zoom et Swiss Bitcoin Pay

## Infrastructure

### Hébergement

Toute l'infrastructure est déployée sur DigitalOcean dans la région Suisse.

#### Droplets nécessaires

1. **API Droplet** - Pour le backend
   - Taille: 4GB RAM, 2 vCPUs
   - OS: Ubuntu 22.04
   - Nom: `cryptocare-api-prod`

2. **DB Droplet** - Pour PostgreSQL
   - Taille: 2GB RAM, 2 vCPUs
   - OS: Ubuntu 22.04
   - Nom: `cryptocare-db-prod`

3. **Web Droplet** - Pour le frontend (optionnel, peut être remplacé par un service statique)
   - Taille: 2GB RAM, 1 vCPU
   - OS: Ubuntu 22.04
   - Nom: `cryptocare-web-prod`

### Configuration réseau

1. **Load Balancer** (optionnel pour plus de trafic)
   - Nom: `cryptocare-lb-prod`
   - Entrées: api.cryptocare.ch, www.cryptocare.ch, cryptocare.ch

2. **Firewall**
   - Nom: `cryptocare-fw-prod`
   - Règles:
     - SSH (port 22): Limité aux adresses IP autorisées
     - HTTP (port 80): Ouvert
     - HTTPS (port 443): Ouvert
     - PostgreSQL (port 5432): Limité au réseau interne

## Backend (API)

### Déploiement manuel

1. Se connecter au droplet API:
   ```bash
   ssh root@<api_droplet_ip>
   ```

2. Installer Node.js, PM2, Git et Nginx:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   apt-get install -y nodejs nginx git
   npm install -g pm2
   ```

3. Cloner le repository:
   ```bash
   git clone https://github.com/cryptocare-sa/cryptocare-backend.git /var/www/api
   cd /var/www/api
   ```

4. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Remplir avec les valeurs de production.

5. Installer les dépendances et build:
   ```bash
   npm install
   npm run build
   ```

6. Configurer PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 startup
   pm2 save
   ```

7. Configurer Nginx:
   ```bash
   nano /etc/nginx/sites-available/api.cryptocare.ch
   ```
   
   Contenu:
   ```nginx
   server {
       listen 80;
       server_name api.cryptocare.ch;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. Activer le site et redémarrer Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/api.cryptocare.ch /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Déploiement avec Docker

1. Se connecter au droplet API:
   ```bash
   ssh root@<api_droplet_ip>
   ```

2. Installer Docker et Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   apt-get install -y docker-compose
   ```

3. Cloner le repository:
   ```bash
   git clone https://github.com/cryptocare-sa/cryptocare-backend.git /var/www/api
   cd /var/www/api
   ```

4. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   nano .env
   ```

5. Lancer les conteneurs:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Frontend (Web)

### Déploiement sur DigitalOcean App Platform

1. Allez sur la console DigitalOcean
2. Créez une nouvelle application
3. Sélectionnez le repository GitHub
4. Configurez l'environnement:
   - Type: Static Site
   - Branch: main
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Configurez les variables d'environnement
6. Déployez l'application

### Déploiement sur Droplet

1. Se connecter au droplet Web:
   ```bash
   ssh root@<web_droplet_ip>
   ```

2. Installer Nginx:
   ```bash
   apt-get update
   apt-get install -y nginx
   ```

3. Cloner le repository et builder:
   ```bash
   git clone https://github.com/cryptocare-sa/cryptocare-frontend.git /tmp/frontend
   cd /tmp/frontend
   npm install
   npm run build
   ```

4. Copier les fichiers build:
   ```bash
   cp -r build/* /var/www/html/
   ```

5. Configurer Nginx:
   ```bash
   nano /etc/nginx/sites-available/cryptocare.ch
   ```
   
   Contenu:
   ```nginx
   server {
       listen 80;
       server_name cryptocare.ch www.cryptocare.ch;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

6. Activer le site et redémarrer Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/cryptocare.ch /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

## Application Mobile

### Build iOS (Production)

1. Installer eas-cli:
   ```bash
   npm install -g eas-cli
   ```

2. Connectez-vous à votre compte Expo:
   ```bash
   eas login
   ```

3. Configurer le projet:
   ```bash
   eas build:configure
   ```

4. Créer un build de production:
   ```bash
   eas build --platform ios --profile production
   ```

### Build Android (Production)

1. Installer eas-cli si ce n'est pas déjà fait:
   ```bash
   npm install -g eas-cli
   ```

2. Connectez-vous à votre compte Expo:
   ```bash
   eas login
   ```

3. Configurer le projet:
   ```bash
   eas build:configure
   ```

4. Créer un build de production:
   ```bash
   eas build --platform android --profile production
   ```

### Publier sur les Stores

1. **App Store (iOS)**:
   - Créez un compte Apple Developer (99$ par an)
   - Générez les certificats et profils de provisionnement
   - Soumettez via App Store Connect

2. **Google Play Store (Android)**:
   - Créez un compte Google Developer (25$ frais uniques)
   - Générez une clé de signature
   - Soumettez via Google Play Console

## Base de données

### Installation de PostgreSQL

1. Se connecter au droplet DB:
   ```bash
   ssh root@<db_droplet_ip>
   ```

2. Installer PostgreSQL:
   ```bash
   apt-get update
   apt-get install -y postgresql postgresql-contrib
   ```

3. Configurer PostgreSQL pour les connexions distantes:
   ```bash
   nano /etc/postgresql/14/main/postgresql.conf
   ```
   Modifier: `listen_addresses = '*'`

4. Configurer l'authentification:
   ```bash
   nano /etc/postgresql/14/main/pg_hba.conf
   ```
   Ajouter: `host all all <api_droplet_ip>/32 md5`

5. Redémarrer PostgreSQL:
   ```bash
   systemctl restart postgresql
   ```

6. Créer la base de données et l'utilisateur:
   ```bash
   sudo -u postgres psql
   ```
   
   ```sql
   CREATE DATABASE cryptocare;
   CREATE USER cryptocare WITH ENCRYPTED PASSWORD 'password_complexe';
   GRANT ALL PRIVILEGES ON DATABASE cryptocare TO cryptocare;
   ```

7. Migrer la base de données:
   Sur le serveur API:
   ```bash
   cd /var/www/api
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Sauvegarde de la base de données

Configurer une sauvegarde automatique quotidienne:

1. Créer un script de sauvegarde:
   ```bash
   nano /root/backup_db.sh
   ```
   
   Contenu:
   ```bash
   #!/bin/bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="/var/backups/postgresql"
   BACKUP_FILE="$BACKUP_DIR/cryptocare_$TIMESTAMP.sql"
   
   mkdir -p $BACKUP_DIR
   
   # Créer la sauvegarde
   sudo -u postgres pg_dump cryptocare > $BACKUP_FILE
   
   # Compresser
   gzip $BACKUP_FILE
   
   # Supprimer les sauvegardes de plus de 7 jours
   find $BACKUP_DIR -name "cryptocare_*.sql.gz" -mtime +7 -delete
   ```

2. Rendre le script exécutable:
   ```bash
   chmod +x /root/backup_db.sh
   ```

3. Configurer un cron job:
   ```bash
   crontab -e
   ```
   
   Ajouter:
   ```
   0 2 * * * /root/backup_db.sh
   ```

## SSL et Sécurité

### Configurer Let's Encrypt

1. Installer Certbot:
   ```bash
   apt-get update
   apt-get install -y certbot python3-certbot-nginx
   ```

2. Obtenir un certificat pour l'API:
   ```bash
   certbot --nginx -d api.cryptocare.ch
   ```

3. Obtenir un certificat pour le site web:
   ```bash
   certbot --nginx -d cryptocare.ch -d www.cryptocare.ch
   ```

4. Vérifier le renouvellement automatique:
   ```bash
   certbot renew --dry-run
   ```

### Configuration des headers de sécurité

Ajouter à la configuration Nginx (`/etc/nginx/sites-available/api.cryptocare.ch` et `/etc/nginx/sites-available/cryptocare.ch`):

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; connect-src 'self' https://api.cryptocare.ch; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self'";
```

### Configuration du pare-feu

1. Configurer UFW sur tous les serveurs:
   ```bash
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow ssh
   ufw allow http
   ufw allow https
   ```

2. Configurer le pare-feu pour PostgreSQL (uniquement sur le serveur DB):
   ```bash
   ufw allow from <api_droplet_ip> to any port 5432
   ```

3. Activer UFW:
   ```bash
   ufw enable
   ```

## Monitoring

### Installation de Prometheus et Grafana

1. Installer Prometheus:
   ```bash
   apt-get update
   apt-get install -y prometheus
   ```

2. Installer Grafana:
   ```bash
   apt-get install -y apt-transport-https software-properties-common
   wget -q -O - https://packages.grafana.com/gpg.key | apt-key add -
   add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
   apt-get update
   apt-get install -y grafana
   ```

3. Configurer Prometheus pour surveiller les serveurs:
   ```bash
   nano /etc/prometheus/prometheus.yml
   ```

4. Démarrer les services:
   ```bash
   systemctl enable prometheus
   systemctl start prometheus
   systemctl enable grafana-server
   systemctl start grafana-server
   ```

### Installation de node_exporter

Sur tous les serveurs:

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.3.1.linux-amd64.tar.gz
cp node_exporter-1.3.1.linux-amd64/node_exporter /usr/local/bin
useradd -rs /bin/false node_exporter
```

Créer un service:
```bash
nano /etc/systemd/system/node_exporter.service
```

Contenu:
```ini
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

Démarrer le service:
```bash
systemctl daemon-reload
systemctl enable node_exporter
systemctl start node_exporter
```

### Surveillance des logs

1. Installer ELK Stack ou utiliser Papertrail:
   ```bash
   # Option 1: Papertrail (plus simple)
   apt-get install -y rsyslog
   echo "*.*          @logs.papertrailapp.com:12345" >> /etc/rsyslog.conf
   systemctl restart rsyslog

   # Option 2: Filebeat pour ELK
   wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
   apt-get install apt-transport-https
   echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list
   apt-get update
   apt-get install filebeat
   ```

2. Configurer Filebeat (si option 2):
   ```bash
   nano /etc/filebeat/filebeat.yml
   ```

3. Activer et démarrer Filebeat:
   ```bash
   systemctl enable filebeat
   systemctl start filebeat
   ```

## CI/CD

### Configuration GitHub Actions

Créer les fichiers de workflow dans le dépôt GitHub:

1. Backend CI/CD:
   ```yaml
   # .github/workflows/backend-cicd.yml
   name: Backend CI/CD

   on:
     push:
       branches: [main]
       paths:
         - 'backend/**'

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: cd backend && npm install
         - name: Run tests
           run: cd backend && npm test

     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to production
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.API_HOST }}
             username: ${{ secrets.SSH_USERNAME }}
             key: ${{ secrets.SSH_PRIVATE_KEY }}
             script: |
               cd /var/www/api
               git pull
               npm install
               npm run build
               pm2 restart all
   ```

2. Frontend CI/CD:
   ```yaml
   # .github/workflows/frontend-cicd.yml
   name: Frontend CI/CD

   on:
     push:
       branches: [main]
       paths:
         - 'frontend/**'

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: cd frontend && npm install
         - name: Run tests
           run: cd frontend && npm test

     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Build
           run: |
             cd frontend
             npm install
             npm run build
         - name: Deploy to production
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.WEB_HOST }}
             username: ${{ secrets.SSH_USERNAME }}
             key: ${{ secrets.SSH_PRIVATE_KEY }}
             script: |
               rm -rf /var/www/html/*
               cp -r /tmp/frontend-build/* /var/www/html/
   ```

3. Mobile CI/CD:
   ```yaml
   # .github/workflows/mobile-cicd.yml
   name: Mobile CI/CD

   on:
     push:
       branches: [main]
       paths:
         - 'mobile/**'

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: cd mobile && npm install
         - name: Run tests
           run: cd mobile && npm test

     build:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Setup Expo
           uses: expo/expo-github-action@v7
           with:
             expo-version: 5.x
             token: ${{ secrets.EXPO_TOKEN }}
         - name: Install dependencies
           run: cd mobile && npm install
         - name: Build Android
           run: cd mobile && eas build --platform android --non-interactive
         - name: Build iOS
           run: cd mobile && eas build --platform ios --non-interactive
   ```

### Configuration des secrets GitHub

Dans les paramètres du dépôt GitHub, ajouter les secrets suivants:

- `API_HOST`: Adresse IP du serveur API
- `WEB_HOST`: Adresse IP du serveur Web
- `SSH_USERNAME`: Nom d'utilisateur SSH (généralement "root")
- `SSH_PRIVATE_KEY`: Clé privée SSH
- `EXPO_TOKEN`: Token d'accès Expo

## Sauvegarde et récupération

### Sauvegarde des configurations

Créer un script pour sauvegarder les configurations importantes:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/configs"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

# Nginx
cp -r /etc/nginx/sites-available/ $BACKUP_DIR/nginx-$DATE/

# PM2
pm2 save
cp ~/.pm2/dump.pm2 $BACKUP_DIR/pm2-$DATE.json

# Environnement
cp /var/www/api/.env $BACKUP_DIR/api-env-$DATE
```

### Plan de récupération

1. **Restauration du serveur API**:
   ```bash
   # Réinstaller les dépendances
   apt-get update
   apt-get install -y nodejs nginx git
   npm install -g pm2

   # Cloner le repository
   git clone https://github.com/cryptocare-sa/cryptocare-backend.git /var/www/api

   # Restaurer la configuration
   cp /backup/api-env-YYYYMMDD /var/www/api/.env
   cp -r /backup/nginx-YYYYMMDD/* /etc/nginx/sites-available/
   ln -s /etc/nginx/sites-available/api.cryptocare.ch /etc/nginx/sites-enabled/

   # Installer les dépendances et redémarrer
   cd /var/www/api
   npm install
   npm run build
   pm2 start ecosystem.config.js
   systemctl restart nginx
   ```

2. **Restauration de la base de données**:
   ```bash
   # Réinstaller PostgreSQL
   apt-get update
   apt-get install -y postgresql postgresql-contrib

   # Restaurer la sauvegarde
   gunzip -c /var/backups/postgresql/cryptocare_YYYYMMDD_HHMMSS.sql.gz > /tmp/cryptocare.sql
   sudo -u postgres psql -c "CREATE DATABASE cryptocare;"
   sudo -u postgres psql -c "CREATE USER cryptocare WITH ENCRYPTED PASSWORD 'password_complexe';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cryptocare TO cryptocare;"
   sudo -u postgres psql cryptocare < /tmp/cryptocare.sql
   ```

3. **Restauration du serveur Web**:
   ```bash
   # Réinstaller Nginx
   apt-get update
   apt-get install -y nginx

   # Restaurer la configuration
   cp -r /backup/nginx-YYYYMMDD/* /etc/nginx/sites-available/
   ln -s /etc/nginx/sites-available/cryptocare.ch /etc/nginx/sites-enabled/

   # Copier les fichiers statiques
   git clone https://github.com/cryptocare-sa/cryptocare-frontend.git /tmp/frontend
   cd /tmp/frontend
   npm install
   npm run build
   cp -r build/* /var/www/html/

   # Redémarrer Nginx
   systemctl restart nginx
   ```

## Maintenance

### Mises à jour de sécurité

Configurer les mises à jour automatiques:

```bash
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### Rotation des logs

Configurer logrotate pour tous les logs importants:

```bash
nano /etc/logrotate.d/cryptocare
```

Contenu:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}

/var/www/api/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
}
```

## Contacts et support

### Contact d'urgence

- **Administrateur système**: admin@cryptocare.ch, +41 XX XXX XX XX
- **Support technique**: support@cryptocare.ch
- **Responsable sécurité**: security@cryptocare.ch

### Documentation

Tous les documents de déploiement et procédures sont stockés dans:
- GitHub Wiki du projet
- Dossier `/docs` du repository
- Système de documentation interne (Notion, Confluence)
