-- BP_WB Initial Database Schema
-- This migration creates all core tables for the Website Builder plugin

-- Page configurations
CREATE TABLE IF NOT EXISTS wb_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_name VARCHAR(255) NOT NULL,
    route_path VARCHAR(500) NOT NULL,
    page_config TEXT NOT NULL, -- JSON stored as TEXT (SQLite compatibility)
    version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    UNIQUE(app_name, route_path)
);

-- Page versions (for history/rollback)
CREATE TABLE IF NOT EXISTS wb_page_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    version INTEGER NOT NULL,
    page_config TEXT NOT NULL, -- JSON stored as TEXT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (page_id) REFERENCES wb_pages(id) ON DELETE CASCADE
);

-- Templates (starting points)
CREATE TABLE IF NOT EXISTS wb_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_config TEXT NOT NULL, -- JSON stored as TEXT
    preview_image VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Component registry (custom components from plugins)
CREATE TABLE IF NOT EXISTS wb_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plugin_name VARCHAR(255) NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    component_config TEXT NOT NULL, -- JSON stored as TEXT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plugin_name, component_name)
);

-- Asset library
CREATE TABLE IF NOT EXISTS wb_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wb_pages_app_route ON wb_pages(app_name, route_path);
CREATE INDEX IF NOT EXISTS idx_wb_pages_created_by ON wb_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_wb_page_versions_page_id ON wb_page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_wb_templates_category ON wb_templates(category);
CREATE INDEX IF NOT EXISTS idx_wb_components_plugin ON wb_components(plugin_name);
CREATE INDEX IF NOT EXISTS idx_wb_assets_file_type ON wb_assets(file_type);

