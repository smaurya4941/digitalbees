import os

base_dir = r"d:\Sachin\digitalbees"

domains = [
    "Practice", "Industry", "Region", "Technology", "CaseStudy", 
    "Resource", "Blog", "Career", "Location", "Lead"
]

domain_subdirs = [
    "Models", "Repositories/Contracts", "Repositories/Eloquent", 
    "Services", "DTOs", "Actions", "Policies"
]

directories = [
    "app/Console/Commands",
    
    # Application Layer
    "app/Application/SEO/Services", "app/Application/SEO/DTOs", "app/Application/SEO/Generators",
    "app/Application/Search/Services", "app/Application/Search/Contracts", "app/Application/Search/Indexers",
    "app/Application/CRM/Services", "app/Application/CRM/Contracts", "app/Application/CRM/DTOs", "app/Application/CRM/Jobs",
    "app/Application/Notification/Services", "app/Application/Notification/Channels",
    
    # Http Layer
    "app/Http/Controllers/Web", "app/Http/Controllers/Api",
    "app/Http/Requests/Contact", "app/Http/Requests/Lead", "app/Http/Requests/Career", "app/Http/Requests/Search",
    "app/Http/Resources", "app/Http/Middleware",
    
    # Infrastructure Layer
    "app/Infrastructure/CRM/Providers", "app/Infrastructure/CRM/Clients",
    "app/Infrastructure/Search/Providers", "app/Infrastructure/Search/Clients",
    "app/Infrastructure/Storage/Providers",
    
    # Other App Folders
    "app/Jobs", "app/Events", "app/Listeners", "app/Notifications", 
    "app/Policies", "app/Providers",
    
    # Support
    "app/Support/SEO", "app/Support/Helpers", "app/Support/Constants", 
    "app/Support/Enums", "app/Support/Exceptions", "app/Support/ValueObjects",
    
    # Laravel Default Roots
    "bootstrap", "config", 
    "database/factories", "database/migrations", "database/seeders", "database/data",
    
    # Public & Resources
    "public/build", "public/images", "public/fonts",
    
    "resources/views/layouts/emails",
    "resources/views/pages",
    "resources/views/templates",
    "resources/views/components/layout",
    "resources/views/components/navigation",
    "resources/views/components/ui",
    "resources/views/components/cards",
    "resources/views/components/forms",
    "resources/views/components/sections",
    "resources/views/components/content",
    "resources/views/components/seo",
    "resources/views/components/feedback",
    "resources/views/emails/leads",
    "resources/views/emails/careers",
    
    "resources/css/tokens", "resources/css/base", "resources/css/components", 
    "resources/css/sections", "resources/css/utilities",
    
    "resources/js/components/navigation", "resources/js/components/search", 
    "resources/js/components/forms", "resources/js/components/accordion", 
    "resources/js/components/tabs", "resources/js/components/chatbot",
    "resources/js/pages", "resources/js/services",
    
    # Others
    "routes",
    "storage/app", "storage/framework", "storage/logs",
    
    # Tests
    "tests/Unit/Domain", "tests/Unit/Application", "tests/Unit/Support",
    "tests/Feature/Web", "tests/Feature/API", "tests/Feature/SEO", "tests/Feature/Leads", "tests/Feature/Search",
    "tests/Browser/Homepage", "tests/Browser/Navigation", "tests/Browser/Forms", "tests/Browser/Careers",
    
    # Github and Docs
    ".github/workflows",
    "docs/architecture", "docs/api", "docs/deployment", "docs/seo", "docs/design-system", "docs/decisions"
]

# Generate domain folders
for domain in domains:
    for subdir in domain_subdirs:
        directories.append(f"app/Domain/{domain}/{subdir}")

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)
    
print(f"Created {len(directories)} directories for DDD Laravel Architecture.")
