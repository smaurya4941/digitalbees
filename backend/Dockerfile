FROM php:8.3-apache

# 1. Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    xml \
    bcmath \
    zip \
    && rm -rf /var/lib/apt/lists/*

# 2. Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# 3. Change Apache DocumentRoot to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. Set working directory
WORKDIR /var/www/html

# 5. Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 6. Copy application code
COPY . .

# 7. Install dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# 8. Set proper permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# 9. Ensure Render dynamic PORT is handled correctly
# Render assigns a dynamic port (default 10000) using the PORT environment variable.
ENV PORT=10000
EXPOSE ${PORT}

# 10. Start script that handles runtime configurations
# This will update Apache ports to match $PORT, cache config, and start Apache.
CMD sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf && \
    sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    apache2-foreground