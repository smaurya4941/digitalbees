-- =====================================================================
-- TeamBees Corp — Production Database Schema
-- Laravel + MySQL 8 / MariaDB 10.6+
-- Generated as the full reference schema discussed in the design session
-- =====================================================================


-- =====================================================================
-- MODULE 1 — IDENTITY & ACCESS
-- =====================================================================

CREATE TABLE users (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(150) UNIQUE NOT NULL,
    email_verified_at   TIMESTAMP NULL,
    password            VARCHAR(255) NOT NULL,
    department          ENUM('design','content_seo','cro','engineering','crm_ops','compliance') NULL,
    avatar_media_id     BIGINT UNSIGNED NULL,
    is_active           BOOLEAN DEFAULT TRUE,
    remember_token      VARCHAR(100) NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE roles (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) UNIQUE NOT NULL,
    guard_name  VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE permissions (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) UNIQUE NOT NULL,
    guard_name  VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE model_has_roles (
    role_id     BIGINT UNSIGNED NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    model_type  VARCHAR(100) NOT NULL,
    model_id    BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, model_id, model_type)
);

CREATE TABLE model_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    model_type    VARCHAR(100) NOT NULL,
    model_id      BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (permission_id, model_id, model_type)
);

CREATE TABLE role_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    role_id       BIGINT UNSIGNED NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (permission_id, role_id)
);


-- =====================================================================
-- MODULE 2 — TAXONOMY / CONTENT ENTITIES
-- =====================================================================

CREATE TABLE practices (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    tagline         VARCHAR(255) NULL,
    summary         TEXT NULL,
    icon            VARCHAR(100) NULL,
    color_token     VARCHAR(50) NULL,
    status          ENUM('draft','published','archived') DEFAULT 'draft',
    sort_order      INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL
);

CREATE TABLE sub_services (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    practice_id     BIGINT UNSIGNED NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(150) NOT NULL,
    summary         TEXT NULL,
    body            LONGTEXT NULL,
    status          ENUM('draft','published','archived') DEFAULT 'draft',
    sort_order      INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL,
    UNIQUE (practice_id, slug)
);

CREATE TABLE industries (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    summary     TEXT NULL,
    icon        VARCHAR(100) NULL,
    status      ENUM('draft','published','archived') DEFAULT 'draft',
    sort_order  INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL
);

CREATE TABLE regions (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    iso_code    VARCHAR(10) NULL,
    summary     TEXT NULL,
    status      ENUM('draft','published','archived') DEFAULT 'draft',
    sort_order  INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE technologies (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    summary         TEXT NULL,
    logo_media_id   BIGINT UNSIGNED NULL,
    vendor_name     VARCHAR(100) NULL,
    status          ENUM('draft','published','archived') DEFAULT 'draft',
    sort_order      INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE case_studies (
    id                      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title                   VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) UNIQUE NOT NULL,
    client_name             VARCHAR(150) NULL,
    client_logo_media_id    BIGINT UNSIGNED NULL,
    summary                 TEXT NULL,
    challenge               TEXT NULL,
    solution                TEXT NULL,
    results                 TEXT NULL,
    metrics                 JSON NULL,
    status                  ENUM('draft','published','archived') DEFAULT 'draft',
    published_at            TIMESTAMP NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL
);

CREATE TABLE resources (
    id                      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    resource_type           ENUM('blog','guide','webinar','research','news') NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) UNIQUE NOT NULL,
    excerpt                 TEXT NULL,
    body                    LONGTEXT NULL,
    author_id               BIGINT UNSIGNED NULL REFERENCES users(id),
    reading_time_minutes    INT NULL,
    status                  ENUM('draft','published','archived') DEFAULT 'draft',
    published_at            TIMESTAMP NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL
);

CREATE TABLE resource_categories (
    id      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(100) NOT NULL,
    slug    VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE resource_category_resource (
    resource_category_id BIGINT UNSIGNED NOT NULL REFERENCES resource_categories(id) ON DELETE CASCADE,
    resource_id           BIGINT UNSIGNED NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_category_id, resource_id)
);

