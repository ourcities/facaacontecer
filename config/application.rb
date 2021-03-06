require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(:default, Rails.env)

module Selfstarter
  
  class Application < Rails::Application
    # --- Standard Rails Config ---
    config.time_zone            = 'Brasilia'
    config.encoding             = "utf-8"
    config.i18n.default_locale  = "pt-BR"
    config.i18n.locale          = "pt-BR"
    I18n.enforce_available_locales = false 
    config.filter_parameters    += [:password]
    
    # Enable the asset pipeline
    config.assets.enabled           = true
    config.assets.initialize_on_precompile = false
    
    # Version of your assets, change this if you want to expire all your assets
    config.assets.version           = '1.0'
    
    # Enable escaping HTML in JSON.
    config.active_support.escape_html_entities_in_json = true
  end
end