CREATE TABLE locations (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    region_id   BIGINT UNSIGNED NOT NULL REFERENCES regions(id),
    name        VARCHAR(150) NULL,
    address     TEXT NULL,
    city        VARCHAR(100) NULL,
    country     VARCHAR(100) NULL,
    lat         DECIMAL(10,7) NULL,
    lng         DECIMAL(10,7) NULL,
    status      ENUM('draft','published') DEFAULT 'published',
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

-- NOTE: named job_postings (not "jobs") to avoid colliding with Laravel's queue "jobs" table
CREATE TABLE job_postings (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    location_id         BIGINT UNSIGNED NULL REFERENCES locations(id),
    employment_type     ENUM('full_time','part_time','contract') DEFAULT 'full_time',
    description         LONGTEXT NULL,
    ats_external_id     VARCHAR(100) NULL,
    status              ENUM('draft','open','closed') DEFAULT 'draft',
    posted_at           TIMESTAMP NULL,
    closes_at           TIMESTAMP NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE job_applications (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    job_id              BIGINT UNSIGNED NOT NULL REFERENCES job_postings(id),
    full_name           VARCHAR(150) NOT NULL,
    email               VARCHAR(150) NOT NULL,
    phone               VARCHAR(50) NULL,
    resume_media_id     BIGINT UNSIGNED NULL,
    cover_note          TEXT NULL,
    status              ENUM('submitted','reviewed','shortlisted','rejected','hired') DEFAULT 'submitted',
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);


-- =====================================================================
-- MODULE 3 — PAGE RESOLUTION / CMS
-- =====================================================================

CREATE TABLE page_templates (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    key_name    VARCHAR(100) UNIQUE NOT NULL,
    blade_view  VARCHAR(150) NOT NULL,
    description VARCHAR(255) NULL
);

CREATE TABLE pages (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    url_path            VARCHAR(500) UNIQUE NOT NULL,
    page_template_id    BIGINT UNSIGNED NOT NULL REFERENCES page_templates(id),
    pageable_type       VARCHAR(100) NULL,
    pageable_id         BIGINT UNSIGNED NULL,
    secondary_type      VARCHAR(100) NULL,
    secondary_id        BIGINT UNSIGNED NULL,
    title               VARCHAR(255) NULL,
    status              ENUM('draft','published','archived') DEFAULT 'draft',
    published_at        TIMESTAMP NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
    INDEX idx_pageable (pageable_type, pageable_id)
);

CREATE TABLE page_sections (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    page_id         BIGINT UNSIGNED NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    section_key     VARCHAR(100) NOT NULL,
    content         JSON NOT NULL,
    sort_order      INT DEFAULT 0,
    is_visible      BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE navigation_menus (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    key_name    VARCHAR(50) UNIQUE NOT NULL,
    label       VARCHAR(100) NULL
);

CREATE TABLE navigation_items (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    navigation_menu_id  BIGINT UNSIGNED NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
    parent_id           BIGINT UNSIGNED NULL REFERENCES navigation_items(id) ON DELETE CASCADE,
    label               VARCHAR(150) NOT NULL,
    linkable_type       VARCHAR(100) NULL,
    linkable_id         BIGINT UNSIGNED NULL,
    custom_url          VARCHAR(255) NULL,
    icon                VARCHAR(100) NULL,
    sort_order          INT DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE
);

CREATE TABLE settings (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    key_name    VARCHAR(100) UNIQUE NOT NULL,
    value       TEXT NULL,
    type        VARCHAR(30) DEFAULT 'string',
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);


-- =====================================================================
-- MODULE 4 — FORMS / LEADS / CRM / CHATBOT
-- =====================================================================

CREATE TABLE leads (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    source_page_id      BIGINT UNSIGNED NULL REFERENCES pages(id),
    full_name           VARCHAR(150) NULL,
    email               VARCHAR(150) NULL,
    phone               VARCHAR(50) NULL,
    company             VARCHAR(150) NULL,
    message             TEXT NULL,
    form_type           ENUM('contact','demo_request','newsletter','chatbot') NOT NULL,
    utm                 JSON NULL,
    score               INT DEFAULT 0,
    status              ENUM('new','synced','failed','duplicate') DEFAULT 'new',
    crm_reference_id    VARCHAR(100) NULL,
    ip_address          VARCHAR(45) NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE crm_sync_logs (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    lead_id         BIGINT UNSIGNED NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    attempt_number  INT DEFAULT 1,
    status          ENUM('success','failed') NOT NULL,
    payload         JSON NULL,
    response        JSON NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE chatbot_conversations (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_id      VARCHAR(100) NOT NULL,
    lead_id         BIGINT UNSIGNED NULL REFERENCES leads(id),
    transcript      JSON NOT NULL,
    resolved        BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE newsletter_subscribers (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email           VARCHAR(150) UNIQUE NOT NULL,
    status          ENUM('subscribed','unsubscribed') DEFAULT 'subscribed',
    source_page_id  BIGINT UNSIGNED NULL REFERENCES pages(id),
    created_at TIMESTAMP NULL
);

CREATE TABLE consent_logs (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_id      VARCHAR(100) NOT NULL,
    ip_address      VARCHAR(45) NULL,
    region_detected VARCHAR(10) NULL,
    categories      JSON NOT NULL,
    created_at TIMESTAMP NULL
);


-- =====================================================================
-- MODULE 5 — SEARCH / GOVERNANCE / KPIs / INTEGRATIONS
-- =====================================================================

CREATE TABLE search_queries (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    query           VARCHAR(255) NOT NULL,
    results_count   INT DEFAULT 0,
    user_ip         VARCHAR(45) NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE audit_logs (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NULL REFERENCES users(id),
    auditable_type  VARCHAR(100) NOT NULL,
    auditable_id    BIGINT UNSIGNED NOT NULL,
    action          VARCHAR(50) NOT NULL,
    old_values      JSON NULL,
    new_values      JSON NULL,
    created_at TIMESTAMP NULL,
    INDEX idx_auditable (auditable_type, auditable_id)
);

CREATE TABLE content_reviews (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    reviewable_type VARCHAR(100) NOT NULL,
    reviewable_id   BIGINT UNSIGNED NOT NULL,
    reviewer_id     BIGINT UNSIGNED NOT NULL REFERENCES users(id),
    cycle           ENUM('weekly','monthly','quarterly','annual') NOT NULL,
    notes           TEXT NULL,
    reviewed_at     TIMESTAMP NULL
);

CREATE TABLE kpi_snapshots (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    metric_key  VARCHAR(100) NOT NULL,
    value       DECIMAL(15,4) NOT NULL,
    period_date DATE NOT NULL,
    created_at TIMESTAMP NULL,
    UNIQUE (metric_key, period_date)
);

CREATE TABLE integrations (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    key_name    VARCHAR(100) UNIQUE NOT NULL,
    config      JSON NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);


-- =====================================================================
-- MODULE 6 — SUPPORTING CONTENT
-- =====================================================================

CREATE TABLE testimonials (
    id                      BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    quote                   TEXT NOT NULL,
    author_name             VARCHAR(150) NULL,
    author_title            VARCHAR(150) NULL,
    author_company          VARCHAR(150) NULL,
    author_photo_media_id   BIGINT UNSIGNED NULL,
    related_type            VARCHAR(100) NULL,
    related_id              BIGINT UNSIGNED NULL,
    status                  ENUM('draft','published') DEFAULT 'draft',
    sort_order              INT DEFAULT 0,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);

CREATE TABLE faqs (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    faqable_type    VARCHAR(100) NULL,
    faqable_id      BIGINT UNSIGNED NULL,
    question        VARCHAR(500) NOT NULL,
    answer          TEXT NOT NULL,
    sort_order      INT DEFAULT 0,
    status          ENUM('draft','published') DEFAULT 'draft'
);

CREATE TABLE team_members (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(150) NOT NULL,
    title           VARCHAR(150) NULL,
    bio             TEXT NULL,
    photo_media_id  BIGINT UNSIGNED NULL,
    linkedin_url    VARCHAR(255) NULL,
    is_leadership   BOOLEAN DEFAULT FALSE,
    sort_order      INT DEFAULT 0,
    status          ENUM('draft','published') DEFAULT 'draft'
);

CREATE TABLE partners (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(150) NOT NULL,
    logo_media_id   BIGINT UNSIGNED NULL,
    partner_type    ENUM('technology','alliance','certification') DEFAULT 'technology',
    technology_id   BIGINT UNSIGNED NULL REFERENCES technologies(id),
    url             VARCHAR(255) NULL,
    sort_order      INT DEFAULT 0,
    status          ENUM('draft','published') DEFAULT 'draft'
);

CREATE TABLE company_milestones (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    year            SMALLINT NOT NULL,
    title           VARCHAR(255) NULL,
    description     TEXT NULL,
    sort_order      INT DEFAULT 0
);


-- =====================================================================
-- MODULE 7 — UNIVERSAL POLYMORPHIC TABLES (attach to any entity above)
-- =====================================================================

CREATE TABLE entity_relations (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    subject_type    VARCHAR(100) NOT NULL,
    subject_id      BIGINT UNSIGNED NOT NULL,
    related_type    VARCHAR(100) NOT NULL,
    related_id      BIGINT UNSIGNED NOT NULL,
    relation_type   VARCHAR(50) DEFAULT 'related',
    sort_order      INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    UNIQUE uniq_relation (subject_type, subject_id, related_type, related_id, relation_type),
    INDEX idx_related (related_type, related_id)
);

CREATE TABLE seo_metadata (
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    seoable_type        VARCHAR(100) NOT NULL,
    seoable_id          BIGINT UNSIGNED NOT NULL,
    meta_title          VARCHAR(255) NULL,
    meta_description    VARCHAR(500) NULL,
    canonical_url       VARCHAR(255) NULL,
    robots              VARCHAR(50) DEFAULT 'index,follow',
    og_title            VARCHAR(255) NULL,
    og_description      VARCHAR(500) NULL,
    og_image_id         BIGINT UNSIGNED NULL,
    twitter_card        VARCHAR(50) NULL,
    schema_type         VARCHAR(50) NULL,
    schema_json         JSON NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
    UNIQUE uniq_seoable (seoable_type, seoable_id)
);

CREATE TABLE media (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    mediable_type   VARCHAR(100) NOT NULL,
    mediable_id     BIGINT UNSIGNED NOT NULL,
    collection      VARCHAR(50) DEFAULT 'default',
    disk            VARCHAR(50) DEFAULT 's3',
    path            VARCHAR(255) NOT NULL,
    alt_text        VARCHAR(255) NULL,
    width           INT NULL,
    height          INT NULL,
    file_size_kb    INT NULL,
    formats         JSON NULL,
    sort_order      INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    INDEX idx_mediable (mediable_type, mediable_id)
);

CREATE TABLE redirects (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    from_path       VARCHAR(500) UNIQUE NOT NULL,
    to_path         VARCHAR(500) NOT NULL,
    status_code     SMALLINT DEFAULT 301,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
);


-- =====================================================================
-- MODULE 8 — LARAVEL FRAMEWORK DEFAULTS (required by the platform itself)
-- =====================================================================

CREATE TABLE password_reset_tokens (
    email       VARCHAR(150) PRIMARY KEY,
    token       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NULL
);

CREATE TABLE sessions (
    id              VARCHAR(255) PRIMARY KEY,
    user_id         BIGINT UNSIGNED NULL,
    ip_address      VARCHAR(45) NULL,
    user_agent      TEXT NULL,
    payload         LONGTEXT NOT NULL,
    last_activity   INT NOT NULL,
    INDEX idx_last_activity (last_activity)
);

CREATE TABLE jobs (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    queue           VARCHAR(100) NOT NULL,
    payload         LONGTEXT NOT NULL,
    attempts        TINYINT UNSIGNED NOT NULL,
    reserved_at     INT UNSIGNED NULL,
    available_at    INT UNSIGNED NOT NULL,
    created_at      INT UNSIGNED NOT NULL,
    INDEX idx_queue (queue)
);

CREATE TABLE failed_jobs (
    id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid        VARCHAR(255) UNIQUE NOT NULL,
    connection  TEXT NOT NULL,
    queue       TEXT NOT NULL,
    payload     LONGTEXT NOT NULL,
    exception   LONGTEXT NOT NULL,
    failed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personal_access_tokens (
    id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tokenable_type  VARCHAR(100) NOT NULL,
    tokenable_id    BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(100) NOT NULL,
    token           VARCHAR(64) UNIQUE NOT NULL,
    abilities       TEXT NULL,
    last_used_at    TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
);

-- =====================================================================
-- End of schema — 45 tables total across 8 modules
-- =====================================================================
